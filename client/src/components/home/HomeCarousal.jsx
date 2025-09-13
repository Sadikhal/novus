import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate, Link } from 'react-router-dom';

export default function HomeCarousal({ loading, banner, transformData }) {


  if (loading || !banner) {
    return (
      <div className="w-full h-[300px] sm:h-[300px] md:h-[320px] lg:h-[350px] xl:max-h-[400px] 2xl:max-h-[400px] bg-gray-200 animate-pulse"></div>
    );
  }
  const carouselItems = transformData(banner);

  return (
    <div className="w-full h-[300px] lg:h-[350px] xl:max-h-[400px] 2xl:max-h-[400px]">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination]}
        className="mySwiper h-full"
      >
        {carouselItems.map((carousel, index) => (
          <SwiperSlide key={carousel._id || index} className="h-full w-full">
            <Link
              to={carousel?.url}
              className="h-full w-full"
            >
              <img src={carousel?.image} className='h-full w-full bg-cover bg-center rounded-[10px]' alt="carousel" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}