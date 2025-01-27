"use client";

import { useEffect, useState, useCallback } from 'react';
import BreadcrumbsHeader from '../../_components/breadcrumbs-header'
import BpmnModelerComponent from '../../text2bpmn/_components/bpmn-modeler-component';
import { apiWrapper } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Bot, Send, AlertCircle, ClipboardList, Search, CheckCircle, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/providers/user-provider';
import { nanoid } from 'nanoid';
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { useWorkspaceStore } from '@/store/workspace-store';
import { Bpmn } from '@/types/bpmn/bpmn';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// interface ChatResponse {
//   response: string;
//   can_proceed: boolean;
//   bpmn_xml: string | null;
// }

interface ChatPageParams {
  params: {
    fileId: string;
  }
}

export default function ChatPage({params}: ChatPageParams) {
  const [xml, setXml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [threadId, setThreadId] = useState<string>('');
  const {setCurrentBpmn} = useWorkspaceStore();


  const checkFile = useCallback(async () => {
    try {
      const res = await apiWrapper({
        uri: API_PATHS.CHECKFILE, 
        method: 'POST', 
        body: {fileId: params.fileId}
      });

      console.log("res at checkFile = ", res.data);

      // TODO: check the fileId entered is a valid BPMN file else redirect to the dashboard/chat

      const state: Bpmn = {
        createdBy: res.data.createdBy,
        fileName: res.data.fileName,
        createdAt: res.data.createdAt,
        id: res.data.id,
        isShared: res.data.isShared,
        isFavorite: res.data.isFavorite, 
        currentVersionId: res.data.currentVersionId,
      }

      // TODO: fix the state issue of not getting fixed
      setCurrentBpmn(state);
      return state;

    } catch (error) {
      console.error('Error checking file:', error);
    }
  }, [params.fileId]);

  useEffect(() => {
    const initializeFile = async () => {
      const fileId = params.fileId;
      console.log("fileId = ", fileId);
      await checkFile();
    };

    initializeFile();

    // setCurrentBpmn()
    // currentBpmn = state.currentBpmn;

    // TODO: check the fileId entered is a valid BPMN file else redirect to the dashboard/chat


    // TDOO: keep the threadId in the db and use it 


    setXml('<?xml version="1.0" encoding="UTF-8"?><semantic:definitions xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="_1275940932088" targetNamespace="http://www.trisotech.com/definitions/_1275940932088"><semantic:message id="_1275940932310" /><semantic:message id="_1275940932433" /><semantic:process id="_6-1" isExecutable="false"><semantic:laneSet id="ls_6-438"><semantic:lane id="_6-650" name="clerk"><semantic:flowNodeRef>_6-450</semantic:flowNodeRef><semantic:flowNodeRef>_6-652</semantic:flowNodeRef><semantic:flowNodeRef>_6-674</semantic:flowNodeRef><semantic:flowNodeRef>_6-695</semantic:flowNodeRef></semantic:lane><semantic:lane id="_6-446" name="pizza chef"><semantic:flowNodeRef>_6-463</semantic:flowNodeRef></semantic:lane><semantic:lane id="_6-448" name="delivery boy"><semantic:flowNodeRef>_6-514</semantic:flowNodeRef><semantic:flowNodeRef>_6-565</semantic:flowNodeRef><semantic:flowNodeRef>_6-616</semantic:flowNodeRef></semantic:lane></semantic:laneSet><semantic:startEvent id="_6-450" name="Order received"><semantic:outgoing>_6-630</semantic:outgoing><semantic:messageEventDefinition messageRef="_1275940932310" /></semantic:startEvent><semantic:parallelGateway id="_6-652" name=""><semantic:incoming>_6-630</semantic:incoming><semantic:outgoing>_6-691</semantic:outgoing><semantic:outgoing>_6-693</semantic:outgoing></semantic:parallelGateway><semantic:intermediateCatchEvent id="_6-674" name="„where is my pizza?“"><semantic:incoming>_6-691</semantic:incoming><semantic:incoming>_6-746</semantic:incoming><semantic:outgoing>_6-748</semantic:outgoing><semantic:messageEventDefinition messageRef="_1275940932433" /></semantic:intermediateCatchEvent><semantic:task id="_6-695" name="Calm customer"><semantic:incoming>_6-748</semantic:incoming><semantic:outgoing>_6-746</semantic:outgoing></semantic:task><semantic:task id="_6-463" name="Bake the pizza"><semantic:incoming>_6-693</semantic:incoming><semantic:outgoing>_6-632</semantic:outgoing></semantic:task><semantic:task id="_6-514" name="Deliver the pizza"><semantic:incoming>_6-632</semantic:incoming><semantic:outgoing>_6-634</semantic:outgoing></semantic:task><semantic:task id="_6-565" name="Receive payment"><semantic:incoming>_6-634</semantic:incoming><semantic:outgoing>_6-636</semantic:outgoing></semantic:task><semantic:endEvent id="_6-616" name=""><semantic:incoming>_6-636</semantic:incoming><semantic:terminateEventDefinition /></semantic:endEvent><semantic:sequenceFlow id="_6-630" name="" sourceRef="_6-450" targetRef="_6-652" /><semantic:sequenceFlow id="_6-632" name="" sourceRef="_6-463" targetRef="_6-514" /><semantic:sequenceFlow id="_6-634" name="" sourceRef="_6-514" targetRef="_6-565" /><semantic:sequenceFlow id="_6-636" name="" sourceRef="_6-565" targetRef="_6-616" /><semantic:sequenceFlow id="_6-691" name="" sourceRef="_6-652" targetRef="_6-674" /><semantic:sequenceFlow id="_6-693" name="" sourceRef="_6-652" targetRef="_6-463" /><semantic:sequenceFlow id="_6-746" name="" sourceRef="_6-695" targetRef="_6-674" /><semantic:sequenceFlow id="_6-748" name="" sourceRef="_6-674" targetRef="_6-695" /></semantic:process><semantic:message id="_1275940932198" /><semantic:process id="_6-2" isExecutable="false"><semantic:startEvent id="_6-61" name="Hungry for pizza"><semantic:outgoing>_6-125</semantic:outgoing></semantic:startEvent><semantic:task id="_6-74" name="Select a pizza"><semantic:incoming>_6-125</semantic:incoming><semantic:outgoing>_6-178</semantic:outgoing></semantic:task><semantic:task id="_6-127" name="Order a pizza"><semantic:incoming>_6-178</semantic:incoming><semantic:outgoing>_6-420</semantic:outgoing></semantic:task><semantic:eventBasedGateway id="_6-180" name=""><semantic:incoming>_6-420</semantic:incoming><semantic:incoming>_6-430</semantic:incoming><semantic:outgoing>_6-422</semantic:outgoing><semantic:outgoing>_6-424</semantic:outgoing></semantic:eventBasedGateway><semantic:intermediateCatchEvent id="_6-202" name="pizza received"><semantic:incoming>_6-422</semantic:incoming><semantic:outgoing>_6-428</semantic:outgoing><semantic:messageEventDefinition messageRef="_1275940932198" /></semantic:intermediateCatchEvent><semantic:intermediateCatchEvent id="_6-219" name="60 minutes"><semantic:documentation textFormat="text/x-comments">:Not sure if 60 minutes is a bit to much --nre</semantic:documentation><semantic:incoming>_6-424</semantic:incoming><semantic:outgoing>_6-426</semantic:outgoing><semantic:timerEventDefinition><semantic:expression /></semantic:timerEventDefinition></semantic:intermediateCatchEvent><semantic:task id="_6-236" name="Ask for the pizza"><semantic:incoming>_6-426</semantic:incoming><semantic:outgoing>_6-430</semantic:outgoing></semantic:task><semantic:task id="_6-304" name="Pay the pizza"><semantic:incoming>_6-428</semantic:incoming><semantic:outgoing>_6-434</semantic:outgoing></semantic:task><semantic:task id="_6-355" name="Eat the pizza"><semantic:incoming>_6-434</semantic:incoming><semantic:outgoing>_6-436</semantic:outgoing></semantic:task><semantic:endEvent id="_6-406" name="Hunger satisfied"><semantic:incoming>_6-436</semantic:incoming></semantic:endEvent><semantic:sequenceFlow id="_6-125" name="" sourceRef="_6-61" targetRef="_6-74" /><semantic:sequenceFlow id="_6-178" name="" sourceRef="_6-74" targetRef="_6-127" /><semantic:sequenceFlow id="_6-420" name="" sourceRef="_6-127" targetRef="_6-180" /><semantic:sequenceFlow id="_6-422" name="" sourceRef="_6-180" targetRef="_6-202" /><semantic:sequenceFlow id="_6-424" name="" sourceRef="_6-180" targetRef="_6-219" /><semantic:sequenceFlow id="_6-426" name="" sourceRef="_6-219" targetRef="_6-236" /><semantic:sequenceFlow id="_6-428" name="" sourceRef="_6-202" targetRef="_6-304" /><semantic:sequenceFlow id="_6-430" name="" sourceRef="_6-236" targetRef="_6-180" /><semantic:sequenceFlow id="_6-434" name="" sourceRef="_6-304" targetRef="_6-355" /><semantic:sequenceFlow id="_6-436" name="" sourceRef="_6-355" targetRef="_6-406" /></semantic:process><semantic:collaboration id="C1275940932557"><semantic:participant id="_6-53" name="Pizza Customer" processRef="_6-2" /><semantic:participant id="_6-438" name="Pizza vendor" processRef="_6-1" /><semantic:messageFlow id="_6-638" name="pizza order" sourceRef="_6-127" targetRef="_6-450" /><semantic:messageFlow id="_6-642" name="" sourceRef="_6-236" targetRef="_6-674" /><semantic:messageFlow id="_6-646" name="receipt" sourceRef="_6-565" targetRef="_6-304" /><semantic:messageFlow id="_6-648" name="money" sourceRef="_6-304" targetRef="_6-565" /><semantic:messageFlow id="_6-640" name="pizza" sourceRef="_6-514" targetRef="_6-202" /><semantic:messageFlow id="_6-750" name="" sourceRef="_6-695" targetRef="_6-236" /></semantic:collaboration><bpmndi:BPMNDiagram id="Trisotech.Visio-_6" di:name="Untitled Diagram" di:documentation="" di:resolution="96.00000267028808"><bpmndi:BPMNPlane bpmnElement="C1275940932557"><bpmndi:BPMNShape id="Trisotech.Visio__6-53" bpmnElement="_6-53" isHorizontal="true"><dc:Bounds x="12" y="12" width="1044" height="294" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6-438" bpmnElement="_6-438" isHorizontal="true"><dc:Bounds x="12" y="372" width="905" height="337" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-650" bpmnElement="_6-650" isHorizontal="true"><dc:Bounds x="42" y="372" width="875" height="114" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-446" bpmnElement="_6-446" isHorizontal="true"><dc:Bounds x="42" y="486" width="875" height="114" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-448" bpmnElement="_6-448" isHorizontal="true"><dc:Bounds x="42" y="600" width="875" height="109" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-450" bpmnElement="_6-450"><dc:Bounds x="79" y="405" width="30" height="30" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-652" bpmnElement="_6-652"><dc:Bounds x="140" y="399" width="42" height="42" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-674" bpmnElement="_6-674"><dc:Bounds x="218" y="404" width="32" height="32" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-695" bpmnElement="_6-695"><dc:Bounds x="286" y="386" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-463" bpmnElement="_6-463"><dc:Bounds x="252" y="521" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-514" bpmnElement="_6-514"><dc:Bounds x="464" y="629" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-565" bpmnElement="_6-565"><dc:Bounds x="603" y="629" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-616" bpmnElement="_6-616"><dc:Bounds x="722" y="647" width="32" height="32" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-61" bpmnElement="_6-61"><dc:Bounds x="66" y="96" width="30" height="30" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-74" bpmnElement="_6-74"><dc:Bounds x="145" y="77" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-127" bpmnElement="_6-127"><dc:Bounds x="265" y="77" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-180" bpmnElement="_6-180"><dc:Bounds x="378" y="90" width="42" height="42" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-202" bpmnElement="_6-202"><dc:Bounds x="647" y="95" width="32" height="32" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-219" bpmnElement="_6-219"><dc:Bounds x="448" y="184" width="32" height="32" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-236" bpmnElement="_6-236"><dc:Bounds x="517" y="166" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-304" bpmnElement="_6-304"><dc:Bounds x="726" y="77" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-355" bpmnElement="_6-355"><dc:Bounds x="834" y="77" width="83" height="68" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Trisotech.Visio__6__6-406" bpmnElement="_6-406"><dc:Bounds x="956" y="95" width="32" height="32" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-640" bpmnElement="_6-640"><di:waypoint x="506" y="629" /><di:waypoint x="506" y="384" /><di:waypoint x="663" y="384" /><di:waypoint x="663" y="127" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-630" bpmnElement="_6-630"><di:waypoint x="109" y="420" /><di:waypoint x="140" y="420" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-691" bpmnElement="_6-691"><di:waypoint x="182" y="420" /><di:waypoint x="200" y="420" /><di:waypoint x="218" y="420" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-648" bpmnElement="_6-648"><di:waypoint x="754" y="145" /><di:waypoint x="754" y="408" /><di:waypoint x="630" y="408" /><di:waypoint x="631" y="629" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-422" bpmnElement="_6-422"><di:waypoint x="420" y="111" /><di:waypoint x="438" y="111" /><di:waypoint x="647" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-646" bpmnElement="_6-646" messageVisibleKind="non_initiating"><di:waypoint x="658" y="629" /><di:waypoint x="658" y="432" /><di:waypoint x="782" y="432" /><di:waypoint x="782" y="145" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-428" bpmnElement="_6-428"><di:waypoint x="679" y="111" /><di:waypoint x="726" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-748" bpmnElement="_6-748"><di:waypoint x="250" y="420" /><di:waypoint x="268" y="420" /><di:waypoint x="286" y="420" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-420" bpmnElement="_6-420"><di:waypoint x="348" y="111" /><di:waypoint x="366" y="111" /><di:waypoint x="378" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-636" bpmnElement="_6-636"><di:waypoint x="686" y="663" /><di:waypoint x="704" y="663" /><di:waypoint x="722" y="663" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-750" bpmnElement="_6-750"><di:waypoint x="328" y="386" /><di:waypoint x="328" y="348" /><di:waypoint x="572" y="348" /><di:waypoint x="572" y="234" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-436" bpmnElement="_6-436"><di:waypoint x="918" y="111" /><di:waypoint x="936" y="111" /><di:waypoint x="956" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-632" bpmnElement="_6-632"><di:waypoint x="335" y="555" /><di:waypoint x="353" y="555" /><di:waypoint x="353" y="663" /><di:waypoint x="464" y="663" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-634" bpmnElement="_6-634"><di:waypoint x="548" y="663" /><di:waypoint x="603" y="663" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-125" bpmnElement="_6-125"><di:waypoint x="96" y="111" /><di:waypoint x="114" y="111" /><di:waypoint x="145" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-430" bpmnElement="_6-430"><di:waypoint x="600" y="200" /><di:waypoint x="618" y="200" /><di:waypoint x="618" y="252" /><di:waypoint x="576" y="252" /><di:waypoint x="549" y="252" /><di:waypoint x="360" y="252" /><di:waypoint x="360" y="111" /><di:waypoint x="378" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-642" bpmnElement="_6-642"><di:waypoint x="545" y="234" /><di:waypoint x="545" y="324" /><di:waypoint x="234" y="324" /><di:waypoint x="234" y="404" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-424" bpmnElement="_6-424"><di:waypoint x="399" y="132" /><di:waypoint x="399" y="200" /><di:waypoint x="448" y="200" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-638" bpmnElement="_6-638"><di:waypoint x="306" y="145" /><di:waypoint x="306" y="252" /><di:waypoint x="94" y="252" /><di:waypoint x="94" y="405" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-426" bpmnElement="_6-426"><di:waypoint x="480" y="200" /><di:waypoint x="498" y="200" /><di:waypoint x="517" y="200" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-693" bpmnElement="_6-693"><di:waypoint x="161" y="441" /><di:waypoint x="161" y="556" /><di:waypoint x="252" y="555" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-178" bpmnElement="_6-178"><di:waypoint x="228" y="111" /><di:waypoint x="265" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-746" bpmnElement="_6-746"><di:waypoint x="370" y="420" /><di:waypoint x="386" y="420" /><di:waypoint x="386" y="474" /><di:waypoint x="191" y="474" /><di:waypoint x="191" y="420" /><di:waypoint x="218" y="420" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Trisotech.Visio__6__6-434" bpmnElement="_6-434"><di:waypoint x="810" y="111" /><di:waypoint x="834" y="111" /><bpmndi:BPMNLabel /></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></semantic:definitions>')


    persistXML(xml);

    // Try to get existing thread_id from localStorage
    const storedThreadId = localStorage.getItem('chat_thread_id');
    if (storedThreadId) {
      setThreadId(storedThreadId);
    }
  }, [xml, threadId, params.fileId]);

  // Persist the BPMN XML to localStorage
  const persistXML = (xml:string) => {
    if (!xml) return;
    
    localStorage.setItem(params.fileId, xml);
    // console.log('BPMN XML persisted to localStorage', localStorage.getItem(params.fileId));

  }

  // Clear the BPMN XML from localStorage
  const clearXml = () => {
    localStorage.removeItem(params.fileId);
  }

  const startChat = () => {
    setIsChatStarted(true);
    setMessages([
      { 
        role: 'assistant', 
        content: `Hi ${user.name}! 👋 I'm your BPMN assistant. How can I help you with BPMN diagrams today?`
      }
    ]);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleError = (error: Error) => {
    console.error('BPMN Error:', error);
    setError(error.message);
  };

  const handleImport = () => {
    console.log('BPMN diagram imported successfully');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          thread_id: threadId
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let decoder = new TextDecoder();
      let buffer = '';
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }

              // Handle new thread_id if provided
              if (data.thread_id && !threadId) {
                setThreadId(data.thread_id);
                localStorage.setItem('chat_thread_id', data.thread_id);
              }

              if (data.response) {
                assistantMessage += data.response;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage;
                  } else {
                    newMessages.push({ role: 'assistant', content: assistantMessage });
                  }
                  return newMessages;
                });
              }
            } catch (error) {
              console.error('Error parsing SSE data:', error);
              throw error;
            }
          }
        }
        buffer = lines[lines.length - 1];
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BreadcrumbsHeader 
        href='/dashboard' 
        current='ChatBot' 
        parent='Playground'
        subParent='Chat'
        subParentHref='/dashboard/chat'
      />
      <div className="flex flex-1 gap-4 p-4 pt-0 h-[calc(100vh-8rem)]">
        {/* BPMN Modeler */}
        <div className="flex-1 rounded-xl bg-muted/50">
          <BpmnModelerComponent
            containerId="bpmn-modeler"
            propertiesPanelId="properties-panel"
            diagramXML={xml}
            onError={handleError}
            onImport={handleImport}
            height="100%"
            width="100%"
          />
        </div>

        {/* Chat Interface */}
        <div className="w-full md:w-[400px] h-full flex flex-col rounded-xl bg-muted/50 backdrop-blur-md shadow-lg">
          {/* Chat Header */}
          <div className="p-4 border-b bg-background/50 backdrop-blur-sm rounded-t-xl">
            <div className="flex flex-col gap-2">
              <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
              >
          <div className="p-2 rounded-full bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">BPMN Assistant</h2>
              </motion.div>
            </div>
          </div>

          {!isChatStarted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex items-center justify-center p-6"
            >
              <div className="text-center space-y-6">
                <div className="p-4 rounded-full bg-primary/10 mx-auto w-fit">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Welcome to BPMN Assistant</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  I can help you create and modify BPMN diagrams through natural conversation.
                </p>
                <Button 
                  onClick={startChat}
                  className="animate-pulse hover:animate-none px-8"
                  size="lg"
                >
                  Start Chat
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-10rem)]">
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <motion.div 
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`p-4 shadow-sm ${
                          message.role === 'user' 
                          ? 'ml-auto bg-primary text-primary-foreground' 
                          : 'mr-auto bg-background'
                        } max-w-[85%] break-words rounded-2xl ${
                          message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                        }`}
                      >
                        {message.content}
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-5 border-t bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col gap-2 ">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-lg"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder={isLoading ? "Please wait..." : "Type your message..."}
                      disabled={isLoading}
                      className="flex-1 rounded-full px-4 bg-background"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      size="icon"
                      disabled={isLoading}
                      className="rounded-full h-10 w-10"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Bot className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}