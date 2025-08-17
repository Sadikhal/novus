import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function HomeCarousal({ loading, banner, transformData }) {
  if (loading || !banner) {
    return (
      <div className='w-full sm:h-[300px] md:h-[320px] lg:h-[350px] xl:max-h-[400px] 2xl:max-h-[400px] h-[300px] bg-gray-200 animate-pulse'></div>
    );
  }

  const carouselItems = transformData(banner);

  return (
    <div className='w-full h-[300px]  lg:h-[350px] xl:max-h-[400px] 2xl:max-h-[400px] '>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {carouselItems.map((carousel) => (
          <SwiperSlide 
            key={carousel._id} 
            className="h-full w-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${carousel?.image})`,
              borderRadius: '10px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
              width: '100%'
            }}
          >
            <div className="absolute inset-0 bg-transparent  bg-opacity-50 flex left-28 top-28 flex-col gap-5">
              <h1 className="text-[#d8e4d6] text-4xl font-poppins font-bold capitalize ">
                 {carousel.title}
              </h1>
              <div className='text-[#d8e4d6] text-xl font-poppins font-normal  capitalize'>
               {carousel.title2}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}