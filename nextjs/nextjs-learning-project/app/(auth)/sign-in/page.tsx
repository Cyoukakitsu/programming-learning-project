//这是登录页面组件，提供 GitHub 社交登录按钮，用户点击后跳转到 GitHub 进行身份验证。

"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Page = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-16 md:py-32">
      <div className="flex flex-row justify-center items-center gap-x-2">
        <h1 className="text-3xl font-extrabold text-foreground">Welcome to</h1>
        <Image src={"/logo.svg"} alt="logo" width={150} height={150} />
      </div>
      <p className="mt-2 text-lg text-muted-foreground font-semibold">
        Sign in below (we will increase your message limits if you do😁)
      </p>

      <Button
        variant="default"
        className="max-w-sm mt-5 w-full px-7 py-7 flex flex-row justify-center items-center cursor-pointer"
        onClick={() =>
          
        //使用 signIn.social() 进行社交登录，跳转到 GitHub 进行授权
          signIn.social({
            provider: "github",
            callbackURL: "/",
          })
        }
      >
        <Image src={"/github.svg"} alt="Github" width={24} height={24} />
        <span className="font-bold ml-2">Sign in with Github</span>
      </Button>
    </section>
  );
};

export default Page;
