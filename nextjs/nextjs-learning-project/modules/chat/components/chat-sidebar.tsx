"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserButton from "@/modules/authentication/components/user-button";

import { cn } from "@/lib/utils";
import {
  PlusIcon,
  SearchIcon,
  MenuIcon,
  EllipsisIcon,
  Trash,
} from "lucide-react";

type ChatSidebarUser = {
  name: string | null;
  email: string;
  image?: string | null;
  createdAt: Date;
};

type ChatSidebarProps = {
  user: ChatSidebarUser | null;
};

const ChatSidebar = ({ user }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Header - Logo */}
      <div className="flex items-center gap-2 p-4">
        <Image src={"/logo.svg"} alt="logo" width={28} height={28} />
        <span className="font-semibold text-sidebar-foreground">T3.chat</span>
      </div>

      {/* New Chat Button */}
      <div className="p-4 pt-0">
        <Link href={"/"}>
          <Button className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your chat..."
            className="pl-9 bg-sidebar-accent border-sidebar-border pr-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="text-center text-sm text-muted-foreground py-8">
          No chats Yet
        </div>
      </div>

      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
        <UserButton user={user} />
        <span className="flex-1 text-sm text-sidebar-foreground truncate">
          {user?.name}
        </span>
      </div>
    </div>
  );
};

export default ChatSidebar;
