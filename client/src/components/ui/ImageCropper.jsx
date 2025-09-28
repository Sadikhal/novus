// // // src/components/ui/ImageCropper.jsx
// // import React, { useState, useRef, useEffect, useCallback } from 'react';
// // import ReactCrop from 'react-image-crop';
// // import 'react-image-crop/dist/ReactCrop.css';
// // import { Button } from "../ui/Button";
// // import upload from '../../lib/upload';
// // import { toast } from '../../redux/useToast';

// // const DEFAULT_CROP = { unit: '%', x: 0, y: 0, width: 50, height: 50, aspect: 1 };

// // const ImageCropModal = ({
// //   isOpen,
// //   onClose,
// //   onUploadComplete,
// //   queue = [],
// //   onSkipCurrent
// // }) => {
// //   const [src, setSrc] = useState(null);
// //   const [crop, setCrop] = useState(DEFAULT_CROP);
// //   const [currentFile, setCurrentFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [hdMode, setHdMode] = useState(false);

// //   const imageRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const percentCropRef = useRef(null);
// //   const objectUrlRef = useRef(null);

// //   useEffect(() => {
// //     if (!isOpen) {
// //       // reset
// //       setSrc(null);
// //       setCurrentFile(null);
// //       setCrop(DEFAULT_CROP);
// //       percentCropRef.current = null;
// //       setHdMode(false);
// //       if (objectUrlRef.current) {
// //         URL.revokeObjectURL(objectUrlRef.current);
// //         objectUrlRef.current = null;
// //       }
// //     }
// //   }, [isOpen]);

// //   useEffect(() => {
// //     if (!isOpen) return;
// //     if (!queue || queue.length === 0) {
// //       // no files to process — ensure modal closes quickly if not uploading
// //       if (!uploading) {
// //         onClose();
// //       }
// //       return;
// //     }

// //     const nextFile = queue[0];
// //     if (!nextFile) return;

// //     // use object URL (faster than FileReader) and revoke previous
// //     if (objectUrlRef.current) {
// //       URL.revokeObjectURL(objectUrlRef.current);
// //       objectUrlRef.current = null;
// //     }
// //     const objectUrl = URL.createObjectURL(nextFile);
// //     objectUrlRef.current = objectUrl;
// //     setSrc(objectUrl);
// //     setCurrentFile(nextFile);
// //     setCrop(DEFAULT_CROP);
// //     percentCropRef.current = null;

// //     return () => {
// //       if (objectUrlRef.current) {
// //         try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
// //         objectUrlRef.current = null;
// //       }
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isOpen, queue]);

// //   const handleCropChange = (c, percentC) => {
// //     setCrop(c);
// //     percentCropRef.current = percentC;
// //   };

// //   const getPixelCrop = () => {
// //     const img = imageRef.current;
// //     const c = percentCropRef.current;
// //     if (!img || !c) return null;
// //     return {
// //       x: Math.round((c.x / 100) * img.naturalWidth),
// //       y: Math.round((c.y / 100) * img.naturalHeight),
// //       width: Math.max(1, Math.round((c.width / 100) * img.naturalWidth)),
// //       height: Math.max(1, Math.round((c.height / 100) * img.naturalHeight)),
// //     };
// //   };

// //   // helper to resize canvas if too big (faster toBlob)
// //   const drawAndMaybeResize = (img, pixelCrop, downscaleIf) => {
// //     // downscaleIf: if width or height > downscaleIf then scale to that limit
// //     const canvas = canvasRef.current;
// //     if (!canvas) return null;

// //     let targetW = pixelCrop.width;
// //     let targetH = pixelCrop.height;

// //     // If not HD mode and crop is huge, scale it down before toBlob to speed up toBlob and network
// //     if (!hdMode && downscaleIf && (targetW > downscaleIf || targetH > downscaleIf)) {
// //       const ratio = Math.min(downscaleIf / targetW, downscaleIf / targetH);
// //       targetW = Math.max(1, Math.floor(targetW * ratio));
// //       targetH = Math.max(1, Math.floor(targetH * ratio));
// //     }

// //     canvas.width = targetW;
// //     canvas.height = targetH;
// //     const ctx = canvas.getContext('2d');

// //     // draw with scaling if needed
// //     ctx.drawImage(
// //       img,
// //       pixelCrop.x,
// //       pixelCrop.y,
// //       pixelCrop.width,
// //       pixelCrop.height,
// //       0,
// //       0,
// //       targetW,
// //       targetH
// //     );

// //     return canvas;
// //   };

// //   const handleCropComplete = useCallback(async () => {
// //     const img = imageRef.current;
// //     const canvas = canvasRef.current;
// //     if (!img || !canvas || !currentFile) return;

// //     const pixelCrop = getPixelCrop();
// //     if (!pixelCrop) {
// //       toast({
// //         variant: 'destructive',
// //         title: 'Operation failed!',
// //         description: 'No valid crop to upload'
// //       });
// //       return;
// //     }

// //     try {
// //       setUploading(true);

// //       // For speed: when not HD, downscale large crops to max 1200px for quicker toBlob
// //       const downscaleLimit = hdMode ? 2500 : 1200;
// //       const usedCanvas = drawAndMaybeResize(img, pixelCrop, downscaleLimit);

// //       if (!usedCanvas) throw new Error('Canvas error');

// //       // choose output mime and quality: webp is usually smaller and quick
// //       const mime = hdMode ? 'image/jpeg' : 'image/webp';
// //       const quality = hdMode ? 0.92 : 0.88; // keep quality high but not huge

// //       // toBlob wrapped in promise
// //       const blob = await new Promise((resolve) => {
// //         // toBlob can be slow for very large canvases — we tried to limit canvas size above
// //         usedCanvas.toBlob((b) => resolve(b), mime, quality);
// //       });

// //       if (!blob) throw new Error('Failed to produce image blob');

// //       // prepare file name and final file
// //       const ext = mime === 'image/webp' ? '.webp' : '.jpg';
// //       const croppedFile = new File([blob], currentFile.name.replace(/\.[^/.]+$/, ext), {
// //         type: mime,
// //         lastModified: Date.now(),
// //       });

// //       // upload: upload utility will skip recompression if size is already below maxSize
// //       // choose maxSize: larger for HD so we don't over-compress — user wanted speed + optionally larger quality
// //       const maxSize = hdMode ? 400 * 1024 : 180 * 1024; // bytes
// //       const url = await upload(croppedFile, { minSize: 0, maxSize, hdMode });

// //       // notify parent
// //       await onUploadComplete(url);

// //       // cleanup and let parent/hook move the queue forward
// //       setSrc(null);
// //       setCurrentFile(null);

// //     } catch (err) {
// //       toast({
// //         variant: "destructive",
// //         title: "Upload failed",
// //         description: err?.message || "Something went wrong during upload",
// //       });
// //     } finally {
// //       setUploading(false);
// //     }
// //   }, [currentFile, onUploadComplete, hdMode]);

// //   const handleSkip = () => {
// //     if (onSkipCurrent) onSkipCurrent();
// //     setSrc(null);
// //     setCurrentFile(null);
// //   };

// //   useEffect(() => {
// //     if (!isOpen) return;

// //     const handleKeyDown = (e) => {
// //       if (uploading) return;
// //       if (e.key === 'Enter') {
// //         e.preventDefault();
// //         handleCropComplete();
// //       }
// //       if (e.key === 'Escape') {
// //         e.preventDefault();
// //         onClose();
// //       }
// //     };

// //     window.addEventListener('keydown', handleKeyDown);
// //     return () => window.removeEventListener('keydown', handleKeyDown);
// //   }, [isOpen, uploading, handleCropComplete, onClose]);

// //   // If queue becomes empty while modal open, and we're not uploading, close immediately
// //   useEffect(() => {
// //     if (!isOpen) return;
// //     if ((!queue || queue.length === 0) && !uploading) {
// //       onClose();
// //     }
// //   }, [queue, isOpen, uploading, onClose]);

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-2xl"
// //       role="dialog"
// //       aria-modal="true"
// //     >
// //       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col relative">
// //         {uploading && (
// //           <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
// //             <div className="flex flex-col items-center text-white">
// //               <svg
// //                 className="animate-spin h-8 w-8 mb-2"
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                 <path
// //                   className="opacity-75"
// //                   fill="currentColor"
// //                   d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
// //                 ></path>
// //               </svg>
// //               Uploading...
// //             </div>
// //           </div>
// //         )}

// //         {src && currentFile ? (
// //           <>
// //             <div className="overflow-auto flex-grow min-h-0 mb-4">
// //               <ReactCrop
// //                 crop={crop}
// //                 onChange={handleCropChange}
// //                 keepSelection
// //                 disabled={uploading}
// //               >
// //                 <img
// //                   ref={imageRef}
// //                   src={src}
// //                   alt="Crop preview"
// //                   style={{
// //                     display: 'block',
// //                     maxWidth: '100%',
// //                     maxHeight: '65vh',
// //                     margin: '0 auto'
// //                   }}
// //                 />
// //               </ReactCrop>
// //             </div>

// //             <canvas ref={canvasRef} style={{ display: 'none' }} />

// //             <div className="flex justify-between items-center gap-2 mt-4 flex-shrink-0">
// //               <div className="flex items-center gap-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setHdMode(prev => !prev)}
// //                   disabled={uploading}
// //                   className={`px-3 py-1 rounded-md border border-slate-200 ${hdMode ? 'bg-[#1c5868] text-white' : 'bg-white text-gray-700'} transition-colors`}
// //                 >
// //                   HD
// //                 </button>
// //               </div>

// //               <div className="flex items-center gap-2">
// //                 <Button onClick={onClose} disabled={uploading}
// //                   className="hover:bg-[#5c3e3e] bg-[#411218] text-lamaWhite">
// //                   Cancel
// //                 </Button>
// //                 {queue.length > 1 && (
// //                   <Button onClick={handleSkip} disabled={uploading}
// //                     variant="outline"
// //                     className="text-red-800 border-red-900 hover:bg-red-50">
// //                     Skip
// //                   </Button>
// //                 )}
// //                 <Button
// //                   onClick={handleCropComplete}
// //                   disabled={uploading}
// //                   className="hover:bg-[#95ab25] bg-[#1c5868] text-lamaWhite"
// //                 >
// //                   {uploading ? 'Uploading...' : 'Crop & Upload'}
// //                 </Button>
// //               </div>
// //             </div>
// //           </>
// //         ) : (
// //           <div className="text-center p-8">
// //             <p>{uploading ? 'Uploading...' : 'Preparing image...'}</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ImageCropModal;


// // src/components/ui/ImageCropper.jsx
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from "../ui/Button";
// import upload from '../../lib/upload';
// import { toast } from '../../redux/useToast';

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
//   const [hdMode, setHdMode] = useState(false);

//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);
//   const percentCropRef = useRef(null);
//   const objectUrlRef = useRef(null);

//   useEffect(() => {
//     if (!isOpen) {
//       setSrc(null);
//       setCurrentFile(null);
//       setCrop(DEFAULT_CROP);
//       percentCropRef.current = null;
//       setHdMode(false);
//       if (objectUrlRef.current) {
//         try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
//         objectUrlRef.current = null;
//       }
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;
//     if (!queue || queue.length === 0) {
//       if (!uploading) {
//         // no files and not uploading -> close
//         onClose();
//       }
//       return;
//     }

//     const nextFile = queue[0];
//     if (!nextFile) return;

//     // revoke previous URL
//     if (objectUrlRef.current) {
//       try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
//       objectUrlRef.current = null;
//     }

//     const objectUrl = URL.createObjectURL(nextFile);
//     objectUrlRef.current = objectUrl;
//     setSrc(objectUrl);
//     setCurrentFile(nextFile);
//     setCrop(DEFAULT_CROP);
//     percentCropRef.current = null;

//     return () => {
//       if (objectUrlRef.current) {
//         try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
//         objectUrlRef.current = null;
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOpen, queue]);

//   const handleCropChange = (c, percentC) => {
//     setCrop(c);
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

//   const drawAndMaybeResize = (img, pixelCrop, downscaleIf) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;

//     let targetW = pixelCrop.width;
//     let targetH = pixelCrop.height;

//     if (!hdMode && downscaleIf && (targetW > downscaleIf || targetH > downscaleIf)) {
//       const ratio = Math.min(downscaleIf / targetW, downscaleIf / targetH);
//       targetW = Math.max(1, Math.floor(targetW * ratio));
//       targetH = Math.max(1, Math.floor(targetH * ratio));
//     }

//     canvas.width = targetW;
//     canvas.height = targetH;
//     const ctx = canvas.getContext('2d');

//     ctx.drawImage(
//       img,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       targetW,
//       targetH
//     );

//     return canvas;
//   };

//   const handleCropComplete = useCallback(async () => {
//     const img = imageRef.current;
//     const canvas = canvasRef.current;
//     if (!img || !canvas || !currentFile) return;

//     const pixelCrop = getPixelCrop();
//     if (!pixelCrop) {
//       toast({
//         variant: 'destructive',
//         title: 'Operation failed!',
//         description: 'No valid crop to upload'
//       });
//       return;
//     }

//     try {
//       setUploading(true);

//       // speed-oriented downscale for non-HD
//       const downscaleLimit = hdMode ? 2500 : 1200;
//       const usedCanvas = drawAndMaybeResize(img, pixelCrop, downscaleLimit);

//       if (!usedCanvas) throw new Error('Canvas error');

//       const mime = hdMode ? 'image/jpeg' : 'image/webp';
//       const quality = hdMode ? 0.92 : 0.88;

//       const blob = await new Promise((resolve) => {
//         usedCanvas.toBlob((b) => resolve(b), mime, quality);
//       });

//       if (!blob) throw new Error('Failed to produce image blob');

//       const ext = mime === 'image/webp' ? '.webp' : '.jpg';
//       const croppedFile = new File([blob], currentFile.name.replace(/\.[^/.]+$/, ext), {
//         type: mime,
//         lastModified: Date.now(),
//       });

//       const maxSize = hdMode ? 400 * 1024 : 180 * 1024;
//       const url = await upload(croppedFile, { minSize: 0, maxSize, hdMode });

//       // notify parent hook that upload completed (parent will slice queue)
//       await onUploadComplete(url);

//       // cleanup local state
//       setSrc(null);
//       setCurrentFile(null);

//       // wait a short tick to let parent update queue state, then close if there's no next file
//       setTimeout(() => {
//         try {
//           const qLen = Array.isArray(queue) ? queue.length : 0;
//           // queue still includes current file at the moment of this function call.
//           // If it had only 1 item (the one just uploaded) -> after parent slices, queue becomes 0 -> close modal.
//           // To be safe, require qLen <= 1 to close.
//           if (!queue || qLen <= 1) {
//             onClose();
//           }
//         } catch (e) {
//           // ignore
//         }
//       }, 40);

//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Upload failed",
//         description: err?.message || "Something went wrong during upload",
//       });
//     } finally {
//       setUploading(false);
//     }
//   }, [currentFile, onUploadComplete, hdMode, queue, onClose]);

//   const handleSkip = () => {
//     if (onSkipCurrent) onSkipCurrent();
//     setSrc(null);
//     setCurrentFile(null);

//     // give parent a moment to update the queue, then close if none remain
//     setTimeout(() => {
//       try {
//         const qLen = Array.isArray(queue) ? queue.length : 0;
//         if (!queue || qLen <= 1) {
//           onClose();
//         }
//       } catch (e) {
//         // ignore
//       }
//     }, 40);
//   };

//   useEffect(() => {
//     if (!isOpen) return;

//     const handleKeyDown = (e) => {
//       if (uploading) return;
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         handleCropComplete();
//       }
//       if (e.key === 'Escape') {
//         e.preventDefault();
//         onClose();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [isOpen, uploading, handleCropComplete, onClose]);

//   // safety: if parent clears queue while modal open and nothing is uploading, close
//   useEffect(() => {
//     if (!isOpen) return;
//     if ((!queue || queue.length === 0) && !uploading) {
//       onClose();
//     }
//   }, [queue, isOpen, uploading, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-2xl"
//       role="dialog"
//       aria-modal="true"
//     >
//       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col relative">
//         {uploading && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
//             <div className="flex flex-col items-center text-white">
//               <svg
//                 className="animate-spin h-8 w-8 mb-2"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
//                 ></path>
//               </svg>
//               Uploading...
//             </div>
//           </div>
//         )}

//         {src && currentFile ? (
//           <>
//             <div className="overflow-auto flex-grow min-h-0 mb-4">
//               <ReactCrop
//                 crop={crop}
//                 onChange={handleCropChange}
//                 keepSelection
//                 disabled={uploading}
//               >
//                 <img
//                   ref={imageRef}
//                   src={src}
//                   alt="Crop preview"
//                   style={{
//                     display: 'block',
//                     maxWidth: '100%',
//                     maxHeight: '65vh',
//                     margin: '0 auto'
//                   }}
//                 />
//               </ReactCrop>
//             </div>

//             <canvas ref={canvasRef} style={{ display: 'none' }} />

//             <div className="flex justify-between items-center gap-2 mt-4 flex-shrink-0">
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setHdMode(prev => !prev)}
//                   disabled={uploading}
//                   className={`px-3 py-1 rounded-md border border-slate-200 ${hdMode ? 'bg-[#1c5868] text-white' : 'bg-white text-gray-700'} transition-colors`}
//                 >
//                   HD
//                 </button>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button onClick={onClose} disabled={uploading}
//                   className="hover:bg-[#5c3e3e] bg-[#411218] text-lamaWhite">
//                   Cancel
//                 </Button>
//                 {queue.length > 1 && (
//                   <Button onClick={handleSkip} disabled={uploading}
//                     variant="outline"
//                     className="text-red-800 border-red-900 hover:bg-red-50">
//                     Skip
//                   </Button>
//                 )}
//                 <Button
//                   onClick={handleCropComplete}
//                   disabled={uploading}
//                   className="hover:bg-[#95ab25] bg-[#1c5868] text-lamaWhite"
//                 >
//                   {uploading ? 'Uploading...' : 'Crop & Upload'}
//                 </Button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="text-center p-8">
//             <p>{uploading ? 'Uploading...' : 'Preparing image...'}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageCropModal;



// src/components/ui/ImageCropper.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "../ui/Button";
import upload from '../../lib/upload';
import { toast } from '../../redux/useToast';

const DEFAULT_CROP = { unit: '%', x: 0, y: 0, width: 50, height: 50, aspect: 1 };

const ImageCropModal = ({
  isOpen,
  onClose,
  onUploadComplete, // called with (url) when upload finished
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
  const objectUrlRef = useRef(null);
  const queueRef = useRef(queue);

  // keep queueRef up to date so timeouts can read the latest queue
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    if (!isOpen) {
      // reset
      setSrc(null);
      setCurrentFile(null);
      setCrop(DEFAULT_CROP);
      percentCropRef.current = null;
      setHdMode(false);
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
        objectUrlRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!queue || queue.length === 0) {
      // no files and not uploading -> close
      if (!uploading) onClose();
      return;
    }

    const nextFile = queue[0];
    if (!nextFile) return;

    // revoke previous URL if any
    if (objectUrlRef.current) {
      try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
      objectUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(nextFile);
    objectUrlRef.current = objectUrl;
    setSrc(objectUrl);
    setCurrentFile(nextFile);
    setCrop(DEFAULT_CROP);
    percentCropRef.current = null;

    return () => {
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
        objectUrlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const drawAndMaybeResize = (img, pixelCrop, downscaleIf) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    let targetW = pixelCrop.width;
    let targetH = pixelCrop.height;

    // downscale large crops when not in HD for speed
    if (!hdMode && downscaleIf && (targetW > downscaleIf || targetH > downscaleIf)) {
      const ratio = Math.min(downscaleIf / targetW, downscaleIf / targetH);
      targetW = Math.max(1, Math.floor(targetW * ratio));
      targetH = Math.max(1, Math.floor(targetH * ratio));
    }

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetW,
      targetH
    );

    return canvas;
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

    try {
      setUploading(true);

      // downscale non-HD to improve toBlob speed
      const downscaleLimit = hdMode ? 2500 : 1200;
      const usedCanvas = drawAndMaybeResize(img, pixelCrop, downscaleLimit);

      if (!usedCanvas) throw new Error('Canvas error');

      const mime = hdMode ? 'image/jpeg' : 'image/webp';
      const quality = hdMode ? 0.92 : 0.88;

      const blob = await new Promise((resolve) => {
        usedCanvas.toBlob((b) => resolve(b), mime, quality);
      });

      if (!blob) throw new Error('Failed to produce image blob');

      const ext = mime === 'image/webp' ? '.webp' : '.jpg';
      const croppedFile = new File([blob], currentFile.name.replace(/\.[^/.]+$/, ext), {
        type: mime,
        lastModified: Date.now(),
      });

      const maxSize = hdMode ? 400 * 1024 : 180 * 1024;
      const url = await upload(croppedFile, { minSize: 0, maxSize, hdMode });

      // notify parent. Parent's handler should advance the queue (hook).
      await onUploadComplete(url);

      // local cleanup
      setSrc(null);
      setCurrentFile(null);

      // give parent a moment to update queue state; then decide whether to close (read latest from queueRef)
      setTimeout(() => {
        try {
          const qLen = Array.isArray(queueRef.current) ? queueRef.current.length : 0;
          // if after parent's update there are no more items, close.
          if (!queueRef.current || qLen === 0) {
            onClose();
          }
        } catch (e) {
          // ignore
        }
      }, 100);

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err?.message || "Something went wrong during upload",
      });
    } finally {
      setUploading(false);
    }
  }, [currentFile, onUploadComplete, hdMode, onClose]);

  const handleSkip = () => {
    if (onSkipCurrent) onSkipCurrent();
    setSrc(null);
    setCurrentFile(null);

    // give parent a moment to update the queue, then close if none remain
    setTimeout(() => {
      try {
        const qLen = Array.isArray(queueRef.current) ? queueRef.current.length : 0;
        if (!queueRef.current || qLen === 0) {
          onClose();
        }
      } catch (e) {
        // ignore
      }
    }, 100);
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

  // safety: if parent clears queue while modal open and nothing is uploading, close
  useEffect(() => {
    if (!isOpen) return;
    if ((!queue || queue.length === 0) && !uploading) {
      onClose();
    }
  }, [queue, isOpen, uploading, onClose]);

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
                  className={`px-3 py-1 rounded-md border shadow-sm cursor-pointer border-slate-300 ${hdMode ? 'bg-[#1c5868] text-white' : 'bg-white text-gray-700'} transition-colors`}
                >
                  HD
                </button>
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
            <p>{uploading ? 'Uploading...' : 'Preparing image...'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropModal;
