import CountUp from 'react-countup';
import { useProductDetails } from '../../hooks/useProductDetails';
import { useParams } from 'react-router-dom';

const BrandDetails = () => {
  const { productId } = useParams();
  const { brand } = useProductDetails(productId);
  const experience = brand?.experience || 0;

  const stats = [
    { id: 'products-sold', value: 10, suffix: 'k+', title: 'products sold', duration: 1 },
    { id: 'years-experience', value: experience, suffix: '+', title: 'years of experience', duration: 1 },
    { id: 'quality-assured', value: 100, suffix: '%', title: 'quality assured', duration: 1 },
  ];

  return (
    <div 
      className='grid md:grid-cols-3 grid-cols-1 bg-cover bg-center bg-no-repeat py-20 bg-fixed grayscale md:gap-5 gap-12 lg:pl-10 md:pl-5 justify-center items-center'
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/cr6.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {stats.map((stat) => (
        <div key={stat.id} className='rounded-full w-full h-full flex justify-center items-center'>
          <div className='flex flex-col items-center backdrop-opacity-10 backdrop-invert bg-white/50 text-black rounded-full w-[200px] h-[200px] 2xl:w-[220px] 2xl:h-[220px] justify-center cursor-pointer transition-transform duration-300 hover:scale-105'>
            <div className='text-center'>
              <h2 className='font-robotos text-[50px] 2xl:text-[80px] font-normal leading-[1em] tracking-0'>
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={stat.duration}
                  enableScrollSpy
                />
              </h2>
              <div className='font-robotos font-normal tracking-[1px] text-[20px] leading-[.7em] capitalize 2xl:text-[24px] pt-2'>
                {stat.title}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandDetails;