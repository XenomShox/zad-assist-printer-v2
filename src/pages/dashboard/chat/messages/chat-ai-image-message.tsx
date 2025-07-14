// import ReactGA from "react-ga4";

// import { GA_ENABLED } from "@/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AIImageMessageProps = {
  id: string;
  data: string;
};

const AIImageMessage = ({ id, data }: AIImageMessageProps) => {
  if (!data) return null;

  //   const handleClick = () => {
  //     if (GA_ENABLED)
  //       ReactGA.event({
  //         category: "conversation",
  //         action: "ai image message open dialog",
  //         label: "user opened ai image message dialog",
  //       });
  //   };
  return (
    <Dialog>
      <DialogTrigger asChild /* onClick={handleClick} */>
        <div
          className={cn(
            "w-fit cursor-pointer rounded-3xl border-2 border-neutral-200 bg-white p-4 text-neutral-800",
          )}
        >
          <img className="max-h-72 rounded-xl" src={data} alt={`${id}`} />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center sm:max-w-fit">
        <div className={cn("m-4 w-fit rounded-3xl bg-white text-neutral-800")}>
          <img className="max-h-[90vh] rounded-xl" src={data} alt={`${id}`} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIImageMessage;
