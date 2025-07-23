import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import { fetchChatHistory } from "@/api/messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useDeleteConversation,
  useEditConversation,
} from "@/hooks/conversations/use-conversations";
import { cn } from "@/lib/utils";
import type { TConversation } from "@/types/conversations";

import { Input } from "../ui/input";

interface ConversationItemProps {
  conversation: TConversation;
}
const ConversationItem = ({ conversation }: ConversationItemProps) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(conversation.title || "");

  const { isMobile } = useSidebar();
  const { conversationId } = useParams();

  const { mutate: deleteChat } = useDeleteConversation();
  const { mutate: editConversation } = useEditConversation();

  const handleDeleteChat = async () => {
    await deleteChat(conversation.id);
  };

  const handlePrefetch = async () => {
    // console.log("Prefetching", conversation.id);

    await queryClient.prefetchInfiniteQuery({
      queryKey: ["messages", conversation.id],
      queryFn: ({ pageParam }) => fetchChatHistory({ pageParam }),
      initialPageParam: `/zbot/conversations/${conversation.id}/history/?limit=10&start=0`,

      staleTime: 60000,
    });
  };

  const handleEditChat = () => setEditing(true);
  const editTitle = async () => {
    await editConversation({
      conversationId: conversation.id,
      newTitle: title,
      newName: conversation.name,
      newType: conversation.type,
    });
    setEditing(false);
  };

  if (editing)
    return (
      <SidebarMenuItem>
        <Input
          placeholder="Edit the title ..."
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={editTitle}
        />
      </SidebarMenuItem>
    );

  return (
    <SidebarMenuItem onMouseEnter={handlePrefetch}>
      <SidebarMenuButton
        asChild
        className={cn({ "bg-muted": conversation.id === conversationId })}
      >
        <Link to={`/d/c/${conversation.id}`}>
          <span>{conversation.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem onClick={handleEditChat}>
            <SquarePen className="text-muted-foreground" />
            <span>Edit chat</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Forward className="text-muted-foreground" />
            <span>Share Project</span>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteChat}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default ConversationItem;
