import os
import uuid
from langchain_core.messages import (
    SystemMessage,
    RemoveMessage,
    HumanMessage,
    AIMessage,
)
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt
from typing import Literal, TypedDict
from ..state import StateService, Feedback
from langchain_groq import ChatGroq

from rich.console import Console

from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from psycopg import AsyncConnection

from .prompts import (
    CATEGORIZED_PROMPT,
    GREETING_PROMPT,
    OFFTOPIC_PROMPT,
    QUESTION_PROMPT,
    SCENARIO_UNDERSTANDING_PROMPT,
    SCENARIO_REVISION_WITH_ANSWER_PROMPT,
    SCENARIO_SUMMARY_PROMPT,
    GATHER_FUNC_NON_FUNC_PROMPT,
    BPMN_GENERATION_PROMPT,
    BPMN_PROMPT,
    ARC42_GENERATION_PROMPT,
    FEEDBACK_PROMPT,
    EVALUATE_BPMN_PROMPT,
    BPMN_VALIDATION_PROMPT,
    CONTEXT_UPDATE
)

from dotenv import load_dotenv

load_dotenv()

class ChatConfig(TypedDict):
    thread_id: str
    recursion_limit: int
    checkpoint_ns: str
    checkpoint_id: str


class ChatConfigWrapper(TypedDict):
    configurable: ChatConfig


class ChatService:
    def __init__(self, groq_api_key: str):
        self.llm = ChatGroq(
            groq_api_key=groq_api_key,
            model="llama-3.1-8b-instant",
            temperature=0.6,
            model_kwargs={
            "top_p": 0.95,
            "seed": 4,
            },
            max_tokens=None,
            timeout=None,
            max_retries=2,
            streaming=True,
        )
        self.memory = None
        self.app = None
        self.evaluator = None

    async def init_memory(self):
        """Initialize the memory with AsyncPostgresSaver"""
        conn_string = os.getenv("DB_URI")
        if not conn_string:
            raise ValueError("DB_URI environment variable not set")
        connection_kwargs = {
            "autocommit": True,
            "prepare_threshold": 0,
        }
        try:
            self.conn = await AsyncConnection.connect(conn_string, **connection_kwargs)
            self.memory = AsyncPostgresSaver(self.conn)
            return self.memory
        except Exception as e:
            if hasattr(self, "conn"):
                await self.conn.close()
                raise RuntimeError(
                    f"Failed to initialize database connection: {str(e)}"
                ) from e

    # __call__ method is used to make the class callable (awaitable)
    async def __call__(self, *args, **kwds):
        try:
            # create the workflow
            workflow = self.create_workflow()
            self.memory = await self.init_memory()
            
            await self.memory.setup()

            # Compile the workflow
            self.app = workflow.compile(checkpointer=self.memory)
            
            # Augment the LLM with schema for structured output
            # self.evaluator =  self.llm.with_structured_output(Feedback)

            return self.app
        except Exception as e:
            print(f"Error in workflow execution: {e}")
            raise

    def create_workflow(self):
        workflow = StateGraph(StateService)

        # Add nodes
        workflow.add_node("categorize", self.categorize_message)
        workflow.add_node("gateway", self.gateway)
        workflow.add_node(self.summarize_conversation)
        workflow.add_node("handler", self.handler)
        workflow.add_node("agent", self.call_agent)
        workflow.add_node("human", self.human_input)
        workflow.add_node("gather", self.gather)
        workflow.add_node("generate", self.generate_bpmn)
        # workflow.add_node("evaluate", self.evaluate_bpmn)
        # workflow.add_node("collect_feedback", self.collect_feedback)
        # workflow.add_node("process_feedback", self.process_feedback)

        # Add edges
        workflow.add_edge(START, "categorize")
        workflow.add_edge("categorize", "gateway")

        # Conditional edge for gateway
        workflow.add_conditional_edges(
            "gateway",
            self.gateway_router,
            {
                "summarize_conversation": "summarize_conversation",  # return to summarize_conversation if messages > 6
                "categorize": "categorize",  # return to categorize if category is not found
                "handler": "handler",  # return to handler if category is greeting or offtopic
                "agent": "agent",  # return to agent if category is process
                "human": "human",  # return to human if there are questions to ask
            },
        )
        workflow.add_edge(
            "handler", END
        )  # end the conversation if category is greeting or offtopic
        workflow.add_edge(
            "summarize_conversation", "gateway"
        )  # return to gateway after summarizing the conversation

        # INPROGRESS
        workflow.add_edge("agent", "human")  # go to human if there are questions to ask
        # workflow.add_edge("human", "gather") # go to gather for funtional and non-funitonal requirements
        # workflow.add_edge("gather", END) # go to generate for generating the bpmn diagram

        # workflow.add_edge("gather", "generate") # go to generate for generating the bpmn diagram
        # workflow.add_edge(
        #     "generate", END
        # )
        
        workflow.add_edge("generate", END)
        # workflow.add_conditional_edges(
        #     "evaluate",
        #     self.route_joke,
        #     {  # Name returned by route_joke : Name of next node to visit
        #         "Accepted": END,
        #         "Rejected + Feedback": "generate",
        #     },
        # )



        return workflow

    async def get_thread_config(self, thread_id: str) -> ChatConfigWrapper:
        """Get the configuration for a specific thread ID."""
        return {
            "configurable": {
                "thread_id": thread_id,
                "checkpoint_ns": "",
                "checkpoint_id": str(uuid.uuid4()),
                "recursion_limit": os.getenv("RECURSION_LIMIT"),
            }
        }


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # workflow node handlers 
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    def gateway_router(
        self, state: StateService
    ) -> Literal["categorize", "handler", "agent", "summarize_conversation"]:
        print("Entering gateway_router")
        """
      Central routing function that determines the next node based on message category and conversation state.
      
      Logic flow:
      1. Check if category exists, if not -> categorize
      2. Check message count for summarization
      3. Route based on message category
      
      Returns:
          str: Name of the next node to execute
      """
        # Get current state information
        category = state.get("category")
        messages = state.get("messages", [])
        is_interrupted = state.get("is_interrupted", False)

        # Debug logging
        print(f"Gateway router - Category: {category}, Message count: {len(messages)}")

        if is_interrupted:
            print("Interrupted flow, routing to human")
            return "human"

        # Step 1: Check if we need categorization
        if not category:
            print("No category found, routing to categorizer")
            return "categorize"

        # Step 2: Check if we need to summarize (if more than 6 messages)
        if len(messages) > 6:
            print("Message threshold reached, routing to summarizer")
            return "summarize_conversation"

        # Step 3: Route based on category
        if category in ["greeting", "offtopic"]:
            # print(f"Routing {category} message to handler")
            return "handler"
        elif category == "process":
            print("Routing process message to agent")
            return "agent"

        # Fallback to categorization if something's wrong
        print("Unexpected state, re-categorizing")
        return "categorize"

    # Logic to summarize the conversation
    def summarize_conversation(self, state: StateService):
        summary = state.get("summary", "")
        if summary:
            # If a summary already exists, we use a different system prompt
            # to summarize it than if one didn't
            summary_message = (
                f"This is summary of the conversation to date: {summary}\n\n"
                "Extend the summary by taking into account the new messages above:"
            )
        else:
            summary_message = "Create a summary of the conversation above:"

        messages = state["messages"] + [HumanMessage(content=summary_message)]
        response = self.llm.invoke(messages)
        # We now need to delete messages that we no longer want to show up
        # I will delete all except the last one, but you can change this
        delete_messages = [RemoveMessage(id=m.id) for m in state["messages"][:-1]]
        return {"summary": response.content, "messages": delete_messages}

    # Logic to determine the category of the message
    def categorize_message(self, state: StateService):
        messages = state["messages"]
        message = messages[-1] if messages else None  # Get last message safely

        system_prompt = SystemMessage(
            content=CATEGORIZED_PROMPT.format(message=message.content)
        )
        response = self.llm.invoke(system_prompt.content)

        if response.content in ["greeting", "process", "offtopic"]:
            return Command(
                update={"messages": messages, "category": response.content},
                goto="gateway",
            )

    def handler(self, state: StateService):
        category = state.get("category", [])
        if category == "greeting":
            return self.handle_greeting(state)
        else:
            return self.handle_offtopic(state)

    def handle_greeting(self, state: StateService):
        message = (
            state.get("messages")[-1]
            if state.get("messages") and len(state.get("messages")) > 0
            else []
        )
        system_prompt = SystemMessage(content=GREETING_PROMPT)
        response = self.llm.invoke(system_prompt.content)

        # # make sure the response has the same ID as the message to merge them
        # response.id = message.id

        return {"messages": [response]}

    def handle_offtopic(self, state: StateService):
        message = (
            state.get("messages")[-1]
            if state.get("messages") and len(state.get("messages")) > 0
            else []
        )
        if message:
            system_prompt = SystemMessage(
                content=OFFTOPIC_PROMPT.format(question=message.content)
            )
        else:
            system_prompt = SystemMessage(content=OFFTOPIC_PROMPT.format(question=""))
        response = self.llm.invoke(system_prompt.content)

        # # make sure the response has the same ID as the message to merge them
        # response.id = message.id

        return {"messages": [response]}

    def gateway(self, state: StateService):
        next_node = state.get("next_step", None)
        if next_node is not None:
            return Command(goto=next_node)

    # agent will generate questions to clarify the scenario (max 3 questions)
    async def call_agent(self, state: StateService):
        print("Entering call_agent")
        # Initialize human-in-loop dict if not exists
        # state["human_in_loop"] = state.get("human_in_loop", {})
        next_step = state.get("next_step")
        if next_step is not None and next_step != "agent":
            return Command(goto=next_step)
        else:
            summary = state.get("summary", "")
            messages = state.get("messages", [])
            message = messages[-1]

            # Get context and questions
            context_prompt = SystemMessage(
                content=SCENARIO_UNDERSTANDING_PROMPT.format(
                    scenario_text=message.content
                )
            )
            context = self.llm.invoke(context_prompt.content)

            system_prompt = SystemMessage(
                content=QUESTION_PROMPT.format(
                    scenario_question=message,
                    summary_context=summary,
                    context=context.content,
                )
            )
            questions = self.llm.invoke(system_prompt.content, model="mixtral-8x7b-32768", temperature=0.6, top_p=0.95, seed=4)

            # Extract and clean questions
            questions_list = [
                q.lstrip("0123456789. ")
                for q in questions.content.strip().split("\n")
                if q.strip()
            ]
            # print(f"Questions: {questions_list}")
            # print(f"Context: {context.content}")
            human_in_loop_dict = {str(q): None for q in questions_list}
            print(f"Human in loop: {human_in_loop_dict}")

            return {
                "questions": questions_list,
                "context": context.content,
                "human_in_loop": human_in_loop_dict,
                "is_interrupted": True,  # Interrupt the workflow to ask questions
            }


    def human_input(self, state: StateService):
        is_interrupted = state.get("is_interrupted", False)
        messages = state.get("messages", [])
        summary = state.get("summary", "")
        questions = state.get("questions", [])
        context = state.get("context", "")
        human_in_loop_dict = state.get("human_in_loop", {})

        if is_interrupted:
            # Find first unanswered question
            for k, v in human_in_loop_dict.items():
                # print (f"Key: {k}, Value: {v}")
                if v is None:
                    # print(f"Interrupting for Question: {k}")
                    # Interrupt with question
                    interrupt(k)
                # print(f"Interruption skipped for: {k}")

            print("All questions answered")
            # If all questions are answered, use the questions and answers to update the context
            system_prompt = SystemMessage(
                content=SCENARIO_REVISION_WITH_ANSWER_PROMPT.format(
                    summary=summary, context=context, qa_pairs=human_in_loop_dict
                )
            )
            new_context = self.llm.invoke(system_prompt.content, model="mixtral-8x7b-32768", temperature=0.6, top_p=0.95, seed=4)

            scenario_prompt = SystemMessage(
                content=SCENARIO_SUMMARY_PROMPT.format(
                    context=new_context.content,
                    summary=summary,
                    qa_pairs=human_in_loop_dict,
                )
            )
            scenario_summary = self.llm.invoke(scenario_prompt.content)

            # All questions answered, proceed to gather
            return Command(
                update={
                    "messages": messages,
                    "human_in_loop": human_in_loop_dict,
                    "is_interrupted": False,
                    "questions": questions,
                    "context": new_context.content,
                    "scenario": scenario_summary.content,
                },
                goto="gather",
            )


    def gather(self, state: StateService):
        print("Entering gather")
        scenario = state.get("scenario", "")
        print("Gathering functional and non-functional requirements")
        summary = state.get("summary", "")
        context = state.get("context", "")

        # Get functional and non-functional requirements
        system_prompt = SystemMessage(
            content=GATHER_FUNC_NON_FUNC_PROMPT.format(
                scenario=scenario, context=context, summary=summary
            )
        )
        response = self.llm.invoke(system_prompt.content, model="llama3-70b-8192", temperature=0.6, top_p=0.95, seed=4)

        return Command(update={"gathered_info": response.content,  "questions": None, "human_in_loop": {} }, goto="generate")

    def generate_bpmn(self, state: StateService):
        print("Generating BPMN")
        context = state.get("context", "")
        messages = state.get("messages", [])
        
        # feedback = state.get('feedback', None)
        # xml = state.get('bpmn_xml', '')
        last_message = messages[-1]
        
        
        
        # if feedback:            
            
        #     system_prompt = SystemMessage(content=BPMN_VALIDATION_PROMPT.format(xml=bpmn_xml,context=context,feedback=feedback))
        #     bpmn_xml = self.llm.invoke(
        #         system_prompt.content, model="llama3-70b-8192", temperature=0.8,
        #         top_p=0.95, seed=4
        #     )
            
        #     context_update_propmt = SystemMessage(content=CONTEXT_UPDATE.format(context=context,user_message=last_message))
        #     updated_context = self.llm.invoke(
        #         context_update_propmt.content, model="mixtral-8x7b-32768", temperature=0.6,
        #         top_p=0.95, seed=4
        #     )
        #     return Command(update={"bpmn_xml": bpmn_xml, 'context': updated_context, 'messages': messages})
        #     return {"" }
        
        # else:
        bpmn_prompt = BPMN_GENERATION_PROMPT.format(context=context)
        system_prompt = SystemMessage(content=bpmn_prompt)
        bpmn_xml = self.llm.invoke(
            system_prompt.content, model="llama3-70b-8192", temperature=0.8,
            top_p=0.95, seed=4
        )  # llama-3.3-70b-versatile llama3-70b-8192
        bpmn_xml = bpmn_xml.content
        
        # print("xml is ",bpmn_xml)

        # Clean XML
        xml_start = bpmn_xml.find("<?xml")
        xml_end = bpmn_xml.find("</bpmn:definitions>") + len("</bpmn:definitions>")
        if xml_start >= 0 and xml_end >= 0:
            bpmn_xml = bpmn_xml[xml_start:xml_end]
        # print(f"BPMN XML: {bpmn_xml}")
        return Command(update={"bpmn_xml": bpmn_xml, "messages": last_message})


    # def evaluate_bpmn(self, state: StateService):
    #     """Evaluate the BPMN XML for correctness. also consider the feedback from the user"""
    #     print("Evaluating BPMN")        
    #     xml = state.get("bpmn_xml", "")
    #     context = state.get("context", "")
        
    #     response = self.evaluator.invoke(EVALUATE_BPMN_PROMPT.format(xml=xml, context=context), model="llama3-70b-8192", temperature=0.8, top_p=0.95, seed=4)
    #     print(f"grade in evaluator is after {response}")
    #     # return Command(update={"grade": response.grade, 'messages': state.get('messages')})
    #     # return {"grade": grade.grade, "feedback": grade.feedback}


    # # Conditional edge function to route back to joke generator or end based upon feedback from the evaluator
    # def route_joke(self, state: StateService):
    #     """Route back to generator or end based upon feedback from the evaluator"""
    #     grade = state.get("grade", '')
        
    #     if grade == "valid":
    #         return "Accepted"
    #     elif grade == "invalid":
    #         return "Rejected + Feedback"
    #     else: END
        
        
        
    # def collect_feedback(self, state: StateService):
    #     bpmn_xml = state.get("bpmn_xml", "")
    #     messages = state.get("messages", [])

    #     system_prompt = SystemMessage(content=FEEDBACK_PROMPT)
    #     response = self.llm.invoke(system_prompt.content)

    #     return {"messages": [response]}

    # def process_feedback(self, state: StateService):
    #     feedback = state.get("messages", [])[-1]
    #     if feedback.content.lower() in ["yes", "y"]:
    #         return Command(goto="END")
    #     else:
    #         return Command(update={"next_step": "agent"})






# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # Processing message through the workflow and streaming the response
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    async def get_thread_history(self, config: ChatConfigWrapper, value: str):
        """Get message history with connection management."""
        try:
            if not self.app:
                await self.__call__()

            thread_config = {
                "configurable": {
                    "thread_id": config["configurable"]["thread_id"],
                }
            }

            state = await self.app.aget_state(thread_config)

            if not state:
                return None

            if value == "history":
                return state.values if hasattr(state, "values") else None
            elif value == "tasks":
                if hasattr(state, "tasks") and state.tasks:
                    if len(state.tasks) > 0 and hasattr(state.tasks[0], "interrupts"):
                        return state.tasks[0].interrupts
            return None

        except Exception as e:
            print(f"Error retrieving thread: {e}")
            return None

    async def process_message(self, message: str, config: ChatConfigWrapper):
        """Process a message through the workflow and stream the response."""
        try:
            if not self.app:
                await self.__call__()

            last_state = await self.get_thread_history(config, "history")

            task = await self.get_thread_history(config, "tasks")
            print("tasks",task)
            if task is not None:
                human_in_loop_dict: dict = last_state.get("human_in_loop", {})

                for k, v in human_in_loop_dict.items():
                    if v is None:
                        current_question = k
                        break

                if current_question:
                    human_in_loop_dict[current_question] = message
                    state_to_update = StateService(
                        messages=last_state.get("messages", [])
                        + [
                            AIMessage(content=current_question),
                            HumanMessage(content=message),
                        ],
                        category=last_state.get("category"),
                        questions=last_state.get("questions", []),
                        context=last_state.get("context", ""),
                        human_in_loop=human_in_loop_dict,
                        next_step="human",
                        is_interrupted=last_state.get("is_interrupted", False),
                        summary=last_state.get("summary", ""),
                        scenario=last_state.get("scenario", ""),
                        can_proceed=last_state.get("can_proceed", False),
                        bpmn_xml=last_state.get("bpmn_xml", None),
                        grade=None,
                        feedback=''
                    )

                    # await self.app.aupdate_state(config, state_to_update)
                    # updated_state = await self.get_thread_history(config, "history")
                    # rich.print("==========================================================")
                    # rich.print(f"State updated: {updated_state}")
                    # rich.print("==========================================================")

                    # Update messages with the answer
                    # messages = last_state.get('messages', [])
                    # messages.append(HumanMessage(content=message))

                    # # Resume with updated state
                    # resume_state = {
                    #     "messages": messages,
                    #     "human_in_loop": human_in_loop_dict,
                    #     "questions": last_state.get('questions', []),
                    #     "context": last_state.get('context', ''),
                    #     "is_interrupted": True,  # Keep true until all questions answered
                    #     "category": last_state.get('category'),
                    #     "current_question": None  # Clear current question
                    # }
                    """ rich.print("==========================================================")
                rich.print("")
                rich.print("Resuming workflow with updated state")
                rich.print("")
                rich.print("==========================================================") """
                    # async for step in self.app.astream(
                    #     Command(resume=message, update=state_to_update, goto="human"),
                    #     config=config,
                    #     stream_mode="updates"
                    # ):
                    #     yield await self.process_step(step, config)
                    # return

                    async for step in self.app.astream(
                        Command(resume=message, update=state_to_update),
                        config=config,
                        stream_mode="updates",
                    ):
                        yield await self.process_step(step, config)
                    return

            if last_state:
                state = last_state
                state["messages"].append(HumanMessage(content=message))
            else:
                state = StateService(
                    messages=[HumanMessage(content=message)],
                    category=None,
                    next_step=None,
                    human_in_loop={},
                    questions=None,
                    is_interrupted=False,
                    context=None,
                    summary=None,
                    scenario=None,
                    can_proceed=False,
                    # functional_requirements=[],
                    # nonfunctional_requirements=[],
                    gathered_info=None,
                    bpmn_xml=None,
                    grade=None,
                    feedback=''
                )

            async for step in self.app.astream(state, config, stream_mode="updates"):
                yield await self.process_step(step, config)

        except Exception as e:
            print(f"Error in process_message: {e}")
            yield f"Error: {str(e)}"
            
    async def process_step(self, step, config: ChatConfigWrapper):
        """Process a single step from the workflow stream."""

        # rich = Console();
        # rich.print("step: ", step)
        # Get first key from step dict
        parent_key = next(iter(step))

        # Handle interrupt case
        if parent_key == "__interrupt__":
            question = (
                step[parent_key].value
                if hasattr(step[parent_key], "value")
                else step[parent_key][0].value
            )
            return question

        # Handle BPMN XML case
        if isinstance(step[parent_key], dict) and "bpmn_xml" in step[parent_key]:
            bpmn_xml = step[parent_key]["bpmn_xml"]
            return bpmn_xml

        # Handle messages case
        if isinstance(step[parent_key], dict) and "messages" in step[parent_key]:
            step = step[parent_key]
            if "messages" in step and step["messages"]:
                if isinstance(step["messages"][-1], AIMessage):
                    return step["messages"][-1].content

        return None

    async def generate_arc42_doc(self, config: ChatConfigWrapper):
        """Generate an arc42 document based on the context."""
        try:
            if not self.app:
                await self.__call__()

            # Get the thread history
            state = await self.get_thread_history(config, "history")

            if not state:
                raise Exception("No thread history found")

            # Extract required information
            gathered_info = state.get("gathered_info", "")
            context = state.get("context", "")

            # Generate the arc42 document
            bpmn_prompt = ARC42_GENERATION_PROMPT.format(
                context=context, gathered_info=gathered_info
            )
            system_prompt = SystemMessage(content=bpmn_prompt)
            response = self.llm.invoke(system_prompt.content)
            return response.content

        except Exception as e:
            print(f"Error generating arc42 document: {e}")
            return None
