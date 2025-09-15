
export const containerVariants = {
  hidden: { 
     opacity: 0,
     y: 20,
     type: 'spring',
      stiffness: 300,
      damping: 140,
     },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
        type: 'spring',
       stiffness: 80,
      
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4 },
  },
};

export const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};


export const carouselImageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(5px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};
