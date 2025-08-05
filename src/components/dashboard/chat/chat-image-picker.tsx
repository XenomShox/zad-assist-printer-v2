import imageCompression from "browser-image-compression";
import { Plus } from "lucide-react";
// import ReactGA from "react-ga4";
import { toast } from "sonner";

import { useChatContext } from "@/context/chat-context";
import { cn } from "@/lib/utils";

type TImagePickerProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;

  disabled?: boolean;
};

const allowed_img_types = [".jpeg", ".jpg", ".heic", ".png"];

const ImagePicker = ({
  fileInputRef,
  setImage,
  setPreviewUrl,

  disabled = false,
}: TImagePickerProps) => {
  const { type: size } = useChatContext();

  const handlePickClick = () => {
    // console.log("Button clicked, opening file input...");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const filename = file.name.toLowerCase();
    if (allowed_img_types.some((type) => filename.endsWith(type))) {
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 2160,
        useWebWorker: true,
      };

      try {
        const compressedBlob = await imageCompression(file, options);

        // Convert Blob to File (fixes FormData issue)
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type, // Keep original file type
          lastModified: Date.now(),
        });

        //   ReactGA.event({
        //     category: "conversation",
        //     action: "image selection",
        //     label: "user selected an image",
        //   });

        setImage(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.log(error);
      }

      // Reset input value to allow re-selecting the same file
      e.target.value = "";
    } else {
      toast.error("Uh oh! something went wrong.", {
        description: "Can only select .jpeg and .jpg images",
      });
    }
  };

  return (
    <>
      <input
        className="hidden"
        type="file"
        accept={allowed_img_types.join(", ")}
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />

      <button
        onClick={handlePickClick}
        disabled={disabled}
        type="button"
        aria-label="pick image button"
        className={cn(
          "flex items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:bg-neutral-400",
          {
            "h-6 w-6 sm:h-8 sm:w-8": size === "base",
            "h-8 w-8 sm:h-6 sm:w-6": size === "parameter",
          },
        )}
      >
        <Plus
          size={size === "base" ? 26 : 24}
          strokeWidth={1.25}
          className="text-white"
        />
      </button>
    </>
  );
};

export default ImagePicker;
