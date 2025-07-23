import { MessageCircleMore, Plus, Search, SlidersVertical } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router";
import { useDebounce } from "use-debounce";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePageContext } from "@/context/page-context";
import {
  useConversations,
  useCreateConversation,
} from "@/hooks/conversations/use-conversations";
import useScrollDetection from "@/hooks/use-scroll-detection";

import ConversationItem from "./dashboard/conversation-item";
import { Label } from "./ui/label";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { conversationType } = usePageContext();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchQuery, 300);

  //   console.log(conversations?.pages.flatMap((page) => page.results) ?? []);

  const {
    data: conversations,
    isLoading: isConversationLoading,
    isError: isConversationError,

    fetchNextPage,
  } = useConversations(conversationType, debouncedSearchTerm);

  const {
    mutate: createConversation,
    isPending: isCreateConversationPending,
    // isError: isCreateConversationError,
  } = useCreateConversation();

  const handleCreateConversation = () => {
    if (isCreateConversationPending) return;
    createConversation({ title: "New Conversation", type: "base" });
  };

  const handleBottomScroll = useCallback(async () => {
    if (
      !isConversationLoading
      // && conversations?.pages[conversations.pages.length - 1].links.next
    ) {
      // Dispatch fetching for more messages
      fetchNextPage();
    }
  }, [isConversationLoading, fetchNextPage]);

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

        {/* <SearchForm className="group-data-[collapsible=icon]:hidden" /> */}
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              placeholder="Search the docs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent ref={SidebarContentRef} className="scrollbar">
        {!isConversationLoading && !isConversationError && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Chat</SidebarGroupLabel>
            <SidebarMenu>
              {conversations?.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
