from langgraph.graph import MessagesState, add_messages
from typing import Literal, List, TypedDict
from typing import Annotated
from pydantic import BeforeValidator, BaseModel, Field
from langchain_core.messages import AnyMessage

class StateService(TypedDict):
  messages: Annotated[list[AnyMessage], add_messages]
  summary: str
  
  # Workflow state management
  # conversation_id: str
  category: Literal["greeting", "process", "offtopic"]
  next_step: str = None

  # BPMN 2.0 XML validation
  def validate_bpmn(xml: str) -> str:
    if not xml or not xml.strip():
      return xml
    if "<?xml" not in xml or "bpmn:" not in xml:
      raise ValueError("Invalid BPMN 2.0 XML")
    return xml

  # Validate BPMN 2.0 XML before updating state
  bpmn_xml: Annotated[str | None, BeforeValidator(validate_bpmn)] = None

  # Process control
  can_proceed: bool = False

  # human-in-loop question-answer dict
  human_in_loop: dict = {}
  questions: List[str] = None
  is_interrupted: bool = False
  # answer: str = None

  # understanding of the scenario
  context: str = None
  scenario: str = None

  # functional_requirements: List[str] = []
  # nonfunctional_requirements: List[str] = []
  gathered_info: str = None
  
  # evaluator state
  grade: Literal["valid", "invalid"] = None
  feedback : str = None

# Schema for structured output to use in evaluation
class Feedback(BaseModel):
    grade: Literal["valid", "invalid"] = Field(
        description="Decide if the xml is valid or not.",
    )
    feedback: str = Field(
        description="If the xml is not valid, provide feedback on how to correct it.",
    )