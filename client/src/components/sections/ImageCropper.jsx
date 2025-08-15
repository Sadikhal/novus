
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
        {src && (
          <>
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCrop(c)}
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
        )}
      </div>
    </div>
  );
};

export default ImageCropModal;