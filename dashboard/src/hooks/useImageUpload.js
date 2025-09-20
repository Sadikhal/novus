
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

//   const handleImageUploadComplete = useCallback(
//     (url) => {
//       setUploadedImages((prev) => {
//         const newImages = isProfile ? [url] : [...prev, url];
//         if (onImagesChange) onImagesChange(newImages);
//         return newImages;
//       });
//       setUploadQueue((prev) => prev.slice(1));
//     },
//     [onImagesChange, isProfile]
//   );

//   const handleFileSelect = useCallback(
//     (e, uploadFor = 'default') => {
//       const files = Array.from(e.target.files || []);
//       if (!files.length) return;

//       try {
//         e.target.value = null;
//       } catch (err) {
//         // Ignore
//       }

//       uploadForRef.current = uploadFor;

//       if (isProfile && maxImages === 1) {
//         setUploadedImages([]);
//         setUploadQueue(files.slice(0, 1));
//         setShowCropModal(true);
//       } else {
//         const remainingSlots = maxImages - uploadedImages.length;
//         if (files.length > remainingSlots) {
//           toast({
//             variant: 'destructive',
//             title: 'Too many images',
//             description: `You can only upload ${remainingSlots} more images.`,
//           });
//           return;
//         }
//         setUploadQueue(files);
//         setShowCropModal(true);
//       }
//     },
//     [maxImages, uploadedImages.length, toast, isProfile]
//   );

//   const handleRemoveImage = useCallback(
//     (index) => {
//       setUploadedImages((prev) => {
//         const newImages = prev.filter((_, i) => i !== index);
//         if (onImagesChange) onImagesChange(newImages);
//         return newImages;
//       });
//     },
//     [onImagesChange]
//   );

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
