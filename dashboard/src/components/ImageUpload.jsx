
// import React from 'react';
// import { AiFillEdit } from 'react-icons/ai';

// const ImageUpload = ({
//   uploadedImages = [],
//   onFileSelect,
//   onRemoveImage,
//   fileInputRef,
//   maxImages = 1,
//   label = "Images",
//   previewClassName = "w-32 h-32 object-cover rounded-md",
//   containerClassName = "flex flex-wrap gap-4",
//   uploadFor = 'default',
//   showUploadButton = true,
//   customUploadButton = null,
//   isProfile = false,
// }) => {
//   const internalFileInputRef = React.useRef(null);
//   const actualFileInputRef = fileInputRef || internalFileInputRef;

//   const handleClick = () => {
//     if (actualFileInputRef.current) {
//       actualFileInputRef.current.click();
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       {!isProfile  && (
//       <label className="text-sm font-medium">
//         {label} (Max {maxImages})
//       </label>
//      )} 
//       <input
//         type="file"
//         ref={actualFileInputRef}
//         multiple={maxImages > 1}
//         accept="image/*"
//         onChange={(e) => onFileSelect(e, uploadFor)}
//         className="hidden"
//       />

//       <div className={containerClassName}>
//         {uploadedImages.map((url, index) => (
//           <div key={url} className={isProfile ? "relative group" : "relative group border border-slate-300 p-2 rounded-lg"}>
//             <img
//               src={url}
//               alt={`Preview ${index + 1}`}
//               className={previewClassName}
//               onClick={() => isProfile && showUploadButton && actualFileInputRef.current?.click()}
//             />
//             {isProfile && showUploadButton && (
//               <div 
//                 className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1"
//                 onClick={() => actualFileInputRef.current?.click()}
//               >
//                 <span className="text-white font-poppins text-xs text-nowrap">Change Photo</span>
//                 <AiFillEdit className="h-6 w-4 text-lamaWhite" />
//               </div>
//             )}
//             {!isProfile && (
//               <button
//                 type="button"
//                 onClick={() => onRemoveImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         ))}

//         {showUploadButton && uploadedImages.length < maxImages && (
//           customUploadButton || (
//             <label
//               onClick={handleClick}
//               className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
//             >
//               <img 
//                 src="/images/model.png" 
//                 className="w-9 h-9 object-cover" 
//                 alt="Upload" 
//               />
//             </label>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;

 
////////////////////////


// import React from 'react';
// import { AiFillEdit } from 'react-icons/ai';

// // Helper: detect Cloudinary URLs and build transformed variants (src, srcSet, placeholder)
// function buildCloudinaryVariants(url, variant = 'thumb') {
//   try {
//     if (!url || typeof url !== 'string') return { src: url, srcSet: `${url} 1x`, placeholder: url };
//     const idx = url.indexOf('/upload/');
//     if (idx === -1) return { src: url, srcSet: `${url} 1x`, placeholder: url };

//     // choose widths per image role (thumb, gallery, hero)
//     const widthsMap = {
//       thumb: [360, 2000],
     
//     };
//     const widths = widthsMap[variant] || widthsMap.thumb;

//     const prefix = url.slice(0, idx + '/upload/'.length); // includes `/upload/`
//     const rest = url.slice(idx + '/upload/'.length);

//     // build srcset from widths
//     const srcs = widths.map((w) => `${prefix}w_${w},dpr_auto,f_auto,q_auto/${rest}`);
//     const srcSet = srcs.map((u, i) => `${u} ${widths[i]}w`).join(', ');
//     // fallback choose the middle size
//     const fallback = srcs[Math.floor(srcs.length / 2)] || url;
//     const placeholder = `${prefix}w_40,q_10,f_auto/${rest}`;

//     return { src: fallback, srcSet, placeholder };
//   } catch (err) {
//     return { src: url, srcSet: `${url} 1x`, placeholder: url };
//   }
// }

// const ImageUpload = ({
//   uploadedImages = [],
//   onFileSelect,
//   onRemoveImage,
//   fileInputRef,
//   maxImages = 1,
//   label = 'Images',
//   previewClassName = 'w-32 h-32 object-cover rounded-md',
//   containerClassName = 'flex flex-wrap gap-4',
//   uploadFor = 'default',
//   showUploadButton = true,
//   customUploadButton = null,
//   isProfile = false,
//   // New props
//   variant = 'thumb', // 'thumb' | 'gallery' | 'hero' - controls generated widths
//   sizes = '100vw' // controls the `sizes` attribute for responsive srcset
// }) => {
//   const internalFileInputRef = React.useRef(null);
//   const actualFileInputRef = fileInputRef || internalFileInputRef;
//   const [loadedMap, setLoadedMap] = React.useState({}); // index -> boolean

//   const handleClick = () => {
//     if (actualFileInputRef.current) {
//       actualFileInputRef.current.click();
//     }
//   };

//   const markLoaded = (index) => setLoadedMap((s) => ({ ...s, [index]: true }));

//   return (
//     <div className="flex flex-col gap-4">
//       {!isProfile && (
//         <label className="text-sm font-medium">
//           {label} (Max {maxImages})
//         </label>
//       )}

//       <input
//         type="file"
//         ref={actualFileInputRef}
//         multiple={maxImages > 1}
//         accept="image/*"
//         onChange={(e) => onFileSelect(e, uploadFor)}
//         className="hidden"
//       />

//       <div className={containerClassName}>
//         {uploadedImages.map((url, index) => {
//           // Build responsive variants for Cloudinary URLs; fall back to raw url
//           const isCloud = typeof url === 'string' && url.includes('res.cloudinary.com');
//           const { src, srcSet, placeholder } = isCloud
//             ? buildCloudinaryVariants(url, variant)
//             : { src: url, srcSet: `${url} 1x`, placeholder: url };

//           // For above-the-fold first image you may want to load eagerly
//           const loadingAttr = index === 0 ? 'eager' : 'lazy';

//           return (
//             <div
//               key={`${url}-${index}`}
//               className={isProfile ? 'relative group' : 'relative group border border-slate-300 p-2 rounded-lg'}
//               style={{ overflow: 'hidden' }}
//             >
//               {/* Placeholder (tiny blurred image) - sits behind main image */}
//               <img
//                 src={placeholder}
//                 alt={`placeholder-${index}`}
//                 aria-hidden
//                 className={`${previewClassName} absolute inset-0 w-full h-full object-cover transition-opacity`}
//                 style={{ filter: 'blur(6px)', transform: 'scale(1.02)', opacity: loadedMap[index] ? 0 : 1 }}
//               />

//               {/* Main optimized image with responsive srcset + crossfade to avoid partial "line-by-line" rendering */}
//               <img
//                 src={src}
//                 srcSet={srcSet}
//                 sizes={sizes}
//                 alt={`Preview ${index + 1}`}
//                 className={`${previewClassName} relative block`}
//                 loading={loadingAttr}
//                 decoding="async"
//                 fetchPriority={index === 0 ? 'high' : 'auto'}
//                 onLoad={() => markLoaded(index)}
//                 onError={() => markLoaded(index)}
//                 onClick={() => isProfile && showUploadButton && actualFileInputRef.current?.click()}
//                 style={{ transition: 'opacity .3s ease', opacity: loadedMap[index] ? 1 : 0 }}
//               />

//               {isProfile && showUploadButton && (
//                 <div
//                   className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1"
//                   onClick={() => actualFileInputRef.current?.click()}
//                 >
//                   <span className="text-white font-poppins text-xs text-nowrap">Change Photo</span>
//                   <AiFillEdit className="h-6 w-4 text-lamaWhite" />
//                 </div>
//               )}

//               {!isProfile && (
//                 <button
//                   type="button"
//                   onClick={() => onRemoveImage(index)}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           );
//         })}

//         {showUploadButton && uploadedImages.length < maxImages && (
//           customUploadButton || (
//             <label
//               onClick={handleClick}
//               className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
//             >
//               <img src="/images/model.png" className="w-9 h-9 object-cover" alt="Upload" />
//             </label>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;




// import React from 'react';
// import { AiFillEdit } from 'react-icons/ai';

// // Helper: detect Cloudinary URLs and build transformed variants (src, srcSet, placeholder)
// function buildCloudinaryVariants(url, variant = 'thumb') {
//   try {
//     if (!url || typeof url !== 'string') return { src: url, srcSet: `${url} 1x`, placeholder: url };
//     const idx = url.indexOf('/upload/');
//     if (idx === -1) return { src: url, srcSet: `${url} 1x`, placeholder: url };

//     // choose widths per image role (thumb, gallery, hero, zoom)
//     const widthsMap = {
//       thumb: [360, 720],
//       gallery: [720, 1080, 1440],
//       hero: [1200, 2000],
//       zoom: [1600, 2400]
//     };
//     const widths = widthsMap[variant] || widthsMap.thumb;

//     const prefix = url.slice(0, idx + '/upload/'.length); // includes `/upload/`
//     const rest = url.slice(idx + '/upload/'.length);

//     // build srcset from widths
//     const srcs = widths.map((w) => `${prefix}w_${w},dpr_auto,f_auto,q_auto/${rest}`);
//     const srcSet = srcs.map((u, i) => `${u} ${widths[i]}w`).join(', ');
//     // fallback choose the middle size
//     const fallback = srcs[Math.floor(srcs.length / 2)] || url;
//     const placeholder = `${prefix}w_40,q_10,f_auto/${rest}`;

//     return { src: fallback, srcSet, placeholder };
//   } catch (err) {
//     return { src: url, srcSet: `${url} 1x`, placeholder: url };
//   }
// }

// /**
//  * ImageUpload component
//  *
//  * uploadedImages: array of strings OR array of objects { url, role }
//  * onFileSelect: function(e, uploadFor) - unchanged (hook will convert files to queue items)
//  * onRemoveImage: expects index (unchanged)
//  */
// const ImageUpload = ({
//   uploadedImages = [],
//   onFileSelect,
//   onRemoveImage,
//   fileInputRef,
//   maxImages = 1,
//   label = 'Images',
//   previewClassName = 'w-32 h-32 object-cover rounded-md',
//   containerClassName = 'flex flex-wrap gap-4',
//   uploadFor = 'default',
//   showUploadButton = true,
//   customUploadButton = null,
//   isProfile = false,
//   // Default variant used if uploadedImages are strings (back-compat)
//   variant = 'thumb', // 'thumb' | 'gallery' | 'hero' | 'zoom'
//   sizes = '100vw' // controls the `sizes` attribute for responsive srcset
// }) => {
//   const internalFileInputRef = React.useRef(null);
//   const actualFileInputRef = fileInputRef || internalFileInputRef;
//   const [loadedMap, setLoadedMap] = React.useState({}); // index -> boolean

//   const handleClick = () => {
//     if (actualFileInputRef.current) {
//       actualFileInputRef.current.click();
//     }
//   };

//   const markLoaded = (index) => setLoadedMap((s) => ({ ...s, [index]: true }));

//   // Normalize uploadedImages: support both string[] and {url,role}[]
//   const normalized = Array.isArray(uploadedImages) ? uploadedImages : [];

//   return (
//     <div className="flex flex-col gap-4">
//       {!isProfile && (
//         <label className="text-sm font-medium">
//           {label} (Max {maxImages})
//         </label>
//       )}

//       <input
//         type="file"
//         ref={actualFileInputRef}
//         multiple={maxImages > 1}
//         accept="image/*"
//         onChange={(e) => onFileSelect(e, uploadFor)}
//         className="hidden"
//       />

//       <div className={containerClassName}>
//         {normalized.map((imgItem, index) => {
//           // imgItem may be a string URL or object { url, role }
//           const url = typeof imgItem === 'string' ? imgItem : imgItem?.url;
//           const role = typeof imgItem === 'string' ? variant : (imgItem?.role || variant);

//           // Build responsive variants for Cloudinary URLs; fall back to raw url
//           const isCloud = typeof url === 'string' && url.includes('res.cloudinary.com');
//           const { src, srcSet, placeholder } = isCloud
//             ? buildCloudinaryVariants(url, role)
//             : { src: url, srcSet: `${url} 1x`, placeholder: url };

//           // For above-the-fold first image you may want to load eagerly
//           const loadingAttr = index === 0 ? 'eager' : 'lazy';

//           return (
//             <div
//               key={`${url}-${index}`}
//               className={isProfile ? 'relative group' : 'relative group border border-slate-300 p-2 rounded-lg'}
//               style={{ overflow: 'hidden' }}
//             >
//               {/* Placeholder (tiny blurred image) - sits behind main image */}
//               <img
//                 src={placeholder}
//                 alt={`placeholder-${index}`}
//                 aria-hidden
//                 className={`${previewClassName} absolute inset-0 w-full h-full object-cover transition-opacity`}
//                 style={{ filter: 'blur(6px)', transform: 'scale(1.02)', opacity: loadedMap[index] ? 0 : 1 }}
//               />

//               {/* Main optimized image with responsive srcset + crossfade to avoid partial "line-by-line" rendering */}
//               <img
//                 src={src}
//                 srcSet={srcSet}
//                 sizes={sizes}
//                 alt={`Preview ${index + 1}`}
//                 className={`${previewClassName} relative block`}
//                 loading={loadingAttr}
//                 decoding="async"
//                 fetchPriority={index === 0 ? 'high' : 'auto'}
//                 onLoad={() => markLoaded(index)}
//                 onError={() => markLoaded(index)}
//                 onClick={() => isProfile && showUploadButton && actualFileInputRef.current?.click()}
//                 style={{ transition: 'opacity .3s ease', opacity: loadedMap[index] ? 1 : 0 }}
//               />

//               {isProfile && showUploadButton && (
//                 <div
//                   className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1"
//                   onClick={() => actualFileInputRef.current?.click()}
//                 >
//                   <span className="text-white font-poppins text-xs text-nowrap">Change Photo</span>
//                   <AiFillEdit className="h-6 w-4 text-lamaWhite" />
//                 </div>
//               )}

//               {!isProfile && (
//                 <button
//                   type="button"
//                   onClick={() => onRemoveImage(index)}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           );
//         })}

//         {showUploadButton && normalized.length < maxImages && (
//           customUploadButton || (
//             <label
//               onClick={handleClick}
//               className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
//             >
//               <img src="/images/model.png" className="w-9 h-9 object-cover" alt="Upload" />
//             </label>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;


// ImageUpload.js
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
                <span className="text-white font-poppins text-xs text-nowrap">Change Photo</span>
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