//这是聊天消息输入表单组件，负责用户输入消息、选择 AI 模型，并处理消息提交。

"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "./model-selector";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { useCreateChat } from "../hook/chat";

type ChatMessageFormProps = {
  initialMessage?: string;
  onMessageChange?: (message: string) => void;
};

export default function ChatMessageForm({
  initialMessage,
  onMessageChange,
}: ChatMessageFormProps) {

  //使用 useAIModels 钩子获取 AI 模型数据。
  const { data: models, isPending } = useAIModels();

  const [message, setMessage] = useState("");

  const { mutateAsync, isPending: isChatPending } = useCreateChat()
  
  //使用 models 数据中的第一个模型 ID 作为默认选中的模型。
  const [selectedModel, setSelectedModel] = useState(
    models?.models?.[0]?.id ?? "",
  );

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  //处理表单提交，防止默认行为（页面刷新），显示提示消息，清空输入框。
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();

      await mutateAsync({ content: message, model: selectedModel });
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main Input Container */}
        <div className="relative rounded-2xl border border-border shadow-sm   transition-all">
          {/* Textarea */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-15 max-h-50 resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0 "
            
            //监听键盘事件
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t ">
            {/* Left side tools */}
            <div className="flex items-center gap-1">
              {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <ModelSelector
                  models={models?.models ?? []}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                  className="ml-1"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isChatPending}
              size="sm"
              variant={message.trim() ? "default" : "ghost"}
              className="h-8 w-8 p-0 rounded-full "
              aria-label="Send message"
              title={
                message.trim() ? "Send message" : "Enter a message to enable"
              }
            >
              {isChatPending ? (
                <>
                <Spinner/>
                </>
              ) : (
                <>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </>
              )}
              </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
