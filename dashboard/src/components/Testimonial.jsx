
import { testimonial } from '../lib/data';
import './ui/styled/swiper.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Card, CardContent, CardDescription, CardHeader } from './ui/Card';


const TestimonialSlider = ({number}) => {
  return (
    <div className='px-3 py-2 pt-8 gap-12 flex flex-col h-full'>
        <div className='font-bold sm:text-[30px] uppercase leading-[.9em] font-assistant text-slate-900 text-[24px]'>
          OUR HAPPY BRANDS <span className='text-[#18656c]'>.</span>
        </div>
        <Swiper
        swiper-pagination-bullet-active={{
          color:'black'
        }}
          className="w-full h-full  text-foreground"
          slidesPerView={number}
           spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination, Navigation]}
        >
        {
          testimonial.map((item) => (
          <SwiperSlide className='sm:text-justify  text-foreground'>
            <Card className={`p-4 group drop-shadow-2xl bg-[#fff] hover:bg-[#008e9b] shadow-sm border-slate-200`}>
              <CardHeader>
              <CardDescription className=" flex justify-between items-center text-black">
                <div className='gap-6 flex items-center'>
                  <img src="/images/person11.png" className=' w-16 h-16 rounded-full object-contain' alt="" />
                  <div className='flex gap-1 flex-col '>
                    <div className='font-robotos font-normal uppercase tracking-[.05em] text-[20px] leading-[1.2em] text-left text-foreground group-hover:text-[#ffff]'>
                      {item.brand}
                    </div>
                    <div className='text-left font-robotos font-normal uppercase tracking-[.05em] text-[14px] leading-[1.2em] text-[#008e9b] group-hover:text-[#ffff]'>
                      {item.name}
                    </div>
                  </div>
                </div>
                <div className='group-hover:hidden'>
                </div>
                <div className='group-hover:block hidden'>
                <box-icon type='solid' name='quote-right' color='#ffff'></box-icon>
                </div>
              </CardDescription>
          </CardHeader>
          <CardContent className="px-8 text-justify text-balance">
            <p className='font-poppins text-[16px] text-black leading-[2.125em] text-flex group-hover:text-[#ffff]'>
              "{item.desc}"
            </p>
          </CardContent> 
          </Card>   
        </SwiperSlide>
          ))
          }
    </Swiper>
  </div>
  )
}

export default TestimonialSlider