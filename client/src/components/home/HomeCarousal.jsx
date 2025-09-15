// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Autoplay,Keyboard, Pagination } from 'swiper/modules';
// import { Link } from 'react-router-dom';

// export default function HomeCarousal({ loading, banner, transformData }) {
//   if (loading || !banner) {
//     return (
//       <div className="w-full h-[300px] sm:h-[300px] md:h-[320px] lg:h-[350px] xl:h-[400px] 2xl:h-[400px] bg-gray-200 animate-pulse"></div>
//     );
//   }

//   const carouselItems = transformData(banner);

//   return (
//     <div className="w-full h-[150px] sm:h-[300px] md:h-[350px] xl:h-[400px] 2xl:h-[400px]">
//       <Swiper
//         slidesPerView={1}
//         spaceBetween={30}
//         centeredSlides={true}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//        keyboard={{
//           enabled: true,
//         }}
//         pagination={{
//           clickable: true,
//         }}
//         loop={true}
//         modules={[Autoplay, Pagination,Keyboard]}
//         className="mySwiper h-full"
//       >
//         {carouselItems.map((carousel, index) => (
//           <SwiperSlide  key={carousel._id || index} className="h-full w-full">
//             <Link to={carousel?.url} className="h-full w-full block">
//               <img
//                 src={carousel?.image}
//                 className="h-full w-full object-cover object-center rounded-[10px]"
//                 alt="carousel"
//               />
//             </Link>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }



// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion'; // Import Framer Motion
// import { carouselImageVariants, containerVariants } from '../../lib/motion';

// // New animation variant for carousel images


// export default function HomeCarousal({ loading, banner, transformData }) {
//   if (loading || !banner) {
//     return (
//       <div className="w-full h-[300px] sm:h-[300px] md:h-[320px] lg:h-[350px] xl:h-[400px] 2xl:h-[400px] bg-gray-200 animate-pulse"></div>
//     );
//   }

//   const carouselItems = transformData(banner);

//   return (
//     <motion.div className="w-full h-[150px] sm:h-[300px] md:h-[350px] xl:h-[400px] 2xl:h-[400px]"
//      variants={containerVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}>
//       <Swiper
//         slidesPerView={1}
//         spaceBetween={30}
//         centeredSlides={true}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         keyboard={{
//           enabled: true,
//         }}
//         pagination={{
//           clickable: true,
//         }}
//         loop={true}
//         modules={[Autoplay, Pagination, Keyboard]}
//         className="mySwiper h-full"
//       >
//         {carouselItems.map((carousel, index) => (
//           <SwiperSlide key={carousel._id || index} className="h-full w-full">
//             <Link to={carousel?.url} className="h-full w-full block">
//               <motion.img
//                 src={carousel?.image}
//                 className="h-full w-full object-cover object-center rounded-[10px]"
//                 alt="carousel"
//                 variants={carouselImageVariants}
//               />
//             </Link>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </motion.div>
//   );
// }



import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { containerVariants, carouselImageVariants } from '../../lib/motion';

const HomeCarousal = ({ loading, banner, transformData }) => {
  if (loading || !banner) {
    return (
      <div className="w-full h-[300px] sm:h-[300px] md:h-[320px] lg:h-[350px] xl:h-[400px] 2xl:h-[400px] bg-gray-200 animate-pulse"></div>
    );
  }

  const carouselItems = transformData(banner);

  return (
    <motion.div
      className="w-full h-[150px] sm:h-[300px] md:h-[350px] xl:h-[400px] 2xl:h-[400px]"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} 
    >
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        keyboard={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination, Keyboard]}
        className="mySwiper h-full"
        updateOnWindowResize={true}
      >
        {carouselItems.map((carousel, index) => (
          <SwiperSlide key={carousel._id || index} className="h-full w-full">
            <Link to={carousel?.url} className="h-full w-full block">
              <motion.img
                src={carousel?.image}
                className="h-full w-full object-cover object-center rounded-[10px]"
                alt={carousel?.title || 'carousel image'}
                variants={carouselImageVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default memo(HomeCarousal);
