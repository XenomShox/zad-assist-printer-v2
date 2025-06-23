import { Forward, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router";

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
import { useDeleteConversation } from "@/hooks/conversations/use-conversations";
import type { TConversation } from "@/lib/conversations";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  converstaion: TConversation;
}
const ConversationItem = ({ converstaion }: ConversationItemProps) => {
  const { isMobile } = useSidebar();
  const { conversationId } = useParams();

  const { mutate: deleteChat } = useDeleteConversation();

  const handleEditChat = () => {};
  const handleDeleteChat = () => {
    deleteChat(converstaion.id);
  };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn({ "bg-muted": converstaion.id === conversationId })}
      >
        <Link to={`/d/c/${converstaion.id}`}>
          <span>{converstaion.title}</span>
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
          <DropdownMenuItem>
            <Forward className="text-muted-foreground" />
            <span>Share Project</span>
          </DropdownMenuItem>
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
