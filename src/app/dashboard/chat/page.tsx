"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import BreadcrumbsHeader from '../(components)/breadcrumbs-header'
import BpmnModelerComponent from '../text2bpmn/(components)/bpmn-modeler-component';
import { apiWrapper } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Bot, Send, AlertCircle, ClipboardList, Search, CheckCircle, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/providers/user-provider';
import { nanoid } from 'nanoid';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// interface ChatResponse {
//   response: string;
//   can_proceed: boolean;
//   bpmn_xml: string | null;
// }
export default function ChatPage() {
  const [xml, setXml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [currentStage, setCurrentStage] = useState<string>('gathering');
  const [threadId, setThreadId] = useState<string>('');

  useEffect(() => {
    // Try to get existing thread_id from localStorage
    const storedThreadId = localStorage.getItem('chat_thread_id');
    if (storedThreadId) {
      setThreadId(storedThreadId);
    }
  }, []);

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

  // const startBPMNGeneration = useCallback(async () => {
  //   try {
  //     const eventSource = new EventSource(
  //       `${process.env.NEXT_PUBLIC_API_URL}/generate-bpmn-stream?conversation_id=${conversationId}`
  //     );

  //     let fullXml = '';
      
  //     eventSource.addEventListener('chunk', (event) => {
  //       const data = JSON.parse(event.data);
  //       fullXml += data.xml_chunk;
  //       setXml(fullXml); // This will update the BPMN modeler in real-time
  //     });

  //     eventSource.addEventListener('complete', () => {
  //       eventSource.close();
  //       setIsLoading(false);
  //     });

  //     eventSource.addEventListener('error', (event) => {
  //       console.error('Error generating BPMN:', event);
  //       eventSource.close();
  //       setIsLoading(false);
  //       setError('Failed to generate BPMN diagram');
  //     });
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to generate BPMN');
  //     setIsLoading(false);
  //   }
  // }, [conversationId]);

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
                if (data.response.includes('<?xml')) {
                  setXml(data.response);
                } else {
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

  // // Monitor messages for BPMN generation confirmation
  // useEffect(() => {
  //   const lastUserMessage = messages[messages.length - 2];
  //   const lastAssistantMessage = messages[messages.length - 1];

  //   if (lastUserMessage?.role === 'user' && 
  //       lastAssistantMessage?.role === 'assistant' && 
  //       lastUserMessage.content.toLowerCase().includes('yes') &&
  //       lastAssistantMessage.content.includes('Would you like me to create it now?')) {
  //     startBPMNGeneration();
  //   }
  // }, [messages, startBPMNGeneration]);

  // Rest of your component remains the same
  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current='Text2Bpmn' parent='Playground'/>
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