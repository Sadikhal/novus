import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/Button';
import upload from '../lib/upload';

const ImageCropModal = ({ 
  isOpen, 
  onClose, 
  onUploadComplete, 
  queue,
  onSkipCurrent 
}) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [currentFile, setCurrentFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSrc(null);
      setCurrentFile(null);
      setCrop({ unit: '%', width: 50, aspect: 1 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && queue.length > 0 && !currentFile) {
      const nextFile = queue[0];
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result);
      reader.readAsDataURL(nextFile);
      setCurrentFile(nextFile);
    } else if (isOpen && queue.length === 0) {
      onClose();
    }
  }, [isOpen, queue, currentFile, onClose]);

  const handleCropComplete = async () => {
    if (!imageRef.current || !canvasRef.current || !currentFile) return;

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
        const croppedFile = new File([blob], currentFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        const url = await upload(croppedFile);
        onUploadComplete(url);
        setCurrentFile(null);
      } catch (err) {
        console.error('Upload Error:', err);
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg');
  };

  const handleSkip = () => {
    onSkipCurrent();
    setCurrentFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-2xl">
      <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col">
        {src && currentFile ? (
          <>
            <div className="overflow-auto flex-grow min-h-0 mb-4">
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
                  className="max-h-[60vh] object-contain"
                />
              </ReactCrop>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
              <Button
                type="button"
                onClick={onClose}
                className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins"
              >
                Cancel
              </Button>
              {queue.length > 1 && (
                <Button
                  type="button"
                  onClick={handleSkip}
                  variant="outline"
                  className="text-red-800 border-red-900 hover:bg-red-50"
                >
                  Skip
                </Button>
              )}
              <Button 
                type="button"
                onClick={handleCropComplete} 
                className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Crop & Upload'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <p>Processing next image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropModal;