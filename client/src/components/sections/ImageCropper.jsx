
import  { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import upload from '../../lib/upload';
import { Button } from '../ui/Button';

const ImageCropModal = ({ isOpen, onClose, onUploadComplete, file }) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [uploading, setUploading] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (file && isOpen) {
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result);
      reader.readAsDataURL(file);
    }
  }, [file, isOpen]);

  const handleCropComplete = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const image = imageRef.current;
    const cropArea = {
      x: crop.x * (image.naturalWidth / image.width),
      y: crop.y * (image.naturalHeight / image.height),
      width: crop.width * (image.naturalWidth / image.width),
      height: crop.height * (image.naturalHeight / image.height),
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    canvas.toBlob(async (blob) => {
      try {
        setUploading(true);
        const croppedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        const url = await upload(croppedFile);
        onUploadComplete(url);
      } catch (err) {
        console.error('Upload Error:', err);
      } finally {
        setUploading(false);
        onClose();
      }
    }, 'image/jpeg');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-2xl">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center text-white">
              <svg
                className="animate-spin h-8 w-8 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
              Uploading...
            </div>
          </div>
        )}
        {src ?  (
          <>
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCrop(c)}
              disabled={uploading}

            >
              <img
                ref={imageRef}
                src={src}
                alt="Crop preview"
                style={{ maxWidth: '100%' }}
              />
            </ReactCrop>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                onClick={onClose}
                className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleCropComplete} 
                className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Photo'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-8 text-slate-800">
            <p>Processing next image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropModal;