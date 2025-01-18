from typing import Dict, AsyncGenerator, TypedDict, Annotated, TypeVar
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END, START
from pydantic import BaseModel
from .types import ChatState, ConversationState
from .prompts import SYSTEM_PROMPT, ANALYSIS_PROMPT, VALIDATION_PROMPT, BPMN_PROMPT
from ..graph.service import GraphService

class WorkflowState(BaseModel):
    message: str
    conversation_id: str
    current_state: str
    response: str = ""
    can_proceed: bool = False
    bpmn_xml: str | None = None

class WorkflowInput(TypedDict):
    message: str
    conversation_id: str
    state: ConversationState

class WorkflowOutput(TypedDict):
    response: str
    can_proceed: bool
    state: ConversationState
    bpmn_xml: str | None

class ChatService:
    def __init__(self, groq_api_key: str, graph_service: GraphService):
        self.llm = ChatGroq(groq_api_key=groq_api_key, streaming=True)
        self.graph = graph_service
        self.workflow = self._create_workflow()

    async def _gather_requirements(self, state: WorkflowState) -> WorkflowState:
        async for chunk in self.llm.astream_chat([
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": state.message}
        ]):
            if chunk.content:
                await self.graph.store_requirement({
                    "conversation_id": state.conversation_id,
                    "content": chunk.content,
                    "state": state.current_state
                })
                state.response = chunk.content
                state.can_proceed = "ready" in chunk.content.lower()
        
        return state

    async def _analyze_requirements(self, inputs: dict) -> AsyncGenerator[Dict, None]:
        state = inputs["state"]
        context = await self.graph.get_context(state.conversation_id)
        
        async for chunk in self.llm.astream_chat([
            {"role": "system", "content": ANALYSIS_PROMPT},
            {"role": "user", "content": str(context)}
        ]):
            yield {
                "state": state,
                "response": chunk.content,
                "can_proceed": "complete" in chunk.content.lower()
            }

    async def _validate_requirements(self, inputs: dict) -> AsyncGenerator[Dict, None]:
        state = inputs["state"]
        requirements = await self.graph.get_requirements(state.conversation_id)
        
        async for chunk in self.llm.astream_chat([
            {"role": "system", "content": VALIDATION_PROMPT},
            {"role": "user", "content": str(requirements)}
        ]):
            yield {
                "state": state,
                "response": chunk.content,
                "can_generate": "validated" in chunk.content.lower()
            }

    async def _generate_bpmn(self, inputs: dict) -> AsyncGenerator[Dict, None]:
        state = inputs["state"]
        context = await self.graph.get_context(state.conversation_id)
        
        async for chunk in self.llm.astream_chat([
            {"role": "system", "content": BPMN_PROMPT},
            {"role": "user", "content": str(context)}
        ]):
            yield {
                "state": state,
                "response": chunk.content,
                "bpmn_xml": chunk.content if "<bpmn" in chunk.content else None
            }

    def _create_workflow(self) -> StateGraph:
        workflow = StateGraph(
            state_schema=WorkflowState
        )
        
        # Add nodes
        workflow.add_node("gathering", self._gather_requirements)
        workflow.add_node("analyzing", self._analyze_requirements)
        workflow.add_node("validating", self._validate_requirements)
        workflow.add_node("generating", self._generate_bpmn)
        
        # Add START edge to initiate conversation
        workflow.add_edge(START, "gathering")
        
        # Add remaining edges
        workflow.add_edge("gathering", "analyzing")
        workflow.add_edge("analyzing", "validating")
        workflow.add_edge("validating", "generating")
        workflow.add_edge("generating", END)
        
        return workflow.compile()

    async def process_message(self, message: str, conversation_id: str):
        state = WorkflowState(
            message=message,
            conversation_id=conversation_id,
            current_state="gathering"
        )
        
        async for chunk in self.workflow.astream({
            "state": state
        }):
            yield chunk