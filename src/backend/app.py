from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
# from groq import Groq
import os
import base64
from io import BytesIO
from PIL import Image
from mdextractor import extract_md_blocks
from pydantic import BaseModel
from processpiper.text2diagram import render
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

app = FastAPI()
origins = [
  "http://localhost:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

BPMN_SYNTAX_DOC_PRE_PROCESSOR = """
write it down in a format like below(order processing example just for reference):
<format>
Process Name: Order Processing

Start Event: "Order Received"
Task: "Process Order"
Gateway: "Is Stock Available?"

Yes:

Task: "Pack Order"
Task: "Ship Order"
End Event: "Order Shipped"
If No:
Task: "Notify Customer"
End Event: "Order Delayed"
</format>
"""

BPMN_SYNTAX_DOC = """
Do a crawl of the site https://www.omg.org/spec/BPMN/2.0/ and underlying documents and then load how to write valid BPMN2.0 xml into your memory

Create a BPMN XML flow of the provided process
Make sure to use the right
namespaces,
prefixes,

definitions(
xmlns:tns="http://bpmn.io/schema/bpmn"
xmlns:activiti="http://activiti.org/bpmn"

and BPMNDI elements.

Do not use placeholders, generate complete BPMN XML.
Add x, y coordinates, hight and width to BPMN elements.
flow elements must be children of pools/participants.
first element in bpmn plane should always be the pool/participant.
connect the elements with flow lines at the end so that you have the right positions of the elements.


below is the example of BPMN XML:
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_eyr1vwi" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.8.3">
  <bpmn:collaboration id="Collaboration_eqav5xm">
    <bpmn:participant id="Participant_mcnnl6y" name="Process" processRef="Process_7hnii3k" />
  </bpmn:collaboration>
  <bpmn:process id="Process_7hnii3k">
    <bpmn:task id="Task_gg73ywe" name="Is Student Qualified?" />
    <bpmn:task id="Task_hmtin08" name="Archive Documents" />
    <bpmn:task id="Task_060xs8p" name="Reject Student" />
    <bpmn:task id="Task_lkzsqoi" name="Documents complete?" />
    <bpmn:endEvent id="EndEvent_8hrjtz1" name="" />
    <bpmn:task id="Task_wrgw205" name="Documents in time?" />
    <bpmn:task id="Task_zkx7fkn" name="Accept Student" />
    <bpmn:startEvent id="StartEvent_e7f7ib7" name="" />
    <bpmn:exclusiveGateway id="Gateway_bocyvcz" name="" />
    <bpmn:exclusiveGateway id="Gateway_yn8oief" name="" />
    <bpmn:parallelGateway id="Gateway_0nbka0r" name="" />
    <bpmn:parallelGateway id="Gateway_u83phzq" name="" />
    <bpmn:sequenceFlow id="SequenceFlow_dfwtv8e" name="" sourceRef="Participant_mcnnl6y" targetRef="Gateway_yn8oief" />
    <bpmn:sequenceFlow id="SequenceFlow_a0k47yb" name="" sourceRef="StartEvent_e7f7ib7" targetRef="Gateway_u83phzq" />
    <bpmn:sequenceFlow id="SequenceFlow_3xvzd2f" name="" sourceRef="Gateway_bocyvcz" targetRef="Task_hmtin08" />
    <bpmn:sequenceFlow id="SequenceFlow_7bkp0ma" name="" sourceRef="Gateway_0nbka0r" targetRef="Task_gg73ywe" />
    <bpmn:sequenceFlow id="SequenceFlow_gdl8lb6" name="" sourceRef="Gateway_yn8oief" targetRef="Task_060xs8p" />
    <bpmn:sequenceFlow id="SequenceFlow_52t7k1x" name="" sourceRef="EndEvent_8hrjtz1" targetRef="EndEvent_8hrjtz1" />
    <bpmn:sequenceFlow id="SequenceFlow_uf1uv5n" name="" sourceRef="Task_060xs8p" targetRef="Gateway_bocyvcz" />
    <bpmn:sequenceFlow id="SequenceFlow_fs1bq74" name="" sourceRef="Gateway_u83phzq" targetRef="Task_lkzsqoi" />
    <bpmn:sequenceFlow id="SequenceFlow_mvn9vgr" name="" sourceRef="Gateway_yn8oief" targetRef="Task_zkx7fkn" />
    <bpmn:sequenceFlow id="SequenceFlow_zufjqtj" name="" sourceRef="Gateway_u83phzq" targetRef="Task_wrgw205" />
    <bpmn:sequenceFlow id="SequenceFlow_gohqas4" name="" sourceRef="Task_lkzsqoi" targetRef="Gateway_0nbka0r" />
    <bpmn:sequenceFlow id="SequenceFlow_jdurubz" name="" sourceRef="Task_zkx7fkn" targetRef="Gateway_bocyvcz" />
    <bpmn:sequenceFlow id="SequenceFlow_d18v0j8" name="" sourceRef="Task_wrgw205" targetRef="Gateway_0nbka0r" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_ogaxag6">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_eqav5xm">
      <bpmndi:BPMNShape id="Participant_mcnnl6y_di" bpmnElement="Participant_mcnnl6y">
        <dc:Bounds x="9.203688" y="2.4180322" width="1266.6168" height="328.75934" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_d18v0j8_di" bpmnElement="SequenceFlow_d18v0j8">
        <di:waypoint x="394.6117" y="230.49445" />
        <di:waypoint x="470.27548" y="169.43417" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_jdurubz_di" bpmnElement="SequenceFlow_jdurubz">
        <di:waypoint x="895.36194" y="230.7268" />
        <di:waypoint x="951.6451" y="169.81354" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_gohqas4_di" bpmnElement="SequenceFlow_gohqas4">
        <di:waypoint x="394.51697" y="65.59838" />
        <di:waypoint x="469.96408" y="119.666695" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_zufjqtj_di" bpmnElement="SequenceFlow_zufjqtj">
        <di:waypoint x="220.19815" y="169.52591" />
        <di:waypoint x="294.33963" y="230.18666" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_mvn9vgr_di" bpmnElement="SequenceFlow_mvn9vgr">
        <di:waypoint x="722.6212" y="169.09048" />
        <di:waypoint x="795.51764" y="229.87682" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_fs1bq74_di" bpmnElement="SequenceFlow_fs1bq74">
        <di:waypoint x="220.1891" y="119.7217" />
        <di:waypoint x="294.4936" y="65.73717" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_uf1uv5n_di" bpmnElement="SequenceFlow_uf1uv5n">
        <di:waypoint x="895.1054" y="65.872116" />
        <di:waypoint x="951.415" y="119.39128" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_52t7k1x_di" bpmnElement="SequenceFlow_52t7k1x">
        <di:waypoint x="1107.5052" y="144.5661" />
        <di:waypoint x="1138.6177" y="144.5661" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_gdl8lb6_di" bpmnElement="SequenceFlow_gdl8lb6">
        <di:waypoint x="722.6124" y="119.92633" />
        <di:waypoint x="795.7966" y="65.895645" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_7bkp0ma_di" bpmnElement="SequenceFlow_7bkp0ma">
        <di:waypoint x="495.16177" y="144.17233" />
        <di:waypoint x="546.9171" y="144.17233" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_3xvzd2f_di" bpmnElement="SequenceFlow_3xvzd2f">
        <di:waypoint x="976.5958" y="144.53633" />
        <di:waypoint x="1008.0998" y="144.53633" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_a0k47yb_di" bpmnElement="SequenceFlow_a0k47yb">
        <di:waypoint x="142.55945" y="144.08487" />
        <di:waypoint x="195.27347" y="144.08487" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_dfwtv8e_di" bpmnElement="SequenceFlow_dfwtv8e">
        <di:waypoint x="646.2356" y="144.5991" />
        <di:waypoint x="697.9623" y="144.5991" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Task_gg73ywe_di" bpmnElement="Task_gg73ywe">
        <dc:Bounds x="543.81537" y="102.05343" width="103.84247" height="83.264915" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_hmtin08_di" bpmnElement="Task_hmtin08">
        <dc:Bounds x="1004.917" y="102.09951" width="103.27112" height="83.114006" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_060xs8p_di" bpmnElement="Task_060xs8p">
        <dc:Bounds x="793.0644" y="23.339586" width="102.36841" height="82.69137" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_lkzsqoi_di" bpmnElement="Task_lkzsqoi">
        <dc:Bounds x="292.2002" y="23.20797" width="103.162445" height="82.5341" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_8hrjtz1_di" bpmnElement="EndEvent_8hrjtz1">
        <dc:Bounds x="1135.8901" y="124.00258" width="39.226196" height="38.711655" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_wrgw205_di" bpmnElement="Task_wrgw205">
        <dc:Bounds x="291.68393" y="188.59766" width="103.4613" height="82.32434" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_zkx7fkn_di" bpmnElement="Task_zkx7fkn">
        <dc:Bounds x="792.4978" y="188.06375" width="104.02429" height="82.85089" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_e7f7ib7_di" bpmnElement="StartEvent_e7f7ib7">
        <dc:Bounds x="103.73168" y="123.9053" width="39.273613" height="39.0772" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_bocyvcz_di" bpmnElement="Gateway_bocyvcz" isMarkerVisible="true">
        <dc:Bounds x="924.1982" y="117.05075" width="52.808777" height="52.924316" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_yn8oief_di" bpmnElement="Gateway_yn8oief" isMarkerVisible="true">
        <dc:Bounds x="695.1383" y="116.86706" width="53.402832" height="53.193336" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0nbka0r_di" bpmnElement="Gateway_0nbka0r">
        <dc:Bounds x="443.3146" y="117.12091" width="52.740753" height="53.050934" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_u83phzq_di" bpmnElement="Gateway_u83phzq">
        <dc:Bounds x="193.23836" y="117.08983" width="52.806335" height="52.78853" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
"""

BPMN_SYNTAX_DOC_VALIDATION = """
Do a crawl of the site https://www.omg.org/spec/BPMN/2.0/ and underlying documents and then load how to write valid BPMN2.0 xml into your memory

Do not use placeholders, generate complete BPMN XML.
Adjust x, y coordinates, hight and width of BPMN elements to fit the diagram.
flow elements must be children of pools/participants.
first element in bpmn plane should always be the pool/participant.
"""

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class Prompt(BaseModel):
    prompt: str

# def generate_diagram(input_syntax):
#     generated_image = render(input_syntax)
#     # Convert the image to a base64 encoded string
#     buffered = BytesIO()
#     generated_image.save(buffered, format="PNG")
#     img_str = base64.b64encode(buffered.getvalue())
#     return img_str.decode("utf-8")

@app.get("/")
def check_status():
  return JSONResponse(
    content={ "status_code": status.HTTP_200_OK, "message": "Backend FastAPI is running" }
  )

@app.post("/generate/")
async def generate_bpmn(prompt: Prompt):
  try:
    if not GROQ_API_KEY:
      raise HTTPException(status_code=404, detail="GROQ_API_KEY not found in environment variables")

    # Initialize LangChain's ChatGroq model
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model="llama3-70b-8192"
    )  # Use the appropriate model

    # Step 1: Generate BPMN process description
    process_description_prompt = f"Describe a BPMN process for the following scenario:\n\n{prompt.prompt}\n\n" + BPMN_SYNTAX_DOC_PRE_PROCESSOR

    # Generate the process description
    process_description = await llm.ainvoke([process_description_prompt])
    process_description = process_description.content

    # Step 2: Generate BPMN XML using the process description
    bpmn_xml_prompt = f"Generate a BPMN 2.0 XML diagram for the following process description:\n\n{process_description}\n\n" + BPMN_SYNTAX_DOC

    # Generate the BPMN XML
    bpmn_xml_ = await llm.ainvoke([bpmn_xml_prompt])
    bpmn_xml_ = bpmn_xml_.content

    # Step 3: Validate BPMN XML
    bpmn_xml_validate = f"Validate and update if required following BPMN 2.0 XML :\n\n{bpmn_xml_}\n\n" + BPMN_SYNTAX_DOC_VALIDATION

    # Generate the BPMN XML
    bpmn_xml = await llm.ainvoke([bpmn_xml_validate])
    bpmn_xml = bpmn_xml.content

    # Extract just the XML content (in case there's any additional text)
    xml_start = bpmn_xml.find('<?xml')
    xml_end = bpmn_xml.find('</bpmn:definitions>') + len('</bpmn:definitions>')
    if xml_start >= 0 and xml_end >= 0:
        bpmn_xml = bpmn_xml[xml_start:xml_end]
    else:
        raise HTTPException(status_code=500, detail="Failed to extract BPMN XML from the response")

    return JSONResponse(
        content={ "status_code": status.HTTP_200_OK, "bpmn_xml": bpmn_xml }
    )

  except Exception as e:
      # Log the error
      print(f"Error: {str(e)}")
      # Return proper error response
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
  