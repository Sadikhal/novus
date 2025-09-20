// import  { useState, useRef, useEffect, useCallback } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from './ui/Button';
// import upload from '../lib/upload';
// import { toast } from '../redux/useToast';

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

//   // Load next file when queue changes
//   useEffect(() => {
//     if (!isOpen || !queue || queue.length === 0) {
//       return;
//     }

//     const nextFile = queue[0];
//     const objectUrl = URL.createObjectURL(nextFile);

//     setSrc(objectUrl);
//     setCurrentFile(nextFile);
//     setCrop(DEFAULT_CROP);
//     cropRef.current = DEFAULT_CROP;
//     percentCropRef.current = null;

//     return () => {
//       URL.revokeObjectURL(objectUrl);
//     };
//   }, [isOpen, queue]);

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
//         setSrc(null);
//         setCurrentFile(null);
//       } catch (err) {
//         toast({
//           variant: "destructive",
//           title: "Upload failed",
//           description: err.message || "Something went wrong during upload",
//         });
//       } finally {
//         setUploading(false);
//       }
//     }, 'image/jpeg', 0.95);
//   }, [currentFile, onUploadComplete]);

//   const handleSkip = () => {
//     if (onSkipCurrent) onSkipCurrent();
//     setSrc(null);
//     setCurrentFile(null);
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

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-2xl"
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
//                 onComplete={(c, percentC) => {
//                   cropRef.current = c;
//                   percentCropRef.current = percentC;
//                 }}
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

//             <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
//               <Button
//                 type="button"
//                 onClick={onClose}
//                 disabled={uploading}
//                 className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins"
//               >
//                 Cancel
//               </Button>
//               {queue.length > 1 && (
//                 <Button
//                   type="button"
//                   onClick={handleSkip}
//                   disabled={uploading}
//                   variant="outline"
//                   className="text-red-800 border-red-900 hover:bg-red-50"
//                 >
//                   Skip
//                 </Button>
//               )}
//               <Button
//                 type="button"
//                 onClick={handleCropComplete}
//                 disabled={uploading}
//                 className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite"
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

////////////////////////////


// import { useState, useRef, useEffect, useCallback } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from './ui/Button';
// import upload from '../lib/upload';
// import { toast } from '../redux/useToast';

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

//   useEffect(() => {
//     if (!isOpen) {
//       setSrc(null);
//       setCurrentFile(null);
//       setCrop(DEFAULT_CROP);
//       cropRef.current = DEFAULT_CROP;
//       percentCropRef.current = null;
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen || !queue || queue.length === 0) return;
//     const nextFile = queue[0];
//     const objectUrl = URL.createObjectURL(nextFile);
//     setSrc(objectUrl);
//     setCurrentFile(nextFile);
//     setCrop(DEFAULT_CROP);
//     cropRef.current = DEFAULT_CROP;
//     percentCropRef.current = null;
//     return () => URL.revokeObjectURL(objectUrl);
//   }, [isOpen, queue]);

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

//   const handleCropComplete = useCallback(async () => {
//     const img = imageRef.current;
//     const canvas = canvasRef.current;
//     if (!img || !canvas || !currentFile) return;

//     const pixelCrop = getPixelCrop();
//     if (!pixelCrop) {
//       toast({ variant: 'destructive', title: 'Operation failed!', description: 'No valid crop to upload' });
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

//     // Export as webp to save bytes (good balance between quality and size)
//     canvas.toBlob(async (blob) => {
//       if (!blob) return;
//       try {
//         setUploading(true);
//         // give webp extension and correct MIME type
//         const newName = currentFile.name.replace(/\.[^/.]+$/, '') + '.webp';
//         const croppedFile = new File([blob], newName, {
//           type: 'image/webp',
//           lastModified: Date.now(),
//         });

//         const url = await upload(croppedFile);
//         await onUploadComplete(url);
//         setSrc(null);
//         setCurrentFile(null);
//       } catch (err) {
//         toast({ variant: 'destructive', title: 'Upload failed', description: err.message || 'Something went wrong during upload' });
//       } finally {
//         setUploading(false);
//       }
//     }, 'image/webp', 0.85);
//   }, [currentFile, onUploadComplete]);

//   const handleSkip = () => {
//     if (onSkipCurrent) onSkipCurrent();
//     setSrc(null);
//     setCurrentFile(null);
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

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-2xl" role="dialog" aria-modal="true">
//       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col relative">
//         {uploading && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
//             <div className="flex flex-col items-center text-white">
//               <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"></path>
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
//                 onComplete={(c, percentC) => {
//                   cropRef.current = c;
//                   percentCropRef.current = percentC;
//                 }}
//                 keepSelection
//                 disabled={uploading}
//               >
//                 <img
//                   ref={imageRef}
//                   src={src}
//                   alt="Crop preview"
//                   style={{ display: 'block', maxWidth: '100%', maxHeight: '65vh', margin: '0 auto' }}
//                 />
//               </ReactCrop>
//             </div>

//             <canvas ref={canvasRef} style={{ display: 'none' }} />

//             <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
//               <Button type="button" onClick={onClose} disabled={uploading} className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins">
//                 Cancel
//               </Button>
//               {queue.length > 1 && (
//                 <Button type="button" onClick={handleSkip} disabled={uploading} variant="outline" className="text-red-800 border-red-900 hover:bg-red-50">
//                   Skip
//                 </Button>
//               )}
//               <Button type="button" onClick={handleCropComplete} disabled={uploading} className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite">
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





// import { useState, useRef, useEffect, useCallback } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from './ui/Button';
// import upload from '../lib/upload';
// import { toast } from '../redux/useToast';

// const DEFAULT_CROP = { unit: '%', x: 0, y: 0, width: 50, height: 50, aspect: 1 };

// const ImageCropModal = ({
//   isOpen,
//   onClose,
//   onUploadComplete, // now expected to accept (url, role)
//   queue = [], // queue now contains items { file, inferredRole }
//   onSkipCurrent
// }) => {
//   const [src, setSrc] = useState(null);
//   const [crop, setCrop] = useState(DEFAULT_CROP);
//   const [currentFile, setCurrentFile] = useState(null);
//   const [currentRole, setCurrentRole] = useState('gallery');
//   const [uploading, setUploading] = useState(false);

//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);
//   const cropRef = useRef(DEFAULT_CROP);
//   const percentCropRef = useRef(null);

//   useEffect(() => {
//     if (!isOpen) {
//       setSrc(null);
//       setCurrentFile(null);
//       setCrop(DEFAULT_CROP);
//       cropRef.current = DEFAULT_CROP;
//       percentCropRef.current = null;
//       setCurrentRole('gallery');
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen || !queue || queue.length === 0) return;
//     // queue item is { file, inferredRole }
//     const next = queue[0];
//     const file = next?.file || next; // support fallback if queue still has File
//     const inferred = next?.inferredRole || 'gallery';
//     const objectUrl = URL.createObjectURL(file);
//     setSrc(objectUrl);
//     setCurrentFile(file);
//     setCrop(DEFAULT_CROP);
//     cropRef.current = DEFAULT_CROP;
//     percentCropRef.current = null;
//     setCurrentRole(inferred);
//     return () => URL.revokeObjectURL(objectUrl);
//   }, [isOpen, queue]);

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

//   const handleCropComplete = useCallback(async () => {
//     const img = imageRef.current;
//     const canvas = canvasRef.current;
//     if (!img || !canvas || !currentFile) return;

//     const pixelCrop = getPixelCrop();
//     if (!pixelCrop) {
//       toast({ variant: 'destructive', title: 'Operation failed!', description: 'No valid crop to upload' });
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

//     // Export as webp to save bytes (good balance between quality and size)
//     canvas.toBlob(async (blob) => {
//       if (!blob) return;
//       try {
//         setUploading(true);
//         // give webp extension and correct MIME type
//         const newName = currentFile.name.replace(/\.[^/.]+$/, '') + '.webp';
//         const croppedFile = new File([blob], newName, {
//           type: 'image/webp',
//           lastModified: Date.now(),
//         });

//         const url = await upload(croppedFile);
//         // pass role forward to consumer
//         await onUploadComplete(url, currentRole || 'gallery');
//         setSrc(null);
//         setCurrentFile(null);
//       } catch (err) {
//         toast({ variant: 'destructive', title: 'Upload failed', description: err.message || 'Something went wrong during upload' });
//       } finally {
//         setUploading(false);
//       }
//     }, 'image/webp', 0.85);
//   }, [currentFile, currentRole, onUploadComplete]);

//   const handleSkip = () => {
//     if (onSkipCurrent) onSkipCurrent();
//     setSrc(null);
//     setCurrentFile(null);
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

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-2xl" role="dialog" aria-modal="true">
//       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col relative">
//         {uploading && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
//             <div className="flex flex-col items-center text-white">
//               <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"></path>
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
//                 onComplete={(c, percentC) => {
//                   cropRef.current = c;
//                   percentCropRef.current = percentC;
//                 }}
//                 keepSelection
//                 disabled={uploading}
//               >
//                 <img
//                   ref={imageRef}
//                   src={src}
//                   alt="Crop preview"
//                   style={{ display: 'block', maxWidth: '100%', maxHeight: '65vh', margin: '0 auto' }}
//                 />
//               </ReactCrop>
//             </div>

//             <canvas ref={canvasRef} style={{ display: 'none' }} />

//             <div className="flex justify-between items-center gap-2 mt-4 flex-shrink-0">
//               {/* show inferred role so user knows what will be assigned */}
//               <div className="text-sm text-slate-600">Inferred: <strong>{currentRole}</strong></div>

//               <div className="flex justify-end gap-2">
//                 <Button type="button" onClick={onClose} disabled={uploading} className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins">
//                   Cancel
//                 </Button>
//                 {queue.length > 1 && (
//                   <Button type="button" onClick={handleSkip} disabled={uploading} variant="outline" className="text-red-800 border-red-900 hover:bg-red-50">
//                     Skip
//                   </Button>
//                 )}
//                 <Button type="button" onClick={handleCropComplete} disabled={uploading} className="hover:bg-[#95ab25] bg-[#1c5868] border-none font-poppins text-lamaWhite">
//                   {uploading ? 'Uploading...' : 'Crop & Upload'}
//                 </Button>
//               </div>
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





// import { useState, useRef, useEffect, useCallback } from 'react';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { Button } from './ui/Button';
// import upload from '../lib/upload';
// import { toast } from '../redux/useToast';

// const DEFAULT_CROP = { unit: '%', x: 0, y: 0, width: 50, height: 50, aspect: 1 };

// // Compression tuning
// const TARGET_KB = 300;
// const MIN_QUALITY = 0.4;
// const MAX_QUALITY = 0.95;

// // Convert canvas to blob
// const canvasToBlob = (canvas, mime = 'image/webp', quality = 0.9) =>
//   new Promise((resolve) => {
//     canvas.toBlob((blob) => resolve(blob), mime, quality);
//   });

// // Faster compression with binary search
// const compressCanvasToTarget = async (canvas, maxBytes) => {
//   let low = MIN_QUALITY;
//   let high = MAX_QUALITY;
//   let blob = await canvasToBlob(canvas, 'image/webp', high);

//   if (blob.size <= maxBytes) return blob;

//   // Binary search
//   for (let i = 0; i < 6; i++) {
//     const mid = (low + high) / 2;
//     blob = await canvasToBlob(canvas, 'image/webp', mid);
//     if (blob.size > maxBytes) {
//       high = mid;
//     } else {
//       low = mid;
//     }
//   }

//   // If still too big, resize once
//   if (blob.size > maxBytes) {
//     const scaledCanvas = document.createElement('canvas');
//     scaledCanvas.width = Math.floor(canvas.width * 0.8);
//     scaledCanvas.height = Math.floor(canvas.height * 0.8);
//     scaledCanvas.getContext('2d').drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
//     blob = await canvasToBlob(scaledCanvas, 'image/webp', 0.8);
//   }

//   return blob;
// };

// const ImageCropModal = ({
//   isOpen,
//   onClose,
//   onUploadComplete,
//   queue = [],
//   onSkipCurrent,
// }) => {
//   const [src, setSrc] = useState(null);
//   const [crop, setCrop] = useState(DEFAULT_CROP);
//   const [currentFile, setCurrentFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);
//   const cropRef = useRef(DEFAULT_CROP);
//   const percentCropRef = useRef(null);

//   useEffect(() => {
//     if (!isOpen) {
//       setSrc(null);
//       setCurrentFile(null);
//       setCrop(DEFAULT_CROP);
//       cropRef.current = DEFAULT_CROP;
//       percentCropRef.current = null;
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen || !queue || queue.length === 0) return;
//     const next = queue[0];
//     const file = next?.file || next;
//     try {
//       const objectUrl = URL.createObjectURL(file);
//       setSrc(objectUrl);
//       setCurrentFile(file);
//       setCrop(DEFAULT_CROP);
//       cropRef.current = DEFAULT_CROP;
//       percentCropRef.current = null;
//       return () => URL.revokeObjectURL(objectUrl);
//     } catch (err) {
//       toast({ variant: 'destructive', title: 'File error', description: 'Could not process selected file.' });
//     }
//   }, [isOpen, queue]);

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

//   const handleCropComplete = useCallback(async () => {
//     const img = imageRef.current;
//     const canvas = canvasRef.current;
//     if (!img || !canvas || !currentFile) return;

//     const pixelCrop = getPixelCrop();
//     if (!pixelCrop) {
//       toast({ variant: 'destructive', title: 'Operation failed!', description: 'No valid crop to upload' });
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

//     setUploading(true);
//     try {
//       const targetBytes = TARGET_KB * 1024;
//       const compressedBlob = await compressCanvasToTarget(canvas, targetBytes);

//       const newName = (currentFile.name || 'image').replace(/\.[^/.]+$/, '') + '.webp';
//       const compressedFile = new File([compressedBlob], newName, { type: 'image/webp', lastModified: Date.now() });

//       console.log('Uploading file:', { name: compressedFile.name, sizeKB: (compressedFile.size / 1024).toFixed(1) });

//       const url = await upload(compressedFile);
//       await onUploadComplete(url);

//       setSrc(null);
//       setCurrentFile(null);
//     } catch (err) {
//       toast({ variant: 'destructive', title: 'Upload failed', description: err?.message || 'Unknown error' });
//     } finally {
//       setUploading(false);
//     }
//   }, [currentFile, onUploadComplete]);

//   const handleSkip = () => {
//     if (onSkipCurrent) onSkipCurrent();
//     setSrc(null);
//     setCurrentFile(null);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
//       <div className="bg-white max-h-[90vh] p-4 rounded-lg max-w-md w-full flex flex-col relative">
//         {src && currentFile ? (
//           <>
//             <div className="overflow-auto flex-grow min-h-0 mb-4">
//               <ReactCrop
//                 crop={crop}
//                 onChange={(c, percentC) => {
//                   setCrop(c);
//                   cropRef.current = c;
//                   percentCropRef.current = percentC;
//                 }}
//                 keepSelection
//                 disabled={uploading}
//               >
//                 <img ref={imageRef} src={src} alt="Crop preview" style={{ display: 'block', maxWidth: '100%', maxHeight: '65vh', margin: '0 auto' }} />
//               </ReactCrop>
//             </div>

//             <canvas ref={canvasRef} style={{ display: 'none' }} />

//             <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
//               <Button type="button" onClick={onClose} disabled={uploading}>Cancel</Button>
//               {queue.length > 1 && (
//                 <Button type="button" onClick={handleSkip} disabled={uploading} variant="outline">Skip</Button>
//               )}
//               <Button type="button" onClick={handleCropComplete} disabled={uploading}>
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
// src/components/ImageCropModal.jsx
// ImageCropModal.js
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

  // Load next file when queue changes
  useEffect(() => {
    if (!isOpen || !queue || queue.length === 0) {
      return;
    }

    const nextFile = queue[0];
    const objectUrl = URL.createObjectURL(nextFile);

    setSrc(objectUrl);
    setCurrentFile(nextFile);
    setCrop(DEFAULT_CROP);
    cropRef.current = DEFAULT_CROP;
    percentCropRef.current = null;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, queue]);

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
      
      // Convert canvas to blob (WebP format)
      const blob = await new Promise(resolve => {
        canvas.toBlob(
          resolve,
          'image/webp',
          0.8 // Quality setting
        );
      });
      
      if (!blob) return;
      
      // Create file from blob
      const croppedFile = new File([blob], currentFile.name.replace(/\.[^/.]+$/, ".webp"), {
        type: 'image/webp',
        lastModified: Date.now(),
      });

      const url = await upload(croppedFile);
      await onUploadComplete(url);
      setSrc(null);
      setCurrentFile(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err.message || "Something went wrong during upload",
      });
    } finally {
      setUploading(false);
    }
  }, [currentFile, onUploadComplete]);

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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-2xl"
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
                onComplete={(c, percentC) => {
                  cropRef.current = c;
                  percentCropRef.current = percentC;
                }}
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

            <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
              <Button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="hover:bg-[#5c3e3e] bg-[#411218] border-none text-lamaWhite font-poppins"
              >
                Cancel
              </Button>
              {queue.length > 1 && (
                <Button
                  type="button"
                  onClick={handleSkip}
                  disabled={uploading}
                  variant="outline"
                  className="text-red-800 border-red-900 hover:bg-red-50"
                >
                  Skip
                </Button>
              )}
              <Button
                type="button"
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