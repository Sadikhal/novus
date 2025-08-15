import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { brandBanner } from '../lib/data';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function CreateBrandBanner() {
  return (
    <div className='w-full h-full bg-[#fff]'>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2450,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {brandBanner.map((carousel, i) => (
          <SwiperSlide key={i} className=' h-full w-full flex items-center justify-center'>
            <img
              src={carousel.img}
              alt=""
              className="w-full sm:h-[300px] md:h-[320px] lg:h-[450px] xl:max-h-[400px] 2xl:max-h-[400px] h-[300px] object-cover bg-center bg-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}