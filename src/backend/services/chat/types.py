# from dataclasses import dataclass, field
# from typing import List, Dict, Optional
# from enum import Enum

# class ConversationState(str, Enum):
#     GATHERING = "gathering"
#     ANALYZING = "analyzing"
#     GENERATING = "generating"
#     VALIDATING = "validating"

# @dataclass
# class Requirement:
#     id: str
#     type: str
#     description: str
#     metadata: Dict = field(default_factory=dict)

# @dataclass
# class ChatState:
#     conversation_id: str
#     current_state: ConversationState
#     requirements: List[Requirement] = field(default_factory=list)
#     context: Dict = field(default_factory=dict)

