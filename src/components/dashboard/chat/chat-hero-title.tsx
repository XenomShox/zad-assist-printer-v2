import { cn } from "@/lib/utils";

const ChatHeroTitle = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold sm:text-5xl">
        How can we{" "}
        <span
          className={cn(
            "bg-gradient-to-r from-black to-[rgb(187,187,187)] bg-clip-text text-transparent dark:from-white",
          )}
        >
          assist
        </span>{" "}
        you today?
      </h1>
      <p className="text-center text-xs font-light sm:text-xl">
        Please make sure to select your industrial machine <br /> so we can help
        you!
      </p>
    </div>
  );
};

export default ChatHeroTitle;
