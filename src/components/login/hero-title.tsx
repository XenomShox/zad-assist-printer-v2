import { cn } from "@/lib/utils";

type THeroTitle = {
  textColor: "white" | "black";
};

const LoginHeroTitle = ({ textColor }: THeroTitle) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-center text-2xl font-bold sm:text-5xl">
        ZAD For{" "}
        <span
          className={cn(
            "bg-gradient-to-r from-white via-[rgb(187,187,187)] to-white bg-clip-text text-transparent",
            { "from-black": textColor === "black" },
          )}
        >
          Revolutionary
        </span>{" "}
        Machine Diagnosis
      </h1>
      <p className="text-center text-xs font-light sm:text-xl">
        AI-driven solution revolutionizing the manufacturing <br /> industry by
        providing intelligent
      </p>
    </div>
  );
};

export default LoginHeroTitle;
