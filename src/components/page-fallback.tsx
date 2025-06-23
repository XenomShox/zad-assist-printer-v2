import { LoadingSpinner } from "./loading-spinner";

const PageFallback = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner className={"h-48 w-48 text-[#023F30]"} />
    </div>
  );
};

export default PageFallback;
