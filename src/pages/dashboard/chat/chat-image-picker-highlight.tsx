import { X } from "lucide-react";

type TImagePickerHighlight = {
  previewUrl: string;
  handleClearImage: () => void;
};

const ImagePickerHighlight = ({
  previewUrl,
  handleClearImage,
}: TImagePickerHighlight) => {
  return (
    <div className="relative h-fit w-fit">
      <img
        src={previewUrl}
        alt="Preview"
        className="h-20 w-20 rounded-2xl border-2 border-neutral-700 object-cover shadow-lg"
        width={128}
        height={128}
      />
      <button
        type="button"
        className="absolute -top-2 -right-2 rounded-full bg-white px-1 py-1 text-xs text-black"
        onClick={handleClearImage}
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default ImagePickerHighlight;
