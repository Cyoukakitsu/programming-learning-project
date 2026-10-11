//currentUser：获取当前登录用户的函数（服务器端）
//ChatMessageView：聊天界面组件（客户端组件）

import { currentUser } from "@/modules/authentication/actions";
import ChatMessageView from "@/modules/chat/components/chat-message-view";


export default async function Home() {
  const user = await currentUser();
  return <ChatMessageView user={user} />;
}
