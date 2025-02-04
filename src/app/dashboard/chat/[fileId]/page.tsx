"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import BreadcrumbsHeader from "../../_components/breadcrumbs-header";
import BpmnModelerComponent from "../../text2bpmn/_components/bpmn-modeler-component";
import { apiWrapper } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Bot, Send, AlertCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/providers/user-provider";
import { API_PATHS } from "@/app/api/api-path/apiPath";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Bpmn } from "@/types/bpmn/bpmn";
import { useRouter } from "next/navigation";
import { config } from "@/config";
import { useAutoSave } from "@/hooks/use-auto-save";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPageParams {
  params: {
    fileId: string;
  };
}

export default function ChatPage({ params }: ChatPageParams) {
  const [xml, setXml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [threadId, setThreadId] = useState<string | null>(null);
  const { setCurrentBpmn, currentBpmn } = useWorkspaceStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);  
  const [isSaving, setIsSaving] = useState<boolean>(false); // auto-save state

  const checkFile = useCallback(async () => {
    try {
      const res = await apiWrapper({
        uri: API_PATHS.CHECKFILE,
        method: "POST",
        body: { fileId: params.fileId },
      });

      if (!res || !res.id) {
        router.push("/dashboard/chat");
        setIsMounted(false);
        return;
      }

      const state: Bpmn = {
        createdBy: res.createdBy,
        fileName: res.fileName,
        createdAt: res.createdAt,
        id: res.id,
        isShared: res.isShared,
        threadId: res.threadId,
        isFavorite: res.isFavorite,
        currentVersionId: res.currentVersionId,
        xml: res.currentVersion.xml,
      };
    
      setCurrentBpmn(state);
      setThreadId(res.threadId);
      setXml(res.currentVersion.xml);
      setIsMounted(true);

      return state;
    } catch (error) {
      console.error("Error checking file:", error);
      router.push("/dashboard/chat");
      return;
    }
  }, [params.fileId]);

  const fetchThreadHistory = useCallback(
    async (threadId: string) => {
      try {
        const res = await apiWrapper({
          url: config.PythonURL,
          uri: "thread-history",
          method: "POST",
          body: { thread_id: threadId, value: "history" },
        });

        if (res && Array.isArray(res) && res.length > 0) {
          const formattedMessages = res.map((message: any) => ({
            role: message.role,
            content: message.content,
          }));
          setIsChatStarted(true);
          setMessages(formattedMessages);
        }
        setIsMounted(true);
      } catch (error) {
        console.error("Error fetching thread history :", error);
        return;
      }
    },
    [params.fileId]
  );

  // useEffect to initialize the BPMN file
  useEffect(() => {
    const initializeFile = async () => {
      setIsMounted(false);
      const state = await checkFile();
      if (state?.threadId) {
        await fetchThreadHistory(state.threadId);
      }
      setIsMounted(true);
    };

    initializeFile();

    // Cleanup function to handle component unmount
    return () => {
      setXml("");
      setThreadId(null);
    };
  }, [params.fileId]);

  // Auto-save the BPMN XML
  useAutoSave({
    xml: xml,
    bpmnId: params.fileId,
    currentVersionId: currentBpmn?.currentVersionId || '',
    userId: user.id,
    enabled: isMounted,
    onSaveStart: () => {
        setIsSaving(true);
    },
    onSaveComplete: () => {
      setIsSaving(false);
      if (currentBpmn) {
        setCurrentBpmn({
          ...currentBpmn,
          xml,
        });
      }
      toast.success('Changes saved successfully');
    },
    onSaveError: (error) => {
      setIsSaving(false);
      console.error('Auto-save error:', error);
      toast.error('Failed to save changes');
    }
  });

 
  const startChat = () => {
    setIsChatStarted(true);
    setMessages([
      {
        role: "assistant",
        content: `Hi ${user.name}! 👋 I'm your BPMN assistant Veda. How can I help you with BPMN diagrams today?`,
      },
    ]);
  };

  // useEffect to clear the error message after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleError = (error: Error) => {
    console.error("BPMN Error:", error);
    setError(error.message);
  };

  const handleImport = () => {
    console.log("BPMN diagram imported successfully");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          thread_id: threadId,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                throw new Error(data.error);
              }

              // Handle new thread_id if provided
              // if (data.thread_id && !threadId) {
              //   setThreadId(data.thread_id);
              //   localStorage.setItem("chat_thread_id", data.thread_id);
              // }

              if (data.response) {
                if (data.response.includes("<?xml")) {
                  console.log("BPMN XML received:", data.response);
                  setXml(data.response);
                } else {
                  assistantMessage += data.response;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];

                    if (lastMessage?.role === "assistant") {
                      lastMessage.content = assistantMessage;
                    } else {
                      newMessages.push({
                        role: "assistant",
                        content: assistantMessage,
                      });
                    }
                    return newMessages;
                  });
                }
              }
            } catch (error) {
              console.error("Error parsing SSE data:", error);
              throw error;
            }
          }
        }
        buffer = lines[lines.length - 1];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbsHeader
        href="/dashboard"
        current="ChatBot"
        parent="Playground"
        subParent="Chat"
        subParentHref="/dashboard/chat"
      />
      <div className="flex flex-1 gap-4 p-4 pt-0 h-[calc(100vh-8rem)]">
        {/* BPMN Modeler */}
        <div className="flex-1 rounded-xl bg-muted/50">
          {isSaving && (
            <div className="absolute top-4 right-4 flex items-center bg-background/80 rounded-lg px-3 py-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm">Saving...</span>
            </div>
          )}
          <BpmnModelerComponent
            key={params.fileId} // Forces remount
            containerId="bpmn-modeler"
            propertiesPanelId="properties-panel"
            diagramXML={xml}
            onChange={(newXml: string) => setXml(newXml)}
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
                <h2 className="text-xl font-semibold tracking-tight">Veda</h2>
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
                <h3 className="text-xl font-medium">
                  Welcome to BPMN Assistant
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  I can help you create and modify BPMN diagrams through natural
                  conversation.
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
                      initial={{
                        opacity: 0,
                        x: message.role === "user" ? 20 : -20,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-4 shadow-sm ${
                          message.role === "user"
                            ? "ml-auto bg-primary text-primary-foreground"
                            : "mr-auto bg-background"
                        } max-w-[85%] break-words rounded-2xl ${
                          message.role === "user"
                            ? "rounded-br-sm"
                            : "rounded-bl-sm"
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSendMessage()
                      }
                      placeholder={
                        isLoading ? "Please wait..." : "Type your message..."
                      }
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
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
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
  );
}
