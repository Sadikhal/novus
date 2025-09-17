import { motion } from 'framer-motion';
import { bannerVariants, bannerContainer } from '../../lib/motion';
import Buttons from '../ui/Buttons';

const AdProducts = () => {
  return (
    <motion.div
      className="bg-transparent lg:aspect-50/40 2xl:aspect-50/41 aspect-video z-[100]"
      variants={bannerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div
        className="relative h-full w-full bg-cover bg-center rounded-[10px] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/banner/ban3.jpg')`,
        }}
        variants={bannerVariants}
      >
        <div className="absolute left-28 top-28 flex flex-col gap-2">
          <h1
            className="text-white text-4xl font-assistant font-bold capitalize"
          >
            Unveil the Essence of Elegance
          </h1>

          <div className="text-white text-lg font-poppins font-medium capitalize">
            Timeless & Modern choices
          </div>
        </div>

        <div className="absolute bottom-20 left-28">
          <Buttons className="btn text-slate-900 bg-white capitalize font-assistant font-bold text-[22px]" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdProducts;
