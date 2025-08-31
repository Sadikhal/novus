// import React, { useState, useRef, useEffect } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from './ui/Button';
// import upload from '../lib/upload';

// const ImageCropModal = ({ 
//   isOpen, 
//   onClose, 
//   onUploadComplete, 
//   queue,
//   onSkipCurrent 
// }) => {
//   const [src, setSrc] = useState(null);
//   const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
//   const [currentFile, setCurrentFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!isOpen) {
//       setSrc(null);
//       setCurrentFile(null);
//       setCrop({ unit: '%', width: 50, aspect: 1 });
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen && queue.length > 0 && !currentFile) {
//       const nextFile = queue[0];
//       const reader = new FileReader();
//       reader.onload = () => setSrc(reader.result);
//       reader.readAsDataURL(nextFile);
//       setCurrentFile(nextFile);
//     } else if (isOpen && queue.length === 0) {
//       onClose();
//     }
//   }, [isOpen, queue, currentFile, onClose]);

//   const handleCropComplete = async () => {
//     if (!imageRef.current || !canvasRef.current || !currentFile) return;

//     const image = imageRef.current;
//     const cropArea = {
//       x: crop.x * (image.naturalWidth / image.width),
//       y: crop.y * (image.naturalHeight / image.height),
//       width: crop.width * (image.naturalWidth / image.width),
//       height: crop.height * (image.naturalHeight / image.height),
//     };

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     canvas.width = cropArea.width;
//     canvas.height = cropArea.height;

//     ctx.drawImage(
//       image,
//       cropArea.x,
//       cropArea.y,
//       cropArea.width,
//       cropArea.height,
//       0,
//       0,
//       cropArea.width,
//       cropArea.height
//     );

//     canvas.toBlob(async (blob) => {
//       try {
//         setUploading(true);
//         const croppedFile = new File([blob], currentFile.name, {
//           type: 'image/jpeg',
//           lastModified: Date.now(),
//         });

//         const url = await upload(croppedFile);
//         onUploadComplete(url);
//         setCurrentFile(null);
//       } catch (err) {
//         console.error('Upload Error:', err);
//       } finally {
//         setUploading(false);
//       }
//     }, 'image/jpeg');
//   };

//   const handleSkip = () => {
//     onSkipCurrent();
//     setCurrentFile(null);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-2xl">
//       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col">
//         {src && currentFile ? (
//           <>
//             <div className="overflow-auto flex-grow min-h-0 mb-4">
//               <ReactCrop
//                 crop={crop}
//                 onChange={c => setCrop(c)}
//                 onComplete={c => setCrop(c)}
//               >
//                 <img
//                   ref={imageRef}
//                   src={src}
//                   alt="Crop preview"
//                   style={{ maxWidth: '100%' }}
//                   className="max-h-[60vh] object-contain"
//                 />
//               </ReactCrop>
//             </div>
//             <canvas ref={canvasRef} style={{ display: 'none' }} />
//             <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
//               <Button
//                 type="button"
//                 onClick={onClose}
//                 className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins"
//               >
//                 Cancel
//               </Button>
//               {queue.length > 1 && (
//                 <Button
//                   type="button"
//                   onClick={handleSkip}
//                   variant="outline"
//                   className="text-red-800 border-red-900 hover:bg-red-50"
//                 >
//                   Skip
//                 </Button>
//               )}
//               <Button 
//                 type="button"
//                 onClick={handleCropComplete} 
//                 className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite"
//                 disabled={uploading}
//               >
//                 {uploading ? 'Uploading...' : 'Crop & Upload'}
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="text-center p-8">
//             <p>Processing next image...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageCropModal;




// // ImageCropModal.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from './ui/Button';
// import upload from '../lib/upload';

// const DEFAULT_CROP = { unit: '%', x: 0, y: 0, width: 50, height: 50, aspect: 1 };

// const ImageCropModal = ({
//   isOpen,
//   onClose,
//   onUploadComplete,
//   queue = [],
//   onSkipCurrent
// }) => {
//   const [src, setSrc] = useState(null);
//   const [crop, setCrop] = useState(DEFAULT_CROP);
//   const [currentFile, setCurrentFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);
//   const cropRef = useRef(DEFAULT_CROP);
//   const percentCropRef = useRef(null);

//   // Reset modal when closed
//   useEffect(() => {
//     if (!isOpen) {
//       setSrc(null);
//       setCurrentFile(null);
//       setCrop(DEFAULT_CROP);
//       cropRef.current = DEFAULT_CROP;
//       percentCropRef.current = null;
//     }
//   }, [isOpen]);

//   // Load next file
//   useEffect(() => {
//     if (isOpen && queue.length > 0 && !currentFile) {
//       const nextFile = queue[0];
//       const reader = new FileReader();
//       reader.onload = () => setSrc(reader.result);
//       reader.readAsDataURL(nextFile);
//       setCurrentFile(nextFile);
//     } else if (isOpen && queue.length === 0) {
//       onClose();
//     }
//   }, [isOpen, queue, currentFile, onClose]);

//   const handleCropChange = (c, percentC) => {
//     setCrop(c);
//     cropRef.current = c;
//     percentCropRef.current = percentC;
//   };

//   const getPixelCrop = () => {
//     const img = imageRef.current;
//     const c = percentCropRef.current;
//     if (!img || !c) return null;
//     return {
//       x: Math.round((c.x / 100) * img.naturalWidth),
//       y: Math.round((c.y / 100) * img.naturalHeight),
//       width: Math.max(1, Math.round((c.width / 100) * img.naturalWidth)),
//       height: Math.max(1, Math.round((c.height / 100) * img.naturalHeight)),
//     };
//   };

//   const handleCropComplete = async () => {
//     const img = imageRef.current;
//     const canvas = canvasRef.current;
//     if (!img || !canvas || !currentFile) return;

//     const pixelCrop = getPixelCrop();
//     if (!pixelCrop) {
//       console.warn('No valid crop to upload');
//       return;
//     }

//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(
//       img,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       pixelCrop.width,
//       pixelCrop.height
//     );

//     canvas.toBlob(async (blob) => {
//       if (!blob) return;
//       try {
//         setUploading(true);
//         const croppedFile = new File([blob], currentFile.name, {
//           type: 'image/jpeg',
//           lastModified: Date.now(),
//         });

//         const url = await upload(croppedFile);
//         await onUploadComplete(url);

//         if (onSkipCurrent) onSkipCurrent();
//         setSrc(null);
//         setCurrentFile(null);
//       } catch (err) {
//         console.error('Upload error:', err);
//       } finally {
//         setUploading(false);
//       }
//     }, 'image/jpeg', 0.95);
//   };

//   const handleSkip = () => {
//     if (onSkipCurrent) onSkipCurrent();
//     setCurrentFile(null);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center bg-opacity-50  backdrop-blur-2xl">
//       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col">
//         {src && currentFile ? (
//           <>
//             <div className="overflow-auto flex-grow min-h-0 mb-4">
//               <ReactCrop
//                 crop={crop}
//                 onChange={handleCropChange}
//                 onComplete={(c, percentC) => {
//                   cropRef.current = c;
//                   percentCropRef.current = percentC;
//                 }}
//                 keepSelection
//               >
//                 <img
//                   ref={imageRef}
//                   src={src}
//                   alt="Crop preview"
//                   style={{
//                     display: 'block',
//                     maxWidth: '100%',
//                     maxHeight: '65vh',
//                     margin: '2 auto'
//                   }}
//                 />
//               </ReactCrop>
//             </div>

//             <canvas ref={canvasRef} style={{ display: 'none' }} />

//             <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
//               <Button onClick={onClose} 
//                type="button"className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins">Cancel</Button>
//               {queue.length > 1 && (
//                 <Button onClick={handleSkip} 
//                   type="button"  
//                   variant="outline" className="text-red-800 border-red-900 hover:bg-red-50">
//                     Skip
//                 </Button>
//               )}
//               <Button
//                type="button"  
//                onClick={handleCropComplete}
//                disabled={uploading}
//                className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite"
//               >
//                 {uploading ? 'Uploading...' : 'Crop & Upload'}
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="text-center p-8">
//             <p>Processing next image...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageCropModal;




// ImageCropModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/Button';
import upload from '../lib/upload';

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

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const cropRef = useRef(DEFAULT_CROP);
  const percentCropRef = useRef(null);

  // Reset modal when closed
  useEffect(() => {
    if (!isOpen) {
      setSrc(null);
      setCurrentFile(null);
      setCrop(DEFAULT_CROP);
      cropRef.current = DEFAULT_CROP;
      percentCropRef.current = null;
    }
  }, [isOpen]);

  // Load next file from queue, robust to parent queue updates (compare by file identity)
  useEffect(() => {
    if (!isOpen) return;
    if (!queue || queue.length === 0) {
      onClose();
      return;
    }

    const nextFile = queue[0];

    // small identity check: name + size + lastModified
    const isSameFile =
      currentFile &&
      nextFile &&
      currentFile.name === nextFile.name &&
      currentFile.size === nextFile.size &&
      currentFile.lastModified === nextFile.lastModified;

    // Only load if there is no currentFile OR queue[0] is different
    if (!isSameFile) {
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result);
      reader.readAsDataURL(nextFile);

      setCurrentFile(nextFile);
      setCrop(DEFAULT_CROP);
      cropRef.current = DEFAULT_CROP;
      percentCropRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, queue, currentFile, onClose]);

  const handleCropChange = (c, percentC) => {
    setCrop(c);
    cropRef.current = c;
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

  const handleCropComplete = async () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !currentFile) return;

    const pixelCrop = getPixelCrop();
    if (!pixelCrop) {
      console.warn('No valid crop to upload');
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

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        setUploading(true);
        const croppedFile = new File([blob], currentFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        // upload your cropped file
        const url = await upload(croppedFile);

        // tell parent the uploaded url
        await onUploadComplete(url);

        // tell parent to remove the processed file from queue
        if (onSkipCurrent) onSkipCurrent();

        // clear preview while waiting for next file to be loaded from queue
        setSrc(null);
        // intentionally do NOT setCurrentFile(null) here to avoid race reloading the same file
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleSkip = () => {
    // tell parent to remove the current file from the queue
    if (onSkipCurrent) onSkipCurrent();
    // clear preview while waiting for parent queue change
    setSrc(null);
    // intentionally do NOT setCurrentFile(null) to avoid race condition
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center bg-opacity-50  backdrop-blur-2xl">
      <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col">
        {src && currentFile ? (
          <>
            <div className="overflow-auto flex-grow min-h-0 mb-4">
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                onComplete={(c, percentC) => {
                  cropRef.current = c;
                  percentCropRef.current = percentC;
                }}
                keepSelection
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

            <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
              <Button
               type='button'
               onClick={onClose} className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins">Cancel</Button>
              {queue.length > 1 && (
                <Button
                type='button'
                 onClick={handleSkip} variant="outline" className="text-red-800 border-red-900 hover:bg-red-50">
                  Skip
                </Button>
              )}
              <Button
                type='button'
                onClick={handleCropComplete}
                disabled={uploading}
                className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite"
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
