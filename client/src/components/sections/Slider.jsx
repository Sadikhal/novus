
// import  { useEffect, useState } from 'react';
// import { CgCloseO } from "react-icons/cg";
// import { ScrollArea, ScrollBar } from '../ui/ScrollArea';

// const Slider = ({ images, imageIndex, setImageIndex }) => {
//   const [activeImage, setActiveImage] = useState(images[0]);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     if (imageIndex !== null) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [imageIndex]);

//   const changeSlide = (direction) => {
//     if (direction === 'left') {
//       setImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
//     } else {
//       setImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
//     }
//   };

//   useEffect(() => {
//     const newIndex = images.findIndex(img => img === activeImage);
//     if (newIndex !== -1) {
//       setActiveIndex(newIndex);
//     }
//   }, [activeImage, images]);

//   return (
//     <div className="w-full h-auto md:h-[500px] lg:[600px] xl:h-[400px] flex flex-col sm:flex-row gap-3">
//       {imageIndex !== null && (
//         <div className="fixed inset-0 z-50 bg-black/80 flex justify-between w-full">
//           <div 
//             className="flex items-center justify-center z-50 px-4 cursor-pointer" 
//             onClick={() => changeSlide('left')}
//           >
//             <img 
//               src="/icons/arrow.png" 
//               className="md:w-6 w-5 object-contain" 
//               alt="Previous" 
//             />
//           </div>
          
//           <div className="flex-10 relative flex items-center justify-center w-full md:px-8">
//             <img 
//               src={images[imageIndex]} 
//               className="md:w-[90%] w-full aspect-video h-[90%] border-4 rounded-md object-cover border-slate-300" 
//               alt="Enlarged view" 
//             />
//             <div 
//               className="absolute right-0 top-4 md:right-[70px] cursor-pointer"
//               onClick={() => setImageIndex(null)}
//             >
//               <CgCloseO className='text-white text-3xl bg-black/50 rounded-full p-1'/>
//             </div>
//           </div>
          
//           <div 
//             className="flex items-center justify-center z-50 px-4 cursor-pointer" 
//             onClick={() => changeSlide('right')}
//           >
//             <img 
//               src="/icons/arrow.png" 
//               className="md:w-6 w-5 rotate-180 object-contain" 
//               alt="Next" 
//             />
//           </div>
//         </div>
//       )}

//       <div className="flex-3 w-full sm:w-[90%] xl:w-[85%]">
//         <img 
//           src={activeImage} 
//           onClick={() => setImageIndex(activeIndex)} 
//           className="aspect-video min-w-full min-h-[300px] md:min-h-[400px] h-full xl:min-h-[420px] cursor-pointer object-contain lg:min-h-[450px]"
//           alt="Main product view"
//         />
//       </div>

//       <ScrollArea className="hidden sm:flex flex-col h-full w-[10%] min-w-[100px]">
//         <div className="flex flex-col gap-3 pr-2">
//           {images?.map((image, index) => (
//             <img
//               src={image}
//               alt={`Thumbnail ${index + 1}`}
//               key={index}
//               className="h-[80px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
//               onMouseEnter={() => setActiveImage(image)}
//               onClick={() => {
//                 setActiveImage(image);
//                 setActiveIndex(index);
//               }}
//             />
//           ))}
//         </div>
//         <ScrollBar orientation="vertical" />
//       </ScrollArea>

//       <ScrollArea 
//         orientation="horizontal" 
//         className="sm:hidden h-[100px] w-full"
//       >
//         <div className="flex gap-3 pb-2 w-full h-full">
//           {images?.map((image, index) => (
//             <img
//               src={image}
//               alt={`Thumbnail ${index + 1}`}
//               key={index}
//               className="h-[80px] w-24 object-cover rounded-md border-2 border-transparent hover:border-[#083a5a]"
//               onMouseEnter={() => setActiveImage(image)}
//               onClick={() => {
//                 setActiveImage(image);
//                 setActiveIndex(index);
//               }}
//             />
//           ))}
//         </div>
//         <ScrollBar orientation="horizontal" />
//       </ScrollArea>
//     </div>
//   );
// };

// export default Slider;


import { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { ScrollArea, ScrollBar } from "../ui/ScrollArea";

const Slider = ({ images, imageIndex, setImageIndex }) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (imageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [imageIndex]);

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    const newIndex = images.findIndex((img) => img === activeImage);
    if (newIndex !== -1) {
      setActiveIndex(newIndex);
    }
  }, [activeImage, images]);

  return (
    <div className="w-full h-auto md:h-[500px] lg:[600px] xl:h-[400px] flex flex-col md:flex-row gap-3">
      {imageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex justify-between w-full">
          {/* Left arrow */}
          <div
            className="flex items-center justify-center z-50 px-4 cursor-pointer"
            onClick={() => changeSlide("left")}
          >
            <img
              src="/icons/arrow.png"
              className="md:w-6 w-5 object-contain"
              alt="Previous"
            />
          </div>

          <ScrollArea className="flex-10 flex items-center justify-center w-full md:px-8">
            <div className="max-w-[90%] max-h-[90%] rounded-md border-2 border-slate-200 bg-black relative w-full">
              <img
                src={images[imageIndex]}
                className="w-auto h-auto min-w-full 
                min-h-full object-contain"
                alt="Enlarged view"
              />
           
            <div
              className="absolute right-0 top-1 cursor-pointer"
              onClick={() => setImageIndex(null)}
            >
              <CgCloseO className="text-black text-3xl rounded-lg p-1 bg-lamaWhite" />
            </div>
           </div>
           <ScrollBar orientation="vertical" />
          </ScrollArea>

          <div
            className="flex items-center justify-center z-50 px-4 cursor-pointer"
            onClick={() => changeSlide("right")}
          >
            <img
              src="/icons/arrow.png"
              className="md:w-6 w-5 rotate-180 object-contain"
              alt="Next"
            />
          </div>
        </div>
      )}

      {/* Active image preview */}
      <div className="flex-3 w-full md:w-[90%] xl:w-[85%]">
        <img
          src={activeImage}
          onClick={() => setImageIndex(activeIndex)}
          className="min-w-full h-[300px] md:h-[400px]  xl:h-[420px] cursor-pointer object-contain lg:h-[450px]"
          alt="Main product view"
        />
      </div>

      {/* Thumbnails vertical */}
      <ScrollArea className="hidden md:flex flex-col h-full w-[10%] min-w-[100px]">
        <div className="flex flex-col gap-3 pr-2">
          {images?.map((image, index) => (
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              key={index}
              className="h-[80px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
              onMouseEnter={() => setActiveImage(image)}
              onClick={() => {
                setActiveImage(image);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {/* Thumbnails horizontal (mobile) */}
      <ScrollArea orientation="horizontal" className="md:hidden h-[100px] w-full">
        <div className="flex gap-3 pb-2 w-full h-full">
          {images?.map((image, index) => (
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              key={index}
              className="h-[70px] w-24 object-cover rounded-md border-2 border-transparent hover:border-[#083a5a]"
              onMouseEnter={() => setActiveImage(image)}
              onClick={() => {
                setActiveImage(image);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Slider;
