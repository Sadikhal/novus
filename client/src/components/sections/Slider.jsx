import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { ScrollArea, ScrollBar } from "../ui/ScrollArea";
import { FiChevronLeft } from "react-icons/fi";
import { containerVariants, itemVariants } from "../../lib/motion";
import { motion } from "framer-motion";

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
    <motion.div className="w-full h-auto md:h-[500px] lg:h-[530px] xl:h-[430px] flex flex-col md:flex-row lg:flex-col xl:flex-row gap-1 relative 2xl:min-h-[650px] items-center justify-center 2xl:h-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}>
      {imageIndex !== null && (
        <motion.div className="fixed inset-0 z-50 bg-black/90 flex flex-col w-full h-full">
          <div className="flex flex-row justify-center items-center w-full h-full">
            <div
              className="flex bg-[#ffff] p-2 px-2 items-center absolute justify-center z-50 lg:left-9 left-2 cursor-pointer"
              onClick={() => changeSlide("left")}
            >
              <FiChevronLeft
                className="md:w-6 text-2xl w-5  object-contain text-slate-500"
              />
            </div>

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
                  loading="lazy"
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

          <div className="fixed bottom-6 z-[999] md:h-[60px] h-[30px] w-full">
            <div className="h-full justify-center w-full flex items-center">
              <div
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
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active image preview */}
      <motion.div className="flex-3 w-full md:w-[90%] lg:w-full xl:w-[85%]"
      variants={itemVariants}
      >
        <img
          src={activeImage}
          onClick={() => setImageIndex(activeIndex)}
          className="min-w-full h-full min-h-[350px] max-h-[500px] sm:max-h-[500px] sm:min-h-[400px] md:min-h-[400px] md:max-h-[500px] xl:h-[460px] lg:min-h-[400px] lg:max-h-[450px] 2xl:min-h-[600px] 2x:h-auto cursor-pointer object-contain 2xl:w-full"
          alt="Main product view"
          loading="lazy"
        />
      </motion.div>

      {/* Thumbnails vertical */}
      <ScrollArea className="hidden md:flex lg:hidden xl:flex flex-col h-full md:w-[10%] xl:w-[15%] min-w-[100px]">
        <div className="flex flex-col gap-3 pr-2">
          {images?.map((image, index) => (
            <motion.img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              key={index}
              className="h-[80px] xl:h-[80px] 2xl:min-h-[85px] w-full object-cover rounded-md border-2 border-transparent hover:border-[#6a92ab]"
              loading="lazy"
              variants={itemVariants}
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

      <ScrollArea orientation="horizontal" className="flex md:hidden lg:flex xl:hidden h-[100px] w-full">
        <div className="flex items-center gap-3 pb-2 w-max h-full mx-auto">
          {images?.map((image, index) => (
            <motion.img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              key={index}
              variants={itemVariants}
              className="h-[70px] w-24 object-cover rounded-md border-2 border-transparent hover:border-[#083a5a]"
              loading="lazy"
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
    </motion.div>
  );
};

export default Slider;

