import { auth } from "@/lib/auth";
import { currentUser } from "@/modules/authentication/actions";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import Header from "@/modules/chat/components/header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  
  // 1. 获取会话（auth.api.getSession）：检查是否登录。
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await currentUser();

  // 2. 检查会话（如果未登录，重定向到登录页面）。
  if (!session) {
    return redirect("/sign-in");
  }

  //3. 如果有会话，继续渲染页面
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar user={user} />
      <main className="flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default layout;
