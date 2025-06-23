import { Plus } from "lucide-react";
import * as React from "react";
import { useCallback } from "react";

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

      // if (fetchNextConversations.fulfilled.match(resultAction)) {
      //   ReactGA.event({
      // 	category: "conversation",
      // 	action: "load more conversations",
      // 	label: "loaded previous conversations",
      //   });
      // }
    }
  }, [conversations, isConversationLoading, fetchNextPage]);

  const SidebarContentRef = useScrollDetection({
    onBottom: handleBottomScroll,
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton onClick={handleCreateConversation}>
          <Plus />
          <span>Create new chat</span>
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
