


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
//     if (newIndex !== -1) setActiveIndex(newIndex);
//   }, [activeImage, images]);

//   return (
//     <div className="w-full h-auto md:h-[500px] lg:h-[600px] xl:h-[430px] flex flex-col md:flex-row lg:flex-col xl:flex-row gap-3 relative items-center justify-center">
//       {imageIndex !== null && (
//         <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center w-full h-full">
//           {/* Left arrow */}
//           <div
//             className="flex items-center absolute justify-center z-50  left-9 cursor-pointer"
//             onClick={() => changeSlide("left")}
//           >
//             <img src="/icons/arrow.png" className="md:w-6 w-5 object-contain" alt="Previous" />
//           </div>

//           {/* Enlarged image area */}
//           <ScrollArea className="flex items-center justify-center w-full h-full  md:px-8">
//             <div
//               className="
//                 relative rounded-md border-2 border-slate-200 bg-black flex items-center justify-center
//                 w-[100vw] md:h-[90vh] h-[96vh]
//                 md:max-w-[99%] md:max-h-[90%] md:w-full md:h-full
//               "
//             >
//               <img
//                 src={images[imageIndex]}
//                 className="w-full h-full object-cover"
//                 alt="Enlarged view"
//               />
              
//             </div>
//             {/* The ScrollArea component already renders a scrollbar.
//                 Keep this extra one only if you want a visible vertical bar overlay. */}
//             <ScrollBar orientation="horizontal" />

//             <ScrollBar orientation="vertical" />
//           </ScrollArea>

//           <div
//                 className="absolute right-12 top-2 cursor-pointer"
//                 onClick={() => setImageIndex(null)}
//               >
//                 <CgCloseO className="text-black text-3xl rounded-lg p-1 bg-lamaWhite" />
//               </div>

//           {/* Right arrow */}
//           <div
//             className="flex absolute items-center  justify-center z-50 right-12  cursor-pointer"
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
//               className="h-[80px] xl:h-[80px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
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

//       {/* Thumbnails horizontal at lg, mobile */}
//       <ScrollArea orientation="horizontal" className="flex md:hidden lg:flex xl:hidden h-[100px] w-full">
//         <div className="flex justify-center items-center gap-3 pb-2 w-full h-full">
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
import { IoClose } from "react-icons/io5";
import { ScrollArea, ScrollBar } from "../ui/ScrollArea";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";

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
    <div className="w-full h-auto md:h-[500px] lg:h-[530px] xl:h-[430px] flex flex-col md:flex-row lg:flex-col xl:flex-row gap-1 relative 2xl:min-h-[650px] items-center justify-center 2xl:h-auto">
      {imageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col w-full h-full">
          <div className="flex flex-row justify-center items-center w-full h-full">
            <div
              className="flex bg-[#ffff] p-2 px-2 items-center absolute justify-center z-50 lg:left-9 left-2 cursor-pointer"
              onClick={() => changeSlide("left")}
            >
              <FiChevronLeft
                className="md:w-6 text-2xl w-5  object-contain text-slate-500"
              />
            </div>

            {/* Enlarged image area */}
            <ScrollArea className="flex items-center justify-center w-full h-full">
              <div
                className="
                relative rounded-md border-2 border-slate-200 bg-black flex items-center justify-center
                w-[100vw] md:h-[100vh] h-[100vh]
                md:max-w-[100%] md:max-h-[100%] lg:w-full lg:h-full
              "
              >
                <img
                  src={images[imageIndex]}
                  className="w-full h-full object-cover"
                  alt="Enlarged view"
                />
              </div>
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>

            <div
              className="absolute lg:right-5 right-2 top-2 cursor-pointer"
              onClick={() => setImageIndex(null)}
            >
              <IoClose className="text-black text-3xl rounded-lg p-1 bg-lamaWhite" />
            </div>

            <div
              className="flex bg-[#ffff] p-2 px-2 absolute items-center justify-center z-50 lg:right-6 right-2 cursor-pointer"
              onClick={() => changeSlide("right")}
            >
              <FiChevronLeft
                className="md:w-6 text-2xl w-5 rotate-180 object-contain text-slate-500"
              />
            </div>
          </div>

          {/* Bottom thumbnails (modal) */}
          <div className="fixed bottom-6 z-[999] md:h-[60px] h-[30px] w-full">
            <div className="h-full justify-center w-full flex items-center">
              <div
                /* CHANGE: start-align the scroll content; keep the strip centered by sizing the container, not the items */
                className="flex items-center gap-2 py-2 overflow-x-auto overflow-y-hidden w-auto max-w-[95%] mx-auto"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {images?.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={`flex items-center justify-center h-[86px] w-[80px] rounded-md border-2 p-1 shrink-0 cursor-pointer focus:outline-none ${
                      index === imageIndex ? "border-[#083a5a]" : "border-transparent"
                    }`}
                    aria-label={`Thumbnail ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="max-h-full max-w-full object-contain rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active image preview */}
      <div className="flex-3 w-full md:w-[90%] lg:w-full xl:w-[85%]">
        <img
          src={activeImage}
          onClick={() => setImageIndex(activeIndex)}
          className="min-w-full h-full min-h-[350px] max-h-[500px] sm:max-h-[500px] sm:min-h-[400px] md:min-h-[400px] md:max-h-[500px] xl:h-[460px] lg:min-h-[400px] lg:max-h-[450px] 2xl:min-h-[600px] 2x:h-auto cursor-pointer object-contain 2xl:w-full"
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
              className="h-[80px] xl:h-[80px] 2xl:min-h-[85px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
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
        {/* CHANGE: same idea—start-align the scroll content, center the strip via its own width */}
        <div className="flex items-center gap-3 pb-2 w-max h-full mx-auto">
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

