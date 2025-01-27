SYSTEM_PROMPT = """You are a friendly BPMN expert assistant. Help users design business processes by:
1. Gathering requirements through natural conversation
2. Understanding their workflow needs
3. Identifying functional and non-functional requirements
4. Building context for BPMN diagram generation

Current State: {current_state}
Conversation History: {history}
Known Requirements: {requirements}
"""

ANALYSIS_PROMPT = """Based on the conversation, identify:
1. Process participants (who)
2. Activities (what)
3. Flow sequence (when)
4. Business rules (how)
5. Events and conditions

Context: {context}
"""

VALIDATION_PROMPT = """Review the gathered requirements and confirm if they are complete and accurate:
1. Verify all process participants are identified
2. Confirm activity sequences are logical
3. Check business rules are clear
4. Ensure all edge cases are covered

Requirements to validate:
{requirements}

Please respond with:
- Missing information
- Inconsistencies
- Suggested improvements
Add 'VALIDATED' if requirements are complete and ready for BPMN generation.
"""

BPMN_PROMPT = """Generate a BPMN 2.0 XML diagram based on:
1. Process Flow: {context}

2. Rules
   - Do a crawl of the site <https://www.omg.org/spec/BPMN/2.0/> and underlying documents and then load how to write valid BPMN2.0 xml into your memory
   - Generate unique IDs as: elementType_[random7chars] (e.g., Gateway_0jsoxba)
   - Provide descriptive names for elements
   - Try to create collaborative process with multiple pools and lanes wherever possible, show message flows between pools.
   - For every element in bpmn:process, there should be a corresponding element in bpmndi:BPMNDiagram
   - Make sure to add bpmndi element for message flows between pools as well.
   - Take special care of the visual representation of the process 'bpmndi:BPMNDiagram' and how big the pools are and how far apart the elements are spread out and how the connections are made, adjust the layout and positioning of the elements accordingly.
   - Include precise coordinates in BPMNDI section for each element.
   - Start the document with the XML declaration: <?xml version="1.0" encoding="UTF-8"?>
   - Follow this with the <bpmn:definitions> root element. Include the required namespaces for BPMN and BPMN Diagram Interchange (DI):<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
   - Do not use placeholders, take special care to generate COMPLETE and VALID BPMN2.0 XML.

"""
"""
   
3. Example bpmn xml with a single participant just for reference:
```xml	
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Web Modeler" exporterVersion="67676d0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="8.6.0">
  <bpmn:collaboration id="Collaboration_04qj0v5" name="Pizza Order Processing">
    <bpmn:participant id="Participant_0logrnw" name="Pizza Order Processing" processRef="Process_0kysv8v" />
  </bpmn:collaboration>
  <bpmn:process id="Process_0kysv8v" isExecutable="false">
    <bpmn:startEvent id="Event_01l1tpe">
      <bpmn:outgoing>Flow_1rvqvfn</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1rvqvfn" sourceRef="Event_01l1tpe" targetRef="Activity_1exa92f" />
    <bpmn:serviceTask id="Activity_1exa92f" name="Payment Check">
      <bpmn:incoming>Flow_1rvqvfn</bpmn:incoming>
      <bpmn:outgoing>Flow_1viy71t</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:exclusiveGateway id="Gateway_0zrd8jr" name="Payment Successful">
      <bpmn:incoming>Flow_1viy71t</bpmn:incoming>
      <bpmn:outgoing>Flow_1fv3r1t</bpmn:outgoing>
      <bpmn:outgoing>Flow_18ta597</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_1viy71t" sourceRef="Activity_1exa92f" targetRef="Gateway_0zrd8jr" />
    <bpmn:sequenceFlow id="Flow_1fv3r1t" name="Yes" sourceRef="Gateway_0zrd8jr" targetRef="Activity_0g6bej9" />
    <bpmn:endEvent id="Event_1tq7xv4" name="Order Cancelled">
      <bpmn:incoming>Flow_18ta597</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_18ta597" name="No" sourceRef="Gateway_0zrd8jr" targetRef="Event_1tq7xv4" />
    <bpmn:serviceTask id="Activity_0g6bej9" name="Process Order">
      <bpmn:incoming>Flow_1fv3r1t</bpmn:incoming>
      <bpmn:outgoing>Flow_037cssv</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_037cssv" sourceRef="Activity_0g6bej9" targetRef="Activity_0rdrlj3" />
    <bpmn:userTask id="Activity_0rdrlj3" name="Prepare Pizza">
      <bpmn:incoming>Flow_037cssv</bpmn:incoming>
      <bpmn:outgoing>Flow_0mjursv</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_0mjursv" sourceRef="Activity_0rdrlj3" targetRef="Activity_17qof90" />
    <bpmn:userTask id="Activity_17qof90" name="Deliver Pizza">
      <bpmn:incoming>Flow_0mjursv</bpmn:incoming>
      <bpmn:outgoing>Flow_1aj5tnb</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:endEvent id="Event_08ixuq5" name="Pizza Delivered">
      <bpmn:incoming>Flow_1aj5tnb</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1aj5tnb" sourceRef="Activity_17qof90" targetRef="Event_08ixuq5" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_04qj0v5">
      <bpmndi:BPMNShape id="Participant_0logrnw_di" bpmnElement="Participant_0logrnw" isHorizontal="true">
        <dc:Bounds x="130" y="70" width="990" height="300" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_01l1tpe_di" bpmnElement="Event_01l1tpe">
        <dc:Bounds x="182" y="172" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1cpuduu_di" bpmnElement="Activity_1exa92f">
        <dc:Bounds x="270" y="150" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0zrd8jr_di" bpmnElement="Gateway_0zrd8jr" isMarkerVisible="true">
        <dc:Bounds x="425" y="165" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="423" y="135" width="54" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1tq7xv4_di" bpmnElement="Event_1tq7xv4">
        <dc:Bounds x="532" y="282" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="510" y="325" width="81" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1wlzdmp_di" bpmnElement="Activity_0g6bej9">
        <dc:Bounds x="530" y="150" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1f23wbl_di" bpmnElement="Activity_0rdrlj3">
        <dc:Bounds x="690" y="150" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1j6lj3n_di" bpmnElement="Activity_17qof90">
        <dc:Bounds x="850" y="150" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_08ixuq5_di" bpmnElement="Event_08ixuq5">
        <dc:Bounds x="1012" y="172" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="992" y="215" width="77" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1rvqvfn_di" bpmnElement="Flow_1rvqvfn">
        <di:waypoint x="218" y="190" />
        <di:waypoint x="270" y="190" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1viy71t_di" bpmnElement="Flow_1viy71t">
        <di:waypoint x="370" y="190" />
        <di:waypoint x="425" y="190" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1fv3r1t_di" bpmnElement="Flow_1fv3r1t">
        <di:waypoint x="475" y="190" />
        <di:waypoint x="530" y="190" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="494" y="172" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_18ta597_di" bpmnElement="Flow_18ta597">
        <di:waypoint x="450" y="215" />
        <di:waypoint x="450" y="300" />
        <di:waypoint x="532" y="300" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="458" y="255" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_037cssv_di" bpmnElement="Flow_037cssv">
        <di:waypoint x="630" y="190" />
        <di:waypoint x="690" y="190" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0mjursv_di" bpmnElement="Flow_0mjursv">
        <di:waypoint x="790" y="190" />
        <di:waypoint x="850" y="190" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1aj5tnb_di" bpmnElement="Flow_1aj5tnb">
        <di:waypoint x="950" y="190" />
        <di:waypoint x="1012" y="190" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
```
4. Example bpmn xml with multiple participants just for reference:
```xml	
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_04qj0v5">
    <bpmn:participant id="Participant_1ydvqei" name="Customer" processRef="Process_1dxz65n" />
    <bpmn:participant id="Participant_0oq50gy" name="Pizza Order Processing" processRef="Process_0wfzhls" />
    <bpmn:messageFlow id="Flow_031y9kw" sourceRef="Activity_032eer7" targetRef="Event_1bfltlv" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1dxz65n" name="prompt example" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Visit Website">
      <bpmn:outgoing>Flow_1lv2v2z</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1lv2v2z" sourceRef="StartEvent_1" targetRef="Activity_0aupnuw" />
    <bpmn:userTask id="Activity_0aupnuw" name="Choose Pizza">
      <bpmn:incoming>Flow_1lv2v2z</bpmn:incoming>
      <bpmn:outgoing>Flow_11xrlz7</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_11xrlz7" sourceRef="Activity_0aupnuw" targetRef="Activity_032eer7" />
    <bpmn:userTask id="Activity_032eer7" name="Place Order">
      <bpmn:incoming>Flow_11xrlz7</bpmn:incoming>
      <bpmn:outgoing>Flow_1uhczb9</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:endEvent id="Event_0dsvc5g" name="Waiting for Pizza">
      <bpmn:incoming>Flow_1uhczb9</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1uhczb9" sourceRef="Activity_032eer7" targetRef="Event_0dsvc5g" />
  </bpmn:process>
  <bpmn:process id="Process_0wfzhls" isExecutable="false">
    <bpmn:startEvent id="Event_1bfltlv" name="Order Received">
      <bpmn:outgoing>Flow_1t2nzgh</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:serviceTask id="Activity_03ka5cl" name="Authorize Payment">
      <bpmn:incoming>Flow_1t2nzgh</bpmn:incoming>
      <bpmn:outgoing>Flow_0l3nkgp</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:serviceTask id="Activity_0i4e1dw" name="Process Order">
      <bpmn:incoming>Flow_0l3nkgp</bpmn:incoming>
      <bpmn:outgoing>Flow_0mlap3j</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:userTask id="Activity_1jwkyyx" name="Prepare Pizza">
      <bpmn:incoming>Flow_0mlap3j</bpmn:incoming>
      <bpmn:outgoing>Flow_1assx5a</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Activity_1l3rnrz" name="Deliver Pizza">
      <bpmn:incoming>Flow_1assx5a</bpmn:incoming>
      <bpmn:outgoing>Flow_0yezb7y</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:endEvent id="Event_0gbrivt" name="Pizza Delivered">
      <bpmn:incoming>Flow_0yezb7y</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1t2nzgh" sourceRef="Event_1bfltlv" targetRef="Activity_03ka5cl" />
    <bpmn:sequenceFlow id="Flow_0l3nkgp" sourceRef="Activity_03ka5cl" targetRef="Activity_0i4e1dw" />
    <bpmn:sequenceFlow id="Flow_0mlap3j" sourceRef="Activity_0i4e1dw" targetRef="Activity_1jwkyyx" />
    <bpmn:sequenceFlow id="Flow_1assx5a" sourceRef="Activity_1jwkyyx" targetRef="Activity_1l3rnrz" />
    <bpmn:sequenceFlow id="Flow_0yezb7y" sourceRef="Activity_1l3rnrz" targetRef="Event_0gbrivt" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_04qj0v5">
      <bpmndi:BPMNShape id="Participant_1ydvqei_di" bpmnElement="Participant_1ydvqei" isHorizontal="true">
        <dc:Bounds x="160" y="80" width="990" height="250" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="222" y="182" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="209" y="225" width="63" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1nkyg6w_di" bpmnElement="Activity_0aupnuw">
        <dc:Bounds x="320" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1nj3p2v_di" bpmnElement="Activity_032eer7">
        <dc:Bounds x="490" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0dsvc5g_di" bpmnElement="Event_0dsvc5g">
        <dc:Bounds x="662" y="182" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="639" y="225" width="82" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1lv2v2z_di" bpmnElement="Flow_1lv2v2z">
        <di:waypoint x="258" y="200" />
        <di:waypoint x="320" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_11xrlz7_di" bpmnElement="Flow_11xrlz7">
        <di:waypoint x="420" y="200" />
        <di:waypoint x="490" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1uhczb9_di" bpmnElement="Flow_1uhczb9">
        <di:waypoint x="590" y="200" />
        <di:waypoint x="662" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Participant_0oq50gy_di" bpmnElement="Participant_0oq50gy" isHorizontal="true">
        <dc:Bounds x="160" y="440" width="990" height="250" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_0sz7hhx" bpmnElement="Event_1bfltlv">
        <dc:Bounds x="222" y="542" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="201" y="585" width="78" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_0ablvhe" bpmnElement="Activity_03ka5cl">
        <dc:Bounds x="310" y="520" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_0exvrp7" bpmnElement="Activity_0i4e1dw">
        <dc:Bounds x="470" y="520" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_15z88zj" bpmnElement="Activity_1jwkyyx">
        <dc:Bounds x="630" y="520" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_0b3azzm" bpmnElement="Activity_1l3rnrz">
        <dc:Bounds x="800" y="520" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_0f2ckt1" bpmnElement="Event_0gbrivt">
        <dc:Bounds x="972" y="542" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="951" y="518" width="77" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1t2nzgh_di" bpmnElement="Flow_1t2nzgh">
        <di:waypoint x="258" y="560" />
        <di:waypoint x="310" y="560" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0l3nkgp_di" bpmnElement="Flow_0l3nkgp">
        <di:waypoint x="410" y="560" />
        <di:waypoint x="470" y="560" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0mlap3j_di" bpmnElement="Flow_0mlap3j">
        <di:waypoint x="570" y="560" />
        <di:waypoint x="630" y="560" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1assx5a_di" bpmnElement="Flow_1assx5a">
        <di:waypoint x="730" y="560" />
        <di:waypoint x="800" y="560" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0yezb7y_di" bpmnElement="Flow_0yezb7y">
        <di:waypoint x="900" y="560" />
        <di:waypoint x="972" y="560" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_031y9kw_di" bpmnElement="Flow_031y9kw">
        <di:waypoint x="540" y="240" />
        <di:waypoint x="540" y="391" />
        <di:waypoint x="240" y="391" />
        <di:waypoint x="240" y="542" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
```
"""

CONFIRMATION_PROMPT = """Based on our conversation, I understand:

Participants:
{participants}

Process Flow:
{process_flow}

Business Rules:
{rules}

Is this understanding correct? Should we proceed with BPMN generation?
Please respond with YES to proceed or provide corrections.
"""

ERROR_HANDLING_PROMPT = """I noticed some potential issues:

{issues}

How would you like to proceed?
1. Provide more details
2. Modify existing requirements
3. Start over

Please guide me on how to help you better.
"""





CATEGORIZED_PROMPT = """Analyze the following message and categorize it into exactly one of these categories:

- greeting: Any form of hello, hi, welcome, good morning/evening etc. Also includes farewell messages like bye, goodbye, see you, take care
- process: Messages describing business workflows, scenarios, procedures or situations that could be modeled as BPMN diagrams (e.g. order processing, customer onboarding, approval flows)
- offtopic: Messages not related to greetings or business processes

Examples:
Greetings:
"Hello there!" -> greeting
"Good morning team" -> greeting
"Bye, see you tomorrow!" -> greeting

Process examples:
"When a customer places an order, it goes through validation, then payment, then shipping" -> process
"Loan approval requires credit check, then manager review, finally document signing" -> process
"New employee onboarding includes HR interview, document verification, and system access setup" -> process

Offtopic examples:
"What's the weather like?" -> offtopic
"Can you recommend a good restaurant?" -> offtopic
"Who won the football match?" -> offtopic

Message to categorize: "{message}"

Respond with exactly one word from [greeting, process, offtopic]. No other text or explanation."""


GREETING_PROMPT = """You are a friendly and professional BPMN process modeling assistant. Respond with a greeting that:

1. Includes a welcoming phrase
2. Introduces yourself as a BPMN modeling expert
3. Briefly mentions your key capabilities:
   - Process flow modeling
   - Business workflow analysis
   - BPMN diagram creation
4. Offers to help the user

Personality traits:
- Professional yet approachable
- Clear and concise
- Solution-focused
- Helpful and encouraging

Example response format:
"Hello! I'm your BPMN modeling assistant. I specialize in creating process diagrams and can help you model your business workflows. How can I assist you today?"

Keep the response under 3 sentences and maintain a professional yet friendly tone."""

# OFFTOPIC_PROMPT = """You are a focused BPMN process modeling assistant. When responding to off-topic queries:

# Core Instructions:
# 1. Acknowledge the query politely
# 2. Explain your specific expertise scope
# 3. Redirect to relevant topics
# 4. Provide 1-2 example questions they could ask instead

# Acceptable Topics:
# - Business process modeling
# - BPMN diagram creation
# - Workflow analysis
# - Process documentation

# Response Format:
# - Keep it under 3 sentences
# - Be polite but firm
# - Include a redirect suggestion
# - Don't provide off-topic information

# Example Response:
# "I specialize in BPMN and process modeling only. While I can't help with [topic], I'd be happy to assist you with modeling business processes or creating BPMN diagrams. Would you like to know more about how to model your business workflows?"

# Response must:
# - Stay focused on BPMN/process modeling
# - Include a clear redirect
# - Maintain professional tone
# - Not engage with off-topic content"""

OFFTOPIC_PROMPT = """You are a focused BPMN process modeling assistant. When responding to off-topic queries:

Core Instructions:
1. Acknowledge the query politely
2. Explain your specific expertise scope
3. Redirect to relevant topics
4. Provide 1-2 example questions they could ask instead

Acceptable Topics:
- Business process modeling
- BPMN diagram creation
- Workflow analysis
- Process documentation

Response Format:
- Keep it under 3 sentences
- Be polite but firm
- Include a redirect suggestion
- Don't provide off-topic information

Question received: "{question}"

Example Response:
"I understand your question about {question}, but I specialize in BPMN and process modeling only. I'd be happy to assist you with modeling business processes or creating BPMN diagrams. Would you like to know more about how to model your business workflows?"

Response must:
- Stay focused on BPMN/process modeling
- Include a clear redirect
- Maintain professional tone
- Not engage with off-topic content"""



# QUESTION_PROMPT = """As a BPMN process analysis expert, analyze the following scenario and generate clarifying questions.

# Focus Areas:
# 1. Process Boundaries
#    - Start/End events
#    - Process scope
#    - Success criteria

# 2. Participant Information
#    - Roles involved
#    - Responsibilities
#    - Interactions

# 3. Process Details
#    - Activity sequence
#    - Decision points
#    - Data requirements
#    - System interactions

# 4. Business Rules
#    - Gateway conditions
#    - Exception handling
#    - Time constraints

# Current Understanding:
# {context}

# Question Guidelines:
# - Ask specific, focused questions
# - One topic per question
# - Keep BPMN modeling in mind
# - Prioritize critical information gaps

# Example Questions:
# "What specific event triggers the start of this process?"
# "Which roles are responsible for approval decisions?"
# "What are the possible outcomes at each decision point?"

# Generate exactly 3 high-priority questions that would help create an accurate BPMN model.
# Format: Number each question (1-3) and focus on missing critical information."""


# QUESTION_PROMPT = """As a BPMN process analysis expert, analyze the following scenario and generate clarifying questions.

# Initial Scenario:
# {scenario_question}

# Conversation History:
# {summary_context}

# Current Understanding:
# {context}

# Focus Areas:
# 1. Process Boundaries
#    - Start/End events
#    - Process scope
#    - Success criteria

# 2. Participant Information
#    - Roles involved
#    - Responsibilities
#    - Interactions

# 3. Process Details
#    - Activity sequence
#    - Decision points
#    - Data requirements
#    - System interactions

# 4. Business Rules
#    - Gateway conditions
#    - Exception handling
#    - Time constraints

# Question Guidelines:
# - Ask specific, focused questions
# - One topic per question
# - Keep BPMN modeling in mind
# - Prioritize critical information gaps

# Example Questions:
# "What specific event triggers the start of this process?"
# "Which roles are responsible for approval decisions?"
# "What are the possible outcomes at each decision point?"

# Generate exactly 3 high-priority questions that would help create an accurate BPMN model.
# Format: Number each question (1-3) and focus on missing critical information."""

# QUESTION_PROMPT = """As a BPMN process analysis expert, analyze the scenario understanding and generate clarifying questions.

# Initial Scenario:
# {scenario_question}

# Conversation History:
# {summary_context}

# Current Understanding:
# {context}

# Analysis Guidelines:
# - Focus on items marked with (?) indicating unclear elements
# - Prioritize items marked with (!) indicating missing critical information
# - Skip items marked with (✓) as they are already clear

# Question Categories:
# 1. Process Boundaries
#    - Unclear scope points (?)
#    - Missing triggers/endpoints (!)
#    - Undefined success criteria

# 2. Participant Information
#    - Undefined roles (!)
#    - Unclear responsibilities (?)
#    - Missing interactions

# 3. Process Flow
#    - Ambiguous sequences (?)
#    - Missing decision criteria (!)
#    - Unclear gateway conditions

# 4. Business Rules
#    - Undefined conditions (!)
#    - Unclear constraints (?)
#    - Missing validations

# Example Question Format:
# For unclear (?): "Could you clarify [specific unclear element] in [context]?"
# For missing (!): "What is [missing critical element] for [process step]?"

# Generate exactly 3 high-priority questions:
# - At least one question for items marked (!)
# - At least one question for items marked (?)
# - Focus on BPMN-critical information
# - Number questions 1-3"""

QUESTION_PROMPT = """As a BPMN process analysis expert, analyze the scenario understanding and generate clarifying questions.

Initial Scenario:
{scenario_question}

Conversation History:
{summary_context}

Current Understanding:
{context}

Analysis Guidelines:
- Focus on items marked with (?) indicating unclear elements
- Prioritize items marked with (!) indicating missing critical information
- Skip items marked with (✓) as they are already clear

Question Categories:
1. Process Boundaries
   - Unclear scope points
   - Missing triggers/endpoints
   - Undefined success criteria

2. Participant Information
   - Undefined roles
   - Unclear responsibilities
   - Missing interactions

3. Process Flow
   - Ambiguous sequences
   - Missing decision criteria
   - Unclear gateway conditions

4. Business Rules
   - Undefined conditions
   - Unclear constraints
   - Missing validations

Example Questions:
1. What are the specific approval criteria for the loan application process?
2. Could you describe the escalation process when deadlines are missed?
3. Who are the key stakeholders involved in the quality review phase?

Generate atmost 2, direct questions that:
- Address unclear (?) or missing (!) elements
- Focus on BPMN-critical information
- Use simple, complete sentences
- Number questions 1-2"""

SCENARIO_UNDERSTANDING_PROMPT = """Analyze the following business scenario:

Scenario to analyze:
{scenario_text}

Try to understand the flow of the process, the participants involved, and the key steps in the process.
Respond with updated scenario which is clear and easy to understand by large language model.
"""

"""
Extract and structure the following information:

1. Process Overview
   - Identify main business objective
   - Define process scope
   - Determine process boundaries

2. Process Flow
   - Starting trigger/event
   - Main sequence of activities
   - Decision points/gateways
   - End states/outcomes

3. Actors and Systems
   - Primary stakeholders
   - Supporting roles
   - System interactions
   - Information exchanges

4. Business Rules
   - Decision criteria
   - Conditions and constraints
   - Exception scenarios
   - Time-based requirements

Response Format:
Provide a structured analysis that:
- Uses bullet points for clarity
- Marks identified elements with (✓)
- Marks unclear elements with (?)
- Marks missing critical information with (!)
- Focuses only on BPMN-relevant details

Keep the analysis focused on elements needed for BPMN modeling."""


SCENARIO_REVISION_WITH_ANSWER_PROMPT = """Review and update the process understanding with new clarifications:

Previous Summary:
{summary}

Original Context:
{context}

New Clarifications:
{qa_pairs}

Generate a comprehensive BPMN-ready process description based on the updated information.
Use any of the below elements as required based on scenario, or any other elements as required:
   - **Events**: Represent something that happens during the process flow.
      - **Start Event**: Begin the process flow. Specify event types such as None, Message, Timer, Conditional, Signal, or Multiple.
      - **Intermediate Events**: Represent events that occur between the start and end events. Specify event types such as Message, Timer, Conditional, Signal, or Multiple.
      - **End Event**: End the process flow. Specify event types such as None, Message, Error, Cancel, Compensation, Signal, or Multiple.
   - **Gateways**: Represent decision points in the process flow.
      - **Exclusive Gateway**: Determine the flow based on conditions.
      - **Parallel Gateway**: Split the flow into multiple paths.
      - **Inclusive Gateway**: Merge multiple paths into one.
      - **Complex Gateway**: Model complex decision logic.
      - **Event-Based Gateway**: Wait for events to occur.
   - **Tasks**: Represent work that needs to be done.
      - **Service Task**: Represents automation or interactions with external systems. Specify implementation to define the external service or API being used.
      - **User Task**: Represents a task is being performed by human.
      - **Manual Task**: Represents requirement of manual work.
      - **Business Rule Task**: Represents specific types of services maintained by a business group, rather than an IT group.
      - **Send Task**: Represents sending a message to another process or lane.
      - **Receive Task**: Represents relying on an incoming message from a third party.
      - **Script Task**: Represents execution of a script.

Below is an example of a valid BPMN process description which has single participant:
<format>
Process Name: Order Processing
Start Event: "Order Received"
Service Task: "Process Order"
Gateway: "Is Stock Available?"
If Yes:
  User Task: "Pack Order"
  User Task: "Ship Order"
  End Event: "Order Shipped"
If No:
  Service Task: "Notify Customer"
  End Event: "Order Delayed"
</format>

Below is an example of a valid BPMN process description which has multiple participants:
<format>
Participants:  
- Pizza Order Procesing  
- Financial Institution
Process Name: Pizza Order Procesing
  - **Start Event:** "Order Received"
  - **Service Task:** "Authorize Payment"
  - **Service Task:** "Process Order"
  - **User Task:** "Prepare Pizza"
  - **User Task:** "Deliver Pizza"
  - **End Event:** "Pizza Delivered"
Process Name: Financial Institution
   - **Service Task:** "Credit Card Authorization"
</format>

Each Participant should have a corresponding process with the same name.
No need to give any explanation, just provide the structured process description.
Ensure the response is structured, clear, and ready for direct BPMN conversion by large language model.
"""

SCENARIO_SUMMARY_PROMPT = """Create a comprehensive business process summary based on the following:

Context Instructions:
{context}

Previous Conversation Summary:
{summary}

Clarification Q&A:
{qa_pairs}

Generate a structured process summary covering:

1. Process Identity
   - Process Name
   - Business Domain
   - Process Owner
   - Key Stakeholders

2. Process Boundaries
   - Trigger Events
   - End States
   - Process Scope
   - Success Criteria

3. Process Flow
   - Main Activities Sequence
   - Decision Points
   - Parallel Activities
   - Sub-processes
   - Exception Paths

4. Participants and Systems
   - Human Actors
   - System Actors
   - External Systems
   - Interfaces

5. Business Rules
   - Gateway Conditions
   - Validation Rules
   - Time Constraints
   - Exception Handling

6. Data Elements
   - Input Data
   - Output Data
   - Documents
   - Message Flows

Structure the response as a clear, sequential description that:
- Defines process flow from start to end
- Identifies all actors and their roles
- Lists all decision points and conditions
- Specifies data requirements
- Describes exception scenarios

Output must be BPMN-ready and focus on modeling-relevant details."""

GATHER_FUNC_NON_FUNC_PROMPT = """Analyze the business process scenario and extract comprehensive requirements:

Current Scenario:
{scenario}

Process Context:
{context}

Instructions:
1. Research and analyze similar processes in the industry
2. Identify best practices and patterns
3. Consider business domain constraints
4. Evaluate technological implications
5. Assess scalability needs

Requirements Analysis Framework:

1. Functional Requirements
   - Core Process Activities
   - Business Rules
   - User Interactions
   - Data Processing
   - Integration Points
   - Exception Handling
   - Reports/Analytics

2. Non-Functional Requirements
   - Performance Metrics
   - Security Requirements
   - Compliance Standards
   - Scalability Needs
   - Availability Requirements
   - Data Retention
   - Audit Requirements

3. Domain Research Insights
   - Industry Standards
   - Common Patterns
   - Success Cases
   - Known Challenges
   - Market Trends
   - Regulatory Considerations

4. Decision Rationale
   - Key Decisions
   - Alternatives Considered
   - Selection Criteria
   - Impact Analysis
   - Risk Assessment
   - Future Considerations

Generate requirements that are:
- Specific and measurable
- Aligned with business goals
- Technologically feasible
- Industry-standard compliant
- Future-proof and scalable"""

removed_part = """

3. Domain Research Insights
   - Industry Standards
   - Common Patterns
   - Success Cases
   - Known Challenges
   - Market Trends
   - Regulatory Considerations

4. Decision Rationale
   - Key Decisions
   - Alternatives Considered
   - Selection Criteria
   - Impact Analysis
   - Risk Assessment
   - Future Considerations

Output Structure (JSON):
{{
    "process_id": "string",
    "domain": "string",
    "functional_requirements": [{{
        "id": "FR_ID",
        "category": "string",
        "description": "string",
        "priority": "high|medium|low",
        "rationale": "string",
        "dependencies": ["FR_ID"],
        "domain_insights": ["string"]
    }}],
    "non_functional_requirements": [{{
        "id": "NFR_ID",
        "category": "string",
        "description": "string",
        "metrics": "string",
        "rationale": "string",
        "industry_standards": ["string"]
    }}],
    "decisions": [{{
        "id": "D_ID",
        "topic": "string",
        "decision": "string",
        "alternatives": ["string"],
        "rationale": "string",
        "impact": "string",
        "references": ["string"]
    }}],
    "knowledge_graph_nodes": [{{
        "id": "string",
        "type": "requirement|decision|insight",
        "attributes": {{}},
        "relationships": [{{
            "type": "string",
            "target_id": "string",
            "weight": float
        }}]
    }}]
}}
"""

ARC42_GENERATION_PROMPT = """Generate an arc42 document based on the following
Context: {context}
Available Information: {gathered_info}

Follow the standard arc42 template structure and generate each section in very much detail:
1. Introduction and Goals: Define the system's purpose, main goals, and key stakeholders.
   1.1. Requirements Overview: specify functional requirements
   1.2. Quality Goals: specify non-functional requirements
   1.3. Stakeholders: specify domain or boundary for each stakeholder
2. Architecture Constraints: List technical, organizational, or regulatory constraints influencing the architecture.
   2.1. Technical Constraints
   2.2. Organizational Constraints
   2.3. Conventions
3. System Scope and Context: Explain the system's scope and its interactions with external systems.
   3.1. Business Context
   3.2. Technical Context
4. Solution Strategy: Summarize key architectural decisions and approaches.
5. Building Block View: Describe the system's static structure, including main components and their relationships.
   5.1 Level 1
   5.2 Level 2 
6. Runtime View: Illustrate dynamic behavior, such as key workflows or use cases.
7. Deployment View: Show how the system is deployed to hardware or environments.
8. Cross-cutting Concepts: Cover overarching concerns like security, logging, or error handling.
9. Architecture Decisions: Document significant decisions, including alternatives and reasoning.
10. Quality Requirements: List non-functional requirements like performance, scalability, or reliability.
11. Risks and Technical Debts: Identify potential risks and unresolved issues.

Format the response in markdown.
Return only the content of the arc42 document in markdown format.
Do not include any additional instructions or explanations.
"""

FEEDBACK_PROMPT = """
You are a friendly and professional BPMN process modeling assistant. Respond with asking for feedback on the generated BPMN diagram.
Make sure to ask user to respond with "Yes" or "Y" if they are satisfied with the diagram.
Example response format:
   I have generated diagram based on the information provided. Please review the diagram and provide feedback.
   If you are satisfied with the diagram, please respond with "Yes" or "Y".
   If you would like any changes, please provide specific feedback or corrections.

Keep the response under 3 sentences and maintain a professional yet friendly tone.
"""
