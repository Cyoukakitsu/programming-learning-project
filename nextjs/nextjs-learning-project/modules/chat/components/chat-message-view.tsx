//这是聊天界面的主容器组件，负责协调欢迎标签页和消息输入表单，管理用户选择的预设消息。

"use client";

import { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

type ChatMessageViewUser = {
  name: string | null;
  email: string;
  image?: string | null;
  createdAt: Date;
};

type ChatMessageViewProps = {
  user: ChatMessageViewUser | null;
};

const ChatMessageView = ({ user }: ChatMessageViewProps) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
  };

  const handleMessageDeselect = () => {
    setSelectedMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-10">
      <ChatWelcomeTabs
      
      //如果 user 或 user.name 为空，使用空字符串作为默认值。
        userName={user?.name ?? ""}
        onMessageSelect={handleMessageSelect}
      />
      <ChatMessageForm
        initialMessage={selectedMessage}
        onMessageChange={handleMessageDeselect}
      />
    </div>
  );
};

export default ChatMessageView;
