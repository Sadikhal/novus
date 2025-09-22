import React from 'react';
import { AiFillEdit } from 'react-icons/ai';

const ImageUpload = ({
  uploadedImages = [],
  onFileSelect,
  onRemoveImage,
  fileInputRef,
  maxImages = 1,
  label = "Images",
  previewClassName = "w-32 h-32 object-cover rounded-md",
  containerClassName = "flex flex-wrap gap-4",
  uploadFor = 'default',
  showUploadButton = true,
  customUploadButton = null,
  isProfile = false,
}) => {
  const internalFileInputRef = React.useRef(null);
  const actualFileInputRef = fileInputRef || internalFileInputRef;

  const handleClick = () => {
    if (actualFileInputRef.current) {
      actualFileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isProfile  && (
        <label className="text-sm font-medium">
          {label} (Max {maxImages})
        </label>
      )}
      <input
        type="file"
        ref={actualFileInputRef}
        multiple={maxImages > 1}
        accept="image/*"
        onChange={(e) => onFileSelect(e, uploadFor)}
        className="hidden"
      />

      <div className={containerClassName}>
        {uploadedImages.map((url, index) => (
          <div key={url} className={isProfile ? "relative group" : "relative group border border-slate-300 p-2 rounded-lg"}>
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className={previewClassName}
              onClick={() => isProfile && showUploadButton && actualFileInputRef.current?.click()}
            />
            {isProfile && showUploadButton && (
              <div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1"
                onClick={() => actualFileInputRef.current?.click()}
              >
                <span className="text-white font-poppins text-xs whitespace-nowrap">Change Photo</span>
                <AiFillEdit className="h-6 w-4 text-lamaWhite" />
              </div>
            )}
            {!isProfile && (
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {showUploadButton && uploadedImages.length < maxImages && (
          customUploadButton || (
            <label
              onClick={handleClick}
              className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
            >
              <img
                src="/images/model.png"
                className="w-9 h-9 object-cover"
                alt="Upload"
              />
            </label>
          )
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
