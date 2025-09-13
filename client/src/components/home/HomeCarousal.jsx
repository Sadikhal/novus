import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';



export default function HomeCarousal({ loading, banner, transformData }) {
  const navigate = useNavigate();


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
            onClick={() => navigate(`/category/${carousel.url}`)}
            className="h-full w-full bg-cover bg-center" 
            style={{ 
              backgroundImage: ` url(${carousel?.image})`,
              borderRadius: '10px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
              width: '100%'
            }}
          >
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}