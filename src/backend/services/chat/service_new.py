import os
import uuid
import aiofiles
import asyncio
from langchain_core.messages import SystemMessage, RemoveMessage, HumanMessage, AIMessage
# from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt
from typing import Literal, TypedDict
from ..graph import GraphService
from ..state import StateService
from langchain_groq import ChatGroq

from rich.console import Console

from psycopg_pool import AsyncConnectionPool
from psycopg.rows import dict_row
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from .prompts import CATEGORIZED_PROMPT, GREETING_PROMPT, OFFTOPIC_PROMPT, QUESTION_PROMPT, SCENARIO_UNDERSTANDING_PROMPT, SCENARIO_REVISION_WITH_ANSWER_PROMPT, SCENARIO_SUMMARY_PROMPT, GATHER_FUNC_NON_FUNC_PROMPT, BPMN_PROMPT

from dotenv import load_dotenv
load_dotenv()

from IPython.display import Image, display
from langchain_core.runnables.graph import CurveStyle, MermaidDrawMethod, NodeStyles
import nest_asyncio
import json
import re

class ChatConfig(TypedDict):
  thread_id: str
  recursion_limit: int
  checkpoint_ns: str
  checkpoint_id: str

class ChatConfigWrapper(TypedDict):
  configurable: ChatConfig

class ChatService:
  def __init__(self, groq_api_key: str, graph_service: GraphService):
      self.llm = ChatGroq(groq_api_key=groq_api_key, streaming=True,model="mixtral-8x7b-32768")
      self.graph = graph_service
      self.pool = None
      self.pool_context = None
      self.memory = None
      self.app = None
      self._lock = asyncio.Lock()  # Add lock for connection management
      self._retries = 3  # Add retry count
      self._connection_timeout = 30  # Add timeout

  async def create_checkpointer(self):
      """Initialize PostgreSQL checkpointer with connection pool."""
      async with self._lock:
          try:
              # Only cleanup if we have an existing connection
              if self.pool_context:
                  await self.cleanup()
              
              connection_kwargs = {
                  "autocommit": True,
                  "prepare_threshold": 0,
                  "row_factory": dict_row,
                  "keepalives": 1,
                  "keepalives_idle": 30,
                  "keepalives_interval": 10,
                  "keepalives_count": 5,
                  "connect_timeout": self._connection_timeout,
                  "options": "-c statement_timeout=60000 -c idle_in_transaction_session_timeout=60000"  # Server settings as options
              }

              self.pool_context = AsyncConnectionPool(
                  conninfo=os.getenv('DB_URI'),
                  max_size=5,
                  min_size=1,
                  timeout=self._connection_timeout,
                  kwargs=connection_kwargs,
              )
              
              self.pool = await self.pool_context.__aenter__()
              checkpointer = AsyncPostgresSaver(self.pool)
              await checkpointer.setup()
              return checkpointer

          except Exception as e:
              print(f"Failed to setup checkpointer: {e}")
              await self.cleanup()
              raise

  async def ensure_connection(self):
      """Ensure database connection with retries."""
      for attempt in range(self._retries):
          try:
              if not self.pool or not self.pool_context:
                  self.memory = await self.create_checkpointer()
                  return
              
              # Test connection
              async with self.pool.connection() as conn:
                  await conn.execute("SELECT 1")
                  return
                  
          except Exception as e:
              print(f"Connection attempt {attempt + 1} failed: {e}")
              await self.cleanup()
              if attempt == self._retries - 1:
                  raise
              await asyncio.sleep(1)  # Wait before retry
              
          finally:
              # Ensure we have a valid connection
              if not self.pool or not self.pool_context:
                  self.memory = await self.create_checkpointer()

  async def cleanup(self):
      """Enhanced cleanup with proper order and error handling."""
      async with self._lock:  # Thread-safe cleanup
          try:
              if self.pool_context:
                  # Close pool first
                  if self.pool:
                      await self.pool.close()
                  # Then exit context
                  await self.pool_context.__aexit__(None, None, None)
                  
              # Clear references
              self.pool = None
              self.pool_context = None
              self.memory = None
          except Exception as e:
              print(f"Error during cleanup: {e}")
              # Reset references even if cleanup fails
              self.pool = None
              self.pool_context = None
              self.memory = None

  # __call__ method is used to make the class callable (awaitable)
  async def __call__(self, *args, **kwds):
    try:
      # create the workflow
      workflow = self.create_workflow()
      self.memory = await self.create_checkpointer()

      # Compile the workflow
      self.app = workflow.compile(checkpointer=self.memory)      

      # await self.draw_graph()
      return self.app
    except Exception as e:
      print(f"Error in workflow execution: {e}")
      raise
  
  # not working
  async def draw_graph(self):
    """Draw the workflow graph and save it as PNG."""
    if self.app:
      try:
        nest_asyncio.apply()  # Required for Jupyter Notebook to run async functions

        graph = self.app.get_graph()
        graph_bytes = graph.draw_mermaid_png(
          curve_style=CurveStyle.LINEAR,
          node_colors=NodeStyles(first="#ffdfba", last="#baffc9", default="#fad7de"),
          wrap_label_n_words=9,
          output_file_path=None,
          draw_method=MermaidDrawMethod.PYPPETEER,
          background_color="white",
          padding=10,
        )

        # Save the graph to a file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(current_dir, "workflow_graph.png")
        
        async with aiofiles.open(output_path, 'wb') as f:
          await f.write(graph_bytes)

        return True

      except Exception as e:
        print(f"Error drawing graph: {e}")
        return False
    return False  
  
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
    

    # Add edges
    workflow.add_edge(START, "categorize")
    workflow.add_edge("categorize", "gateway")

    # Conditional edge for gateway
    workflow.add_conditional_edges(
        "gateway",
        self.gateway_router,
        {   
            "summarize_conversation": "summarize_conversation", # return to summarize_conversation if messages > 6
            "categorize": "categorize", # return to categorize if category is not found
            "handler": "handler", # return to handler if category is greeting or offtopic
            "agent": "agent" # return to agent if category is process
        }
    )
    workflow.add_edge("handler", END) # end the conversation if category is greeting or offtopic
    workflow.add_edge("summarize_conversation", "gateway") # return to gateway after summarizing the conversation

    # INPROGRESS
    workflow.add_edge("agent", "human") # go to human if there are questions to ask 
    workflow.add_edge("human", "gather") # go to gather for funtional and non-funitonal requirements
    
    workflow.add_edge("gather", "generate") # go to generate for generating the bpmn diagram
    workflow.add_edge("generate", END) # end the conversation after generating the bpmn diagram

    # Yet to be implemented
    # workflow.add_edge("gather", "plan") # go to plan for generating detailed instruction on the bpmn diagram adhering to the requirements 
    # workflow.add_edge("plan", "generate") # go to generate for generating the bpmn diagram


    return workflow
  
  # not used
  # Define the async iterator method to fetch messages from the checkpointer
  async def __aiter__(self, config: ChatConfigWrapper):
    if self.app:
      async with AsyncPostgresSaver.from_conn_string(os.getenv('DB_URI')) as checkpointer:
        return [c async for c in checkpointer.alist(config)]
    return []
  
  async def create_new_config(self) -> ChatConfigWrapper:
    """Create a new thread ID and return config wrapper."""
    return {"configurable": {
        "thread_id": str(uuid.uuid4()),
        "checkpoint_ns": "",
        "checkpoint_id": str(uuid.uuid4()),
        "recursion_limit": os.getenv('RECURSION_LIMIT')
      }}
  
  async def get_thread_config(self, thread_id: str) -> ChatConfigWrapper:
    """Get the configuration for a specific thread ID."""
    return {"configurable": {
        "thread_id": thread_id,
        "checkpoint_ns": "",
        "checkpoint_id": str(uuid.uuid4()),
        "recursion_limit": os.getenv('RECURSION_LIMIT')
      }}
  
  # not used 
  async def check_thread_exists(self, thread_id: str) -> bool:
    """Check if a thread ID exists in the conversation states.
    
    Args:
      thread_id: The thread ID to check
      
    Returns:
      bool: True if thread exists, False otherwise
    """
    if not self.memory:
      return False
      
    try:
      # Query the checkpointer to see if any states exist for this thread
      config = {"configurable": {"thread_id": thread_id}}
      async with self.memory as checkpointer:
        # Try to get the first state for this thread
        async for _ in checkpointer.alist(config):
          return True
        return False
    except Exception as e:
      print(f"Error checking thread existence: {e}")
      return False
  

  def gateway_router(self, state: StateService) -> Literal["categorize", "handler", "agent", "summarize_conversation"]:
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
      category = state.get('category')
      messages = state.get('messages', [])
      
      # Debug logging
      print(f"Gateway router - Category: {category}, Message count: {len(messages)}")
      
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
    
    system_prompt = SystemMessage(content=CATEGORIZED_PROMPT.format(message=message.content))
    response = self.llm.invoke(system_prompt.content)
  
    if response.content in ["greeting", "process", "offtopic"]:
      return Command(
          update={
              "messages": messages,
              "category": response.content},
          goto="gateway"
      )
  
  def handler(self, state: StateService):
    category = state.get('category', [])
    if category == "greeting":
      return self.handle_greeting(state)
    else:
      return self.handle_offtopic(state)
    
  def handle_greeting(self, state: StateService):
    message = state.get('messages')[-1] if state.get('messages') and len(state.get('messages')) > 0 else []
    system_prompt = SystemMessage(content=GREETING_PROMPT)
    response = self.llm.invoke(system_prompt.content)

    # # make sure the response has the same ID as the message to merge them
    # response.id = message.id

    return {"messages": [response]}
  
  def handle_offtopic(self, state: StateService):
    message = state.get('messages')[-1] if state.get('messages') and len(state.get('messages')) > 0 else []
    if message : 
      system_prompt = SystemMessage(content=OFFTOPIC_PROMPT.format(question=message.content))
    else:
      system_prompt = SystemMessage(content=OFFTOPIC_PROMPT.format(question=""))
    response = self.llm.invoke(system_prompt.content)
    
    # # make sure the response has the same ID as the message to merge them 
    # response.id = message.id

    return {"messages":[response]}      
  
  
  def gateway(self, state: StateService):
    next_node = state.get('next_step', None)
    if next_node is not None:
      return Command(goto=next_node)

  # agent will generate questions to clarify the scenario (max 3 questions)
  async def call_agent(self, state: StateService):
    # Initialize human-in-loop dict if not exists
    # state["human_in_loop"] = state.get("human_in_loop", {})
    next_step = state.get('next_step')
    if next_step is not None and next_step != "agent":
      return Command(goto=next_step)
    else:
      summary = state.get('summary', '')
      messages = state.get('messages', [])
      message = messages[-1]

      # Get context and questions
      context_prompt = SystemMessage(content=SCENARIO_UNDERSTANDING_PROMPT.format(scenario_text=message.content))
      context = self.llm.invoke(context_prompt.content)
      
      system_prompt = SystemMessage(content=QUESTION_PROMPT.format(
        scenario_question=message, 
        summary_context=summary, 
        context=context.content
      ))
      questions = self.llm.invoke(system_prompt.content)

      # Extract and clean questions
      questions_list = [
        q.lstrip('0123456789. ') 
        for q in questions.content.strip().split('\n') 
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
        "is_interrupted": True # Interrupt the workflow to ask questions
      }
    # # Collect answers for each question
    # for question in questions_list:
    #   # print(f"Question: {question}")
    #   if question not in state["human_in_loop"]:
    #     answer = self.human_input(question)
    #     state["human_in_loop"][question] = answer

    # return {
    #   "messages": [AIMessage(content="Questions collected successfully")],
    #   "human_in_loop": state["human_in_loop"]
    # }
    #   # Add response to messages
    # state["messages"].append(HumanMessage(content=response["messages"][0]["content"]))

  # agent router will goto human if there are questions to ask
  # else it will goto gather for processing

  
  def human_input(self, state: StateService):
    messages = state.get('messages', [])
    summary = state.get('summary', '')
    questions = state.get('questions', [])
    context = state.get('context', '')
    human_in_loop_dict = state.get('human_in_loop', {})

    # Find first unanswered question
    for k,v in human_in_loop_dict.items():
      print (f"Key: {k}, Value: {v}")
      if v is None:
        print(f"Interrupting for Question: {k}")
        # Interrupt with question
        interrupt(k)
      print(f"Interruption skipped for: {k}")
    
    print("All questions answered")
    # If all questions are answered, use the questions and answers to update the context
    system_prompt = SystemMessage(content=SCENARIO_REVISION_WITH_ANSWER_PROMPT.format(summary=summary, context=context, qa_pairs=human_in_loop_dict))
    new_context = self.llm.invoke(system_prompt.content)

    scenario_prompt = SystemMessage(content=SCENARIO_SUMMARY_PROMPT.format(context=new_context.content, summary=summary, qa_pairs=human_in_loop_dict))
    scenario_summary = self.llm.invoke(scenario_prompt.content)

    # All questions answered, proceed to gather
    return Command(
        update={
            "messages": messages,
            "human_in_loop": human_in_loop_dict,
            "is_interrupted": False,
            "questions": questions,
            "context": new_context.content,
            "scenario": scenario_summary.content
        }
    )

        # # Add question to message history
        # messages.append(SystemMessage(content=question))

        # # Interrupt for answer
        # answer = interrupt(question)
          
        # print(f"Question: {question}")
        # print(f"Answer: {answer}")
        # # After resume, answer contains user's response
        # human_in_loop_dict[question] = answer  # Store response

        # messages.append(HumanMessage(content=answer))

        # return {
        #     "messages": messages,
        #     "human_in_loop": human_in_loop_dict,
        #     "is_interrupted": True,
        # }

    # print("All questions answered")

    # If all questions are answered, use the questions and answers to update the context
    # system_prompt = SystemMessage(content="")
    # response = self.llm.invoke(system_prompt.content)

    # return {
    #     # "messages": [response],
    #     "human_in_loop": human_in_loop_dict,
    #     "is_interrupted": False
    # }
    

  def gather(self, state: StateService):
    scenario = state.get('scenario', '')
    print("Gathering functional and non-functional requirements")
    summary = state.get('summary', '')
    context = state.get('context', '')

    # Get functional and non-functional requirements
    system_prompt = SystemMessage(content=GATHER_FUNC_NON_FUNC_PROMPT.format(scenario=scenario, context=context, summary=summary))
    response = self.llm.invoke(system_prompt.content, model="llama3-70b-8192")

    print(f"Functional and non-functional requirements: {response.content}")

    # Extract JSON content from the response string
    # json_match = re.search(r'```json\n(.*?)\n```', response, re.DOTALL)
    # if json_match:
    #     json_content = json_match.group(1)
    #     try:
    #         data = json.loads(json_content)
    #     except json.JSONDecodeError as e:
    #         print(f"Error decoding JSON: {e}")
    #         return None

        # # Extract functional and non-functional requirements, decisions, and knowledge graph nodes
        # functional_requirements = data.get("functional_requirements", [])
        # print(f"Functional requirements: {functional_requirements}")
        # non_functional_requirements = data.get("non_functional_requirements", [])
        # decisions = data.get("decisions", [])
        # knowledge_graph_nodes = data.get("knowledge_graph_nodes", [])

    #     # Return a Command to update the state
    #     return Command(
    #         update={
    #             "functional_requirements": functional_requirements,
    #             "nonfunctional_requirements": non_functional_requirements,
    #             # "context": context,
    #             # "scenario": scenario,
    #             # "summary": summary
    #         }
    #     )
    # else:
    #     print("JSON content not found in the response")
    return Command(
      update={
        "functional_and_nonfunctional_requirements": response.content
      }
    )

  def generate_bpmn(self, state: StateService):
    # Retrieve context and state information
    context = state.get('context', '')
    scenario = state.get('scenario', '')
    summary = state.get('summary', '')
    functional_and_nonfunctional_requirements = state.get('functional_and_nonfunctional_requirements', '')

    # Generate BPMN diagram using the LLM
    bpmn_prompt = BPMN_PROMPT.format(context=context, scenario=scenario, summary=summary, functional_and_nonfunctional_requirements=functional_and_nonfunctional_requirements)
    system_prompt = SystemMessage(content=bpmn_prompt)
    bpmn_xml = self.llm.invoke(system_prompt.content, model="llama-3.3-70b-versatile")
    bpmn_xml = bpmn_xml.content

    # Print the generated BPMN diagram
    xml_start = bpmn_xml.find('<?xml')
    xml_end = bpmn_xml.find('</bpmn:definitions>') + len('</bpmn:definitions>')
    if xml_start >= 0 and xml_end >= 0:
        bpmn_xml = bpmn_xml[xml_start:xml_end]
    print(f"BPMN XML: {bpmn_xml}")
    return Command(
      update={
        "bpmn_xml": bpmn_xml
      }
    )
  
  async def get_thread_history(self, config: ChatConfigWrapper, value: str):
    """Get message history with connection management."""
    try:
      if not self.app:
        await self.__call__()
        
      # Ensure connection before operation
      await self.ensure_connection()
        
      thread_config = {
        "configurable": {
          "thread_id": config["configurable"]["thread_id"],
        }
      }

      state = await self.app.aget_state(thread_config)
      
      if not state:
        return None
          
      if value == "history":
        return state.values if hasattr(state, 'values') else None
      elif value == "tasks":
        if hasattr(state, 'tasks') and state.tasks:
          if len(state.tasks) > 0 and hasattr(state.tasks[0], 'interrupts'):
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

          async with self._lock:  # Ensure atomic updates
              await self.ensure_connection()

          last_state = await self.get_thread_history(config, "history")
          rich = Console()
          rich.print("==========================================================")
          rich.print("")
          rich.print("[cyan]Thread history:[/cyan]", last_state)
          rich.print("")
          rich.print("==========================================================")

          task = await self.get_thread_history(config, "tasks")
          if task is not None:
            human_in_loop_dict: dict = last_state.get('human_in_loop', {})
            
            for k,v in human_in_loop_dict.items():
              if v is None:
                current_question = k
                break

            if current_question:
                human_in_loop_dict[current_question] = message
                state_to_update = StateService(
                  messages=last_state.get('messages', []) + [
                    AIMessage(content=current_question),
                    HumanMessage(content=message)
                  ],
                  category=last_state.get('category'),
                  questions=last_state.get('questions', []),
                  context=last_state.get('context', ''),
                  human_in_loop=human_in_loop_dict,
                  next_step="human",
                  is_interrupted=last_state.get('is_interrupted', False),
                  summary=last_state.get('summary', ''),
                  scenario=last_state.get('scenario', ''),
                  can_proceed=last_state.get('can_proceed', False),
                  bpmn_xml=last_state.get('bpmn_xml', None)
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
                rich.print("==========================================================")
                rich.print("")
                rich.print("Resuming workflow with updated state")
                rich.print("")
                rich.print("==========================================================")
                # async for step in self.app.astream(
                #     Command(resume=message, update=state_to_update, goto="human"),
                #     config=config,
                #     stream_mode="updates"
                # ):
                #     yield await self.process_step(step, config)
                # return

                async with self._lock:
                  async for step in self.app.astream(
                    Command(resume=message, update=state_to_update),
                    config=config,
                    stream_mode="updates"
                  ):
                    yield await self.process_step(step, config)
                  return                  
          

          
          # rich.print("==========================================================")
          # rich.print("")
          # rich.print("[cyan]Thread top:[/cyan]", entire_thread)
          # rich.print("")  
          # rich.print("==========================================================")
          

          if last_state:
            state = last_state
            
            # # ==========================================================
            # # # TODO: Identify the category of the message in interrupted flow and base on that route to the next step.
            # # # ie. to agent if category is process, to handler if category is greeting or offtopic etc. (reset the states of iinterrupted flow)

            # # Interrupted flow of the conversation
            # if state['is_interrupted']:
            #   # Get the last question asked
            #   questions = state["questions"]
            #   question = ""
            #   for q in questions:
            #     if q not in state["human_in_loop"]:
            #       question = q
            #       break
              
            # #   rich.print(f"Interrupted question: {q}")
            # #   rich.print(f"Interrupted question answer by user : {message}")
            # #   # Resume the workflow with the user's response
            # #   # await self.app.astream(
            # #   #     Command(resume=message),
            # #   #     config=config
            # #   # )

            #   # this will just invoke the graph not resume the graph where it was interrupted
            #   # async for step in self.app.astream(state, config, stream_mode="updates"):
            #   #   yield await self.process_step(step)

            #   # Resume graph execution with answer
            #   async for step in self.app.astream(
            #       Command(
            #           resume=message,
            #           update={
            #             # "messages": HumanMessage(content=message),
            #             # "human_in_loop": human_in_loop_dict,
            #             "questions": state.get('questions', []),
            #             "context": state.get('context', ''),
            #             "is_interrupted": True  # Keep interrupted until all questions answered
            #           }
            #       ),
            #       config=config,
            #       stream_mode="updates"
            #   ):
            #     yield await self.process_step(step)
                
            # else:
            #   # Normal flow of the conversation
            #   state["messages"].append(HumanMessage(content=message))
            # # ==========================================================

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
              functional_and_nonfunctional_requirements=None,
              bpmn_xml=None
            )
    
          rich = Console()
          rich.print("==========================================================")
          rich.print("")
          rich.print(f"[green]Processing message:[/green] {state}")
          rich.print("")
          rich.print("==========================================================")

          async for step in self.app.astream(state, config, stream_mode="updates"):
            yield await self.process_step(step,config)
            # rich.print("==========================================================")
            # rich.print("")
            # rich.print(f"[yellow]Step: {step}[/yellow]")
            # rich.print("")
            # rich.print("==========================================================")
            # # Get first key from step dict
            # parent_key = next(iter(step))



            # # ==========================================================
            # # Yeild the interrupt value if it exists
            # if parent_key == "__interrupt__":
            #   question = step[parent_key].value if hasattr(step[parent_key], 'value') else step[parent_key][0].value
            #   print(f"Interrupt value: {question}")
            #   yield question
            # # ==========================================================
              
            
            # # Check if there's a nested dict with 'messages' key
            # if isinstance(step[parent_key], dict) and 'messages' in step[parent_key]:
            #   step = step[parent_key]
            #   if "messages" in step and step["messages"]:
            #     # rich.print("==========================================================")
            #     # rich.print("")
            #     # rich.print(f"[cyan]Step: {step}[/cyan]")
            #     # rich.print("")
            #     # rich.print("==========================================================")                    
            #     if isinstance(step["messages"][-1], AIMessage):
            #       yield step["messages"][-1].content
      
      except Exception as e:
        print(f"Error in process_message: {e}")
        yield f"Error: {str(e)}"
        await self.cleanup()  # Cleanup on error

  async def process_step(self, step, config: ChatConfigWrapper):
    """Process a single step from the workflow stream."""
    rich = Console()
    rich.print("==========================================================")
    rich.print("")
    rich.print(f"[yellow]Step: {step}[/yellow]")
    rich.print("")
    rich.print("==========================================================")

    # Get first key from step dict
    parent_key = next(iter(step))

    # Handle interrupt case
    if parent_key == "__interrupt__":
      question = step[parent_key].value if hasattr(step[parent_key], 'value') else step[parent_key][0].value
      # print(f"Interrupt value: {question}")
      tasks = await self.get_thread_history(config,'tasks')
      rich.print("==========================================================")
      rich.print("")
      rich.print("[cyan]Thread bottom tasks :[/cyan]", tasks)
      rich.print("")  
      rich.print("==========================================================")
      return question
    
    
    # Handle BPMN XML case
    if isinstance(step[parent_key], dict) and 'bpmn_xml' in step[parent_key]:
        bpmn_xml = step[parent_key]['bpmn_xml']
        return bpmn_xml

    # Handle messages case
    if isinstance(step[parent_key], dict) and 'messages' in step[parent_key]:
      step = step[parent_key]
      if "messages" in step and step["messages"]:
        if isinstance(step["messages"][-1], AIMessage):
          return step["messages"][-1].content
    
    return None