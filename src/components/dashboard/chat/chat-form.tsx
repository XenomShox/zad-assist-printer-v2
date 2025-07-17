import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useChatContext } from "@/context/ChatContext";
import { useMachineContext } from "@/context/machine";
import { useCreateTextMessage } from "@/hooks/conversations/use-messages";
import { cn } from "@/lib/utils";

import ImagePicker from "./chat-image-picker";
import ImagePickerHighlight from "./chat-image-picker-highlight";
import ChatScrollToBottom from "./messages/chat-scroll-to-bottom";

interface ChatFormProps {
  showScrollToBottom: boolean;
  handleScrollToBottom: () => void;
}

const ChatForm = ({
  showScrollToBottom,
  handleScrollToBottom,
}: ChatFormProps) => {
  const { conversation, type } = useChatContext();
  const { machine } = useMachineContext();
  const { mutate: createTextMessage, isPending: isCreateTextMessagePending } =
    useCreateTextMessage(conversation.data?.id);

  const [text, setText] = useState<string>("");
  const [, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isFormDisabled = !text || isCreateTextMessagePending;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      //   console.log(textarea.scrollHeight);
      textarea.style.height = "auto";
      textarea.style.height =
        text.length === 0
          ? "32px"
          : `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleClearImage = () => {
    // ReactGA.event({
    //   category: "conversation",
    //   action: "image cancel selection",
    //   label: "user canceled an image selection",
    // });

    setImage(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        setText((prev) => prev + "\n");
      } else {
        // if (!isFormDisabled) handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (isFormDisabled) return;

    console.log({
      conversationId: conversation.data!.id,
      text,
      sender: "user",
      machine,
    });
    createTextMessage({
      conversationId: conversation.data!.id,
      text,
      sender: "user",
      machine,
    });
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
      {/* The scroll to bottom button */}
      <div className="relative">
        <ChatScrollToBottom
          show={showScrollToBottom}
          onClick={handleScrollToBottom}
        />
      </div>

      {/* The form itself */}
      <form
        className="bg-accent left-1/2 flex min-h-24 w-[48rem] flex-col justify-between gap-2 rounded-lg p-2 2xl:gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isFormDisabled) handleSubmit();
        }}
      >
        {type === "base" && previewUrl && (
          <ImagePickerHighlight
            previewUrl={previewUrl}
            handleClearImage={handleClearImage}
          />
        )}
        <div className="w-full">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Please let us know how we can help!"
            rows={1}
            className="scrollbar-light max-h-36 w-full resize-none bg-transparent p-1 outline-none placeholder:text-xs placeholder:sm:text-base"
          />
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {type === "base" && (
              <ImagePicker
                //   disabled={!!isPendingAIResponse[conversationId] || submittingMsg}
                fileInputRef={fileInputRef}
                setImage={setImage}
                setPreviewUrl={setPreviewUrl}
              />
            )}

            {/* <Toggle
            pressed={selectedTool === "similarity search"}
            onPressedChange={(value) =>
              handleTogglePressed(value, "similarity search")
            }
            aria-label="Toggle similarity search"
            className="h-8 gap-2 hover:bg-neutral-500 hover:text-white data-[state=on]:bg-neutral-700 data-[state=on]:text-white"
          >
            <Images size={18} /> Similarity search
          </Toggle> */}
          </div>

          <button
            //   disabled={isFormDisabled}
            type="submit"
            aria-label="send message button"
            className={cn(
              "flex items-center justify-center rounded-full bg-[#023F30] transition-colors hover:bg-[#185243] disabled:bg-neutral-400",
              {
                "h-6 w-6 sm:h-8 sm:w-8": type === "base",
                "h-6 w-6": type === "parameter",
              },
            )}
          >
            {/* {isPendingAIResponse[conversation?.id] && <LoadingSpinner />}
          {!isPendingAIResponse[conversation?.id] && (
            <ArrowUp
              size={type === "base" ? 28 : 24}
              strokeWidth={2}
              className="text-white"
            />
          )} */}
            <ArrowUp
              size={type === "base" ? 28 : 24}
              strokeWidth={2}
              className="text-white"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatForm;
