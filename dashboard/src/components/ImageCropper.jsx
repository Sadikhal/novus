
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/Button';
import upload from '../lib/upload';
import { toast } from '../redux/useToast';

const DEFAULT_CROP = { unit: '%', x: 0, y: 0, width: 50, height: 50, aspect: 1 };

const ImageCropModal = ({
  isOpen,
  onClose,
  onUploadComplete,
  queue = [],
  onSkipCurrent
}) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState(DEFAULT_CROP);
  const [currentFile, setCurrentFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hdMode, setHdMode] = useState(false);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const percentCropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSrc(null);
      setCurrentFile(null);
      setCrop(DEFAULT_CROP);
      percentCropRef.current = null;
      setHdMode(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !queue || queue.length === 0) return;

    const nextFile = queue[0];
    const objectUrl = URL.createObjectURL(nextFile);

    setSrc(objectUrl);
    setCurrentFile(nextFile);
    setCrop(DEFAULT_CROP);
    percentCropRef.current = null;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, queue]);

  const handleCropChange = (c, percentC) => {
    setCrop(c);
    percentCropRef.current = percentC;
  };

  const getPixelCrop = () => {
    const img = imageRef.current;
    const c = percentCropRef.current;
    if (!img || !c) return null;
    return {
      x: Math.round((c.x / 100) * img.naturalWidth),
      y: Math.round((c.y / 100) * img.naturalHeight),
      width: Math.max(1, Math.round((c.width / 100) * img.naturalWidth)),
      height: Math.max(1, Math.round((c.height / 100) * img.naturalHeight)),
    };
  };

  const handleCropComplete = useCallback(async () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !currentFile) return;

    const pixelCrop = getPixelCrop();
    if (!pixelCrop) {
      toast({
        variant: 'destructive',
        title: 'Operation failed!',
        description: 'No valid crop to upload'
      });
      return;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    try {
      setUploading(true);

      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/webp', 0.95);
      });

      if (!blob) throw new Error('Failed to produce image blob');

      const croppedFile = new File([blob], currentFile.name.replace(/\.[^/.]+$/, ".webp"), {
        type: 'image/webp',
        lastModified: Date.now(),
      });

      if (hdMode) {
  const url = await upload(croppedFile, { minSize: 100000, maxSize: 250000, hdMode: true });
  await onUploadComplete(url);
} else {
  const url = await upload(croppedFile, { minSize: 0, maxSize: 100000, hdMode: false });
  await onUploadComplete(url);
}
      setSrc(null);
      setCurrentFile(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err?.message || "Something went wrong during upload",
      });
    } finally {
      setUploading(false);
    }
  }, [currentFile, onUploadComplete, hdMode]);

  const handleSkip = () => {
    if (onSkipCurrent) onSkipCurrent();
    setSrc(null);
    setCurrentFile(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (uploading) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCropComplete();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, uploading, handleCropComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col relative">
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

        {src && currentFile ? (
          <>
            <div className="overflow-auto flex-grow min-h-0 mb-4">
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                keepSelection
                disabled={uploading}
              >
                <img
                  ref={imageRef}
                  src={src}
                  alt="Crop preview"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '65vh',
                    margin: '0 auto'
                  }}
                />
              </ReactCrop>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="flex justify-between items-center gap-2 mt-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHdMode(prev => !prev)}
                  disabled={uploading}
                  className={`px-3 py-1 rounded-md border ${hdMode ? 'bg-[#1c5868] text-white' : 'bg-white text-gray-700'} transition-colors`}
                >
                  HD
                </button>
                <span className="text-sm text-gray-500">
                  {hdMode ? '100–250KB target' : '≤100KB target'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={onClose} disabled={uploading}
                  className="hover:bg-[#5c3e3e] bg-[#411218] text-lamaWhite">
                  Cancel
                </Button>
                {queue.length > 1 && (
                  <Button onClick={handleSkip} disabled={uploading}
                    variant="outline"
                    className="text-red-800 border-red-900 hover:bg-red-50">
                    Skip
                  </Button>
                )}
                <Button
                  onClick={handleCropComplete}
                  disabled={uploading}
                  className="hover:bg-[#95ab25] bg-[#1c5868] text-lamaWhite"
                >
                  {uploading ? 'Uploading...' : 'Crop & Upload'}
                </Button>
              </div>
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
