import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const HomeCarousal = ({ loading, banner, transformData }) => {

  const carouselItems = transformData(banner);

  return (
    <div
      className="w-full h-[150px] sm:h-[300px] md:h-[350px] xl:h-[400px] 2xl:h-[400px]"
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
              <img
                src={carousel?.image}
                className="h-full w-full object-cover object-center rounded-[10px]"
                alt={carousel?.title || 'carousel image'}
                loading="lazy"
                decoding="async"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousal;
