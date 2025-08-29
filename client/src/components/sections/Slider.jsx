


// import { useEffect, useState } from "react";
// import { CgCloseO } from "react-icons/cg";
// import { ScrollArea, ScrollBar } from "../ui/ScrollArea";

// const Slider = ({ images, imageIndex, setImageIndex }) => {
//   const [activeImage, setActiveImage] = useState(images[0]);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     if (imageIndex !== null) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [imageIndex]);

//   const changeSlide = (direction) => {
//     if (direction === "left") {
//       setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//     } else {
//       setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//     }
//   };

//   useEffect(() => {
//     const newIndex = images.findIndex((img) => img === activeImage);
//     if (newIndex !== -1) {
//       setActiveIndex(newIndex);
//     }
//   }, [activeImage, images]);

//   return (
//     <div className="w-full h-auto md:h-[500px] lg:h-[600px] xl:h-[430px] flex flex-col md:flex-row lg:flex-col xl:flex-row gap-3">
//       {imageIndex !== null && (
//         <div className="fixed inset-0 z-50 bg-black/90 flex justify-between w-full">
//           {/* Left arrow */}
//           <div
//             className="flex items-center justify-center z-50 px-4 cursor-pointer"
//             onClick={() => changeSlide("left")}
//           >
//             <img
//               src="/icons/arrow.png"
//               className="md:w-6 w-5 object-contain"
//               alt="Previous"
//             />
//           </div>

//           <ScrollArea className="flex-10 flex items-center justify-center w-full md:px-8">
//             <div className="max-w-[90%]  max-h-[90%] rounded-md border-2 border-slate-200 bg-black relative w-full">
//               <img
//                 src={images[imageIndex]}
//                 className="w-auto h-auto min-w-full 
//                 min-h-full object-contain"
//                 alt="Enlarged view"
//               />
           
//             <div
//               className="absolute right-0 top-1 cursor-pointer"
//               onClick={() => setImageIndex(null)}
//             >
//               <CgCloseO className="text-black text-3xl rounded-lg p-1 bg-lamaWhite" />
//             </div>
//            </div>
//            <ScrollBar orientation="vertical" />
//           </ScrollArea>

//           <div
//             className="flex items-center justify-center z-50 px-4 cursor-pointer"
//             onClick={() => changeSlide("right")}
//           >
//             <img
//               src="/icons/arrow.png"
//               className="md:w-6 w-5 rotate-180 object-contain"
//               alt="Next"
//             />
//           </div>
//         </div>
//       )}

//       {/* Active image preview */}
//       <div className="flex-3 w-full md:w-[90%] lg:w-full xl:w-[85%]">
//         <img
//           src={activeImage}
//           onClick={() => setImageIndex(activeIndex)}
//           className="min-w-full h-full min-h-[350px] max-h-[500px] sm:max-h-[500px] sm:min-h-[400px] md:min-h-[400px] md:max-h-[500px] xl:h-[460px] lg:min-h-[400px] lg:max-h-[500px] cursor-pointer object-contain"
//           alt="Main product view"
//         />
//       </div>

//       {/* Thumbnails vertical */}
//       <ScrollArea className="hidden md:flex lg:hidden xl:flex flex-col h-full md:w-[10%] xl:w-[15%] min-w-[100px]">
//         <div className="flex flex-col gap-3 pr-2">
//           {images?.map((image, index) => (
//             <img
//               src={image}
//               alt={`Thumbnail ${index + 1}`}
//               key={index}
//               className="h-[80px]  xl:h-[80px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
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

//      <ScrollArea orientation="horizontal" className="flex md:hidden lg:flex xl:hidden h-[100px] w-full">
//        <div className="flex justify-center items-center gap-3 pb-2 w-full h-full">
//           {images?.map((image, index) => (
//             <img
//               src={image}
//               alt={`Thumbnail ${index + 1}`}
//               key={index}
//               className="h-[70px] w-24 object-cover rounded-md border-2 border-transparent hover:border-[#083a5a]"
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
    if (newIndex !== -1) setActiveIndex(newIndex);
  }, [activeImage, images]);

  return (
    <div className="w-full h-auto md:h-[500px] lg:h-[600px] xl:h-[430px] flex flex-col md:flex-row lg:flex-col xl:flex-row gap-3 relative items-center justify-center">
      {imageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center w-full h-full">
          {/* Left arrow */}
          <div
            className="flex items-center absolute justify-center z-50  left-9 cursor-pointer"
            onClick={() => changeSlide("left")}
          >
            <img src="/icons/arrow.png" className="md:w-6 w-5 object-contain" alt="Previous" />
          </div>

          {/* Enlarged image area */}
          <ScrollArea className="flex items-center justify-center w-full h-full px-2 md:px-8">
            <div
              className="
                relative rounded-md border-2 border-slate-200 bg-black flex items-center justify-center
                w-[100vw] md:h-[90vh] h-[96vh]
                md:max-w-[99%] md:max-h-[90%] md:w-full md:h-full
              "
            >
              <img
                src={images[imageIndex]}
                className="w-full h-full object-cover"
                alt="Enlarged view"
              />
              
            </div>
            {/* The ScrollArea component already renders a scrollbar.
                Keep this extra one only if you want a visible vertical bar overlay. */}
            <ScrollBar orientation="horizontal" />

            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <div
                className="absolute right-12 top-2 cursor-pointer"
                onClick={() => setImageIndex(null)}
              >
                <CgCloseO className="text-black text-3xl rounded-lg p-1 bg-lamaWhite" />
              </div>

          {/* Right arrow */}
          <div
            className="flex absolute items-center  justify-center z-50 right-12  cursor-pointer"
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
      <div className="flex-3 w-full md:w-[90%] lg:w-full xl:w-[85%]">
        <img
          src={activeImage}
          onClick={() => setImageIndex(activeIndex)}
          className="min-w-full h-full min-h-[350px] max-h-[500px] sm:max-h-[500px] sm:min-h-[400px] md:min-h-[400px] md:max-h-[500px] xl:h-[460px] lg:min-h-[400px] lg:max-h-[500px] cursor-pointer object-contain"
          alt="Main product view"
        />
      </div>

      {/* Thumbnails vertical */}
      <ScrollArea className="hidden md:flex lg:hidden xl:flex flex-col h-full md:w-[10%] xl:w-[15%] min-w-[100px]">
        <div className="flex flex-col gap-3 pr-2">
          {images?.map((image, index) => (
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              key={index}
              className="h-[80px] xl:h-[80px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
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

      {/* Thumbnails horizontal at lg, mobile */}
      <ScrollArea orientation="horizontal" className="flex md:hidden lg:flex xl:hidden h-[100px] w-full">
        <div className="flex justify-center items-center gap-3 pb-2 w-full h-full">
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
