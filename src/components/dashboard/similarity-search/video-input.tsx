import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSimilaritySearchContext } from "@/context/similarity-search";

const FRAME_INTERVAL = 2; // every 2 seconds, for example
const allowed_video_formats = [".mpeg", ".mp4", ".mkv"];

const VideoInput = () => {
  const {
    setFramePreviews,

    isExtracting,
    setIsExtracting,
  } = useSimilaritySearchContext();
  // Example in React:
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  const handlePickClick = () => {
    // console.log("Button clicked, opening file input...");
    inputRef.current?.click();
  };

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isExtracting) {
      setIsExtracting(true);
      video.play();
    } else {
      setIsExtracting(false);
      video.pause();
    }
  };

  const handleClearVideo = () => {
    setFramePreviews([]);
    setIsExtracting(false);
    setVideoFile(null);
    setVideoURL(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const captureAndSendFrame = useCallback(
    (video: HTMLVideoElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log(`${video.videoWidth}x${video.videoHeight}`);
      console.log(`${canvas.width}x${canvas.height}`);
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          // Send blob to backend (e.g., using fetch/axios)
          // uploadFrame(blob, video.currentTime);

          const imageUrl = URL.createObjectURL(blob);
          setFramePreviews((prev) => [...prev, imageUrl]);
        },
        "image/jpeg",
        0.95,
      );
    },
    [setFramePreviews],
  );

  useEffect(() => {
    if (!isExtracting) return;
    let lastFrameTime = 0;
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended) {
        const now = video.currentTime;
        if (now - lastFrameTime >= FRAME_INTERVAL) {
          captureAndSendFrame(video);
          lastFrameTime = now;
        }
      }
    }, 500); // check every half second (or adjust)

    return () => clearInterval(interval);
  }, [isExtracting, captureAndSendFrame]);

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 px-6 py-4">
      {/* Live status row */}
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2 font-medium text-green-700">
          <div className="size-4 rounded-full bg-[#247964]/80 shadow-[0_0_18px_rgba(0,255,40,0.8)]"></div>
          Live
        </div>
        <div className="text-sm">ZAD</div>
      </div>

      {/* Camera feed */}
      <div className="flex h-[calc(100vh-15rem)] flex-1 items-center justify-center">
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept={allowed_video_formats.join(", ")}
          onChange={handleVideoSelect}
        />
        {!videoFile && !videoURL && (
          <div
            className="flex h-full w-2/3 cursor-pointer items-center justify-center rounded-xl border-4 border-dashed"
            onClick={handlePickClick}
          >
            <span>Camera Feed</span>
          </div>
        )}

        {videoFile && videoURL && (
          <video
            ref={videoRef}
            src={videoURL}
            crossOrigin="anonymous"
            className="h-full rounded-xl"
            onPause={() => setIsExtracting(false)}
            onEnded={() => setIsExtracting(false)}
            onChange={(e) => console.log(e)}
          />
        )}
      </div>

      {/* Image Retrieval button */}
      <div className="flex justify-center gap-4">
        <Button disabled={!videoFile && !videoURL} onClick={handlePlay}>
          {!isExtracting && <Play />}
          {isExtracting && <Pause />}
        </Button>
        {videoFile && videoURL && (
          <Button variant="destructive" onClick={handleClearVideo}>
            <RotateCcw />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoInput;
