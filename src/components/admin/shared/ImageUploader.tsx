import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, XIcon } from "lucide-react";
interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
}
export function ImageUploader({
  value,
  onChange,
  onRemove
}: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real application, you would upload the file to your server here
    // For now, we'll just create a data URL
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"]
    },
    multiple: false
  });
  return <div className="w-full">
      {value ? <div className="relative">
          <img src={value} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
          {onRemove && <button onClick={onRemove} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
              <XIcon size={16} />
            </button>}
        </div> : <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-500"}`}>
          <input {...getInputProps()} />
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">
            Drag and drop an image here, or click to select a file
          </p>
        </div>}
    </div>;
}