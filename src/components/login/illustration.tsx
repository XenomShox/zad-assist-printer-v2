import HeroTitle from "./hero-title";

export default function Illustration() {
  return (
    <div className="relative z-0 hidden w-2/3 flex-col items-center justify-center gap-6 overflow-hidden bg-[rgb(2,63,48)] text-white sm:flex">
      <div className="absolute top-1/2 left-1/2 h-[1389px] w-[1389px] flex-none -translate-x-1/2 -translate-y-1/2 transform">
        <img src="/login/bg-2.svg" alt="login background" />
      </div>

      <HeroTitle textColor="white" />
    </div>
  );
}
