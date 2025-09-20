
// import { useState, useRef, useCallback, useEffect } from 'react';

// export const useImageUpload = (options = {}) => {
//   const {
//     maxImages = 1,
//     initialImages = [],
//     onImagesChange,
//     toast,
//     isProfile = false,
//   } = options;

//   const [uploadQueue, setUploadQueue] = useState([]);
//   const [showCropModal, setShowCropModal] = useState(false);
//   const [uploadedImages, setUploadedImages] = useState(initialImages);
//   const fileInputRef = useRef(null);
//   const uploadForRef = useRef('default');

//   const handleSkipCurrent = useCallback(() => {
//     setUploadQueue(prev => prev.slice(1));
//   }, []);

//   const handleImageUploadComplete = useCallback((url) => {
//     setUploadedImages(prev => {
//       const newImages = isProfile ? [url] : [...prev, url];
//       if (onImagesChange) onImagesChange(newImages);
//       return newImages;
//     });
//     setUploadQueue(prev => prev.slice(1));
//   }, [onImagesChange, isProfile]);

//   const handleFileSelect = useCallback((e, uploadFor = 'default') => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     try {
//       e.target.value = null;
//     } catch (err) {
//       // Ignore
//     }

//     uploadForRef.current = uploadFor;

//     if (isProfile && maxImages === 1) {
//       // For profile, replace the existing image
//       setUploadedImages([]);
//       setUploadQueue(files.slice(0, 1)); // Only take the first file
//       setShowCropModal(true);
//     } else {
//       const remainingSlots = maxImages - uploadedImages.length;
//       if (files.length > remainingSlots) {
//         toast({
//           variant: 'destructive',
//           title: 'Too many images',
//           description: `You can only upload ${remainingSlots} more images.`,
//         });
//         return;
//       }
//       setUploadQueue(files);
//       setShowCropModal(true);
//     }
//   }, [maxImages, uploadedImages.length, toast, isProfile]);

//   const handleRemoveImage = useCallback((index) => {
//     setUploadedImages(prev => {
//       const newImages = prev.filter((_, i) => i !== index);
//       if (onImagesChange) onImagesChange(newImages);
//       return newImages;
//     });
//   }, [onImagesChange]);

//   useEffect(() => {
//     if (showCropModal && uploadQueue.length === 0) {
//       setShowCropModal(false);
//     }
//   }, [showCropModal, uploadQueue.length]);

//   return {
//     uploadedImages,
//     uploadQueue,
//     setUploadQueue,
//     currentFile: uploadQueue[0],
//     showCropModal,
//     fileInputRef,
//     uploadForRef,
//     handleFileSelect,
//     handleRemoveImage,
//     handleSkipCurrent,
//     handleImageUploadComplete,
//     setShowCropModal,
//     setUploadedImages,
//   };
// };

/////////////////////////


// import { useState, useRef, useCallback, useEffect } from 'react';

// export const useImageUpload = (options = {}) => {
//   const {
//     maxImages = 1,
//     initialImages = [],
//     onImagesChange,
//     toast,
//     isProfile = false,
//   } = options;

//   const [uploadQueue, setUploadQueue] = useState([]);
//   const [showCropModal, setShowCropModal] = useState(false);
//   const [uploadedImages, setUploadedImages] = useState(initialImages);
//   const fileInputRef = useRef(null);
//   const uploadForRef = useRef('default');

//   const handleSkipCurrent = useCallback(() => {
//     setUploadQueue((prev) => prev.slice(1));
//   }, []);

//   const handleImageUploadComplete = useCallback((url) => {
//     setUploadedImages((prev) => {
//       const newImages = isProfile ? [url] : [...prev, url];
//       if (onImagesChange) onImagesChange(newImages);
//       return newImages;
//     });
//     setUploadQueue((prev) => prev.slice(1));
//   }, [onImagesChange, isProfile]);

//   const handleFileSelect = useCallback((e, uploadFor = 'default') => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     e.target.value = null;

//     uploadForRef.current = uploadFor;

//     if (isProfile && maxImages === 1) {
//       setUploadedImages([]);
//       setUploadQueue(files.slice(0, 1));
//       setShowCropModal(true);
//     } else {
//       const remainingSlots = maxImages - uploadedImages.length;
//       if (files.length > remainingSlots) {
//         toast?.({ variant: 'destructive', title: 'Too many images', description: `You can only upload ${remainingSlots} more images.` });
//         return;
//       }
//       setUploadQueue(files);
//       setShowCropModal(true);
//     }
//   }, [maxImages, uploadedImages.length, toast, isProfile]);

//   const handleRemoveImage = useCallback((index) => {
//     setUploadedImages((prev) => {
//       const newImages = prev.filter((_, i) => i !== index);
//       onImagesChange?.(newImages);
//       return newImages;
//     });
//   }, [onImagesChange]);

//   useEffect(() => {
//     if (showCropModal && uploadQueue.length === 0) setShowCropModal(false);
//   }, [showCropModal, uploadQueue.length]);

//   return {
//     uploadedImages,
//     uploadQueue,
//     setUploadQueue,
//     currentFile: uploadQueue[0],
//     showCropModal,
//     fileInputRef,
//     uploadForRef,
//     handleFileSelect,
//     handleRemoveImage,
//     handleSkipCurrent,
//     handleImageUploadComplete,
//     setShowCropModal,
//     setUploadedImages,
//   };
// };



// import { useState, useRef, useCallback, useEffect } from 'react';

// /**
//  * detectRoleFromDimensions(width, height)
//  * returns one of: 'thumb' | 'gallery' | 'hero' | 'zoom'
//  */
// function detectRoleFromDimensions(width, height) {
//   if (!width || !height) return 'gallery';
//   const ar = width / height;
//   if (width >= 2400) return 'zoom';
//   if (width >= 1400 && ar >= 1.6) return 'hero';
//   if (width >= 900) return 'gallery';
//   if (width <= 480) return 'thumb';
//   return 'gallery';
// }

// export const useImageUpload = (options = {}) => {
//   const {
//     maxImages = 1,
//     initialImages = [], // could be string[] or {url, role}[]
//     onImagesChange,
//     toast,
//     isProfile = false,
//   } = options;

//   const [uploadQueue, setUploadQueue] = useState([]); // will hold objects { file, inferredRole }
//   const [showCropModal, setShowCropModal] = useState(false);
//   const [uploadedImages, setUploadedImages] = useState(initialImages);
//   const fileInputRef = useRef(null);
//   const uploadForRef = useRef('default');

//   const handleSkipCurrent = useCallback(() => {
//     setUploadQueue(prev => prev.slice(1));
//   }, []);

//   // onUploadComplete now receives (url, role)
//   const handleImageUploadComplete = useCallback((url, role = 'gallery') => {
//     setUploadedImages(prev => {
//       // support previous shape where prev could be string[]
//       const prevNormalized = (prev || []).map(item => (typeof item === 'string' ? { url: item, role: 'gallery' } : item));
//       const newImages = isProfile ? [{ url, role }] : [...prevNormalized, { url, role }];
//       if (onImagesChange) onImagesChange(newImages);
//       return newImages;
//     });
//     setUploadQueue(prev => prev.slice(1));
//   }, [onImagesChange, isProfile]);

//   const handleFileSelect = useCallback(async (e, uploadFor = 'default') => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     try {
//       e.target.value = null;
//     } catch (err) {
//       // Ignore
//     }

//     uploadForRef.current = uploadFor;

//     // Helper: infer role by loading the image and reading width/height
//     const inferRoleForFile = (file) => new Promise((res) => {
//       const url = URL.createObjectURL(file);
//       const img = new Image();
//       img.onload = () => {
//         const role = detectRoleFromDimensions(img.naturalWidth, img.naturalHeight);
//         URL.revokeObjectURL(url);
//         res(role);
//       };
//       img.onerror = () => {
//         URL.revokeObjectURL(url);
//         res('gallery');
//       };
//       img.src = url;
//     });

//     // Map files to objects { file, inferredRole }
//     const fileEntries = await Promise.all(files.map(async (f) => {
//       const inferredRole = await inferRoleForFile(f);
//       return { file: f, inferredRole };
//     }));

//     if (isProfile && maxImages === 1) {
//       // For profile, replace the existing image
//       setUploadedImages([]);
//       setUploadQueue(fileEntries.slice(0, 1)); // Only take the first file (object)
//       setShowCropModal(true);
//     } else {
//       const remainingSlots = maxImages - (uploadedImages ? uploadedImages.length : 0);
//       if (fileEntries.length > remainingSlots) {
//         toast({
//           variant: 'destructive',
//           title: 'Too many images',
//           description: `You can only upload ${remainingSlots} more images.`,
//         });
//         return;
//       }
//       setUploadQueue(fileEntries);
//       setShowCropModal(true);
//     }
//   }, [maxImages, uploadedImages, toast, isProfile]);

//   const handleRemoveImage = useCallback((index) => {
//     setUploadedImages(prev => {
//       const prevNormalized = (prev || []).map(item => (typeof item === 'string' ? { url: item, role: 'gallery' } : item));
//       const newImages = prevNormalized.filter((_, i) => i !== index);
//       if (onImagesChange) onImagesChange(newImages);
//       return newImages;
//     });
//   }, [onImagesChange]);

//   useEffect(() => {
//     if (showCropModal && uploadQueue.length === 0) setShowCropModal(false);
//   }, [showCropModal, uploadQueue.length]);

//   return {
//     uploadedImages,
//     uploadQueue,
//     setUploadQueue,
//     currentFile: uploadQueue[0], // note: now this is an object { file, inferredRole } or undefined
//     showCropModal,
//     fileInputRef,
//     uploadForRef,
//     handleFileSelect,
//     handleRemoveImage,
//     handleSkipCurrent,
//     handleImageUploadComplete,
//     setShowCropModal,
//     setUploadedImages,
//   };
// };






// useImageUpload.js
import { useState, useRef, useCallback, useEffect } from 'react';

export const useImageUpload = (options = {}) => {
  const {
    maxImages = 1,
    initialImages = [],
    onImagesChange,
    toast,
    isProfile = false,
  } = options;

  const [uploadQueue, setUploadQueue] = useState([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const fileInputRef = useRef(null);
  const uploadForRef = useRef('default');

  const handleSkipCurrent = useCallback(() => {
    setUploadQueue(prev => prev.slice(1));
  }, []);

  const handleImageUploadComplete = useCallback((url) => {
    setUploadedImages(prev => {
      const newImages = isProfile ? [url] : [...prev, url];
      if (onImagesChange) onImagesChange(newImages);
      return newImages;
    });
    setUploadQueue(prev => prev.slice(1));
  }, [onImagesChange, isProfile]);

  const handleFileSelect = useCallback((e, uploadFor = 'default') => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      e.target.value = null;
    } catch (err) {
      // Ignore
    }

    uploadForRef.current = uploadFor;

    if (isProfile && maxImages === 1) {
      // For profile, replace the existing image
      setUploadedImages([]);
      setUploadQueue(files.slice(0, 1)); // Only take the first file
      setShowCropModal(true);
    } else {
      const remainingSlots = maxImages - uploadedImages.length;
      if (files.length > remainingSlots) {
        toast({
          variant: 'destructive',
          title: 'Too many images',
          description: `You can only upload ${remainingSlots} more images.`,
        });
        return;
      }
      setUploadQueue(files);
      setShowCropModal(true);
    }
  }, [maxImages, uploadedImages.length, toast, isProfile]);

  const handleRemoveImage = useCallback((index) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (onImagesChange) onImagesChange(newImages);
      return newImages;
    });
  }, [onImagesChange]);

  useEffect(() => {
    if (showCropModal && uploadQueue.length === 0) {
      setShowCropModal(false);
    }
  }, [showCropModal, uploadQueue.length]);

  return {
    uploadedImages,
    uploadQueue,
    setUploadQueue,
    currentFile: uploadQueue[0],
    showCropModal,
    fileInputRef,
    uploadForRef,
    handleFileSelect,
    handleRemoveImage,
    handleSkipCurrent,
    handleImageUploadComplete,
    setShowCropModal,
    setUploadedImages,
  };
};
