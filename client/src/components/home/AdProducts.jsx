
import { bannerContainer, bannerTextVariants, bannerVariants } from '../../lib/motion';
import Buttons from '../ui/Buttons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdProducts = () => {
  return (
    <motion.div
      className="relative bg-transparent lg:aspect-50/40 2xl:aspect-50/41 aspect-video z-[100]"
      variants={bannerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
     <Link to ='/products?category=perfumes,beauty' className='h-full w-full'>
      <motion.img src="/banner/perfume9.webp" alt="banner" className="w-full h-full object-cover object-center rounded-[10px]"
      loading='lazy'
      decoding="async"
      variants={bannerVariants}
       />
        <div className="absolute left-16 top-20 flex flex-col gap-2">
          <motion.h1
            className="text-white text-4xl font-assistant font-bold capitalize"
            variants={bannerTextVariants}
          >
            Unveil the Essence of Elegance
          </motion.h1>
          <div className="text-white text-lg font-poppins font-medium capitalize">
            Timeless & Modern choices
          </div>
        </div>

        <div className="absolute bottom-20 left-16">
          <Buttons className="btn text-slate-900 bg-white capitalize font-assistant font-bold text-[22px]" />
        </div>
      </Link>  
    </motion.div>
  );
};

export default AdProducts;
