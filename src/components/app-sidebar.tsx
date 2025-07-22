import { MessageCircleMore, Plus, SlidersVertical } from "lucide-react";
import * as React from "react";
import { useCallback } from "react";
import { Link } from "react-router";

import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  useConversations,
  useCreateConversation,
} from "@/hooks/conversations/use-conversations";
import useScrollDetection from "@/hooks/use-scroll-detection";

import ConversationItem from "./dashboard/conversation-item";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: conversations,
    isLoading: isConversationLoading,
    isError: isConversationError,

    fetchNextPage,
  } = useConversations("base");

  const {
    mutate: createConversation,
    isPending: isCreateConversationPending,
    // isError: isCreateConversationError,
  } = useCreateConversation();

  //   console.log(conversations?.pages.flatMap((page) => page.results) ?? []);

  const handleCreateConversation = () => {
    if (isCreateConversationPending) return;
    createConversation({ title: "New Conversation", type: "base" });
  };

  const handleBottomScroll = useCallback(async () => {
    if (
      !isConversationLoading &&
      conversations?.pages[conversations.pages.length - 1].links.next
    ) {
      // Dispatch fetching for more messages
      fetchNextPage();
    }
  }, [conversations, isConversationLoading, fetchNextPage]);

  const SidebarContentRef = useScrollDetection({
    onBottom: handleBottomScroll,
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          className="cursor-pointer"
          onClick={handleCreateConversation}
        >
          <Plus />
          <span>New chat</span>
        </SidebarMenuButton>
        <SidebarMenuButton
          asChild
          className="group/link flex-row-reverse justify-between"
        >
          <Link to="/d/c">
            <MessageCircleMore className="text-black/0 transition-all group-hover/link:text-black/100 group-data-[collapsible=icon]:text-black dark:text-white/0 group-hover/link:dark:text-white group-data-[collapsible=icon]:dark:text-white" />
            <span>Chat system</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          asChild
          className="group/link flex-row-reverse justify-between"
        >
          <Link to="/d/c">
            <SlidersVertical className="text-black/0 transition-all group-hover/link:text-black/100 group-data-[collapsible=icon]:text-black dark:text-white/0 group-hover/link:dark:text-white group-data-[collapsible=icon]:dark:text-white" />
            <span>Optimal parameter setting</span>
          </Link>
        </SidebarMenuButton>
        <SearchForm className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent ref={SidebarContentRef} className="scrollbar">
        {!isConversationLoading && !isConversationError && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Chat</SidebarGroupLabel>
            <SidebarMenu>
              {(conversations?.pages.flatMap((page) => page.results) ?? []).map(
                (converstaion) => (
                  <ConversationItem
                    key={converstaion.id}
                    converstaion={converstaion}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
