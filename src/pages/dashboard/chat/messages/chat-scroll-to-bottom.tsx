import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";

interface ChatScrollToBottomProps {
  show: boolean;
  onClick: () => void;
}

const ChatScrollToBottom = ({ show, onClick }: ChatScrollToBottomProps) => {
  return (
    <div className="relative bottom-28">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="absolute top-16 left-1/2 z-20 -translate-x-1/2"
          >
            <Button
              variant="secondary"
              className="h-8 w-8 cursor-pointer items-center justify-center rounded-full"
              onClick={onClick}
            >
              <ArrowDown />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatScrollToBottom;
