import { AnimatePresence, motion } from "motion/react";

import { LoadingSpinner } from "@/components/loading-spinner";

const ChatNewMessagesLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="absolute top-16 left-1/2 z-20 -translate-x-1/2"
          >
            <LoadingSpinner className="h-8 w-8 text-[#023F30]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatNewMessagesLoading;
