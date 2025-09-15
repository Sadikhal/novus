
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
    scale: 0.95, // Slightly scaled down for a subtle zoom effect
    filter: 'blur(5px)', // Subtle blur for smooth entry
  },
  visible: {
    opacity: 1,
    scale: 1, // Scale to normal size
    filter: 'blur(0px)', // Remove blur
    transition: {
      duration: 0.6, // Smooth duration for the animation
      ease: 'easeOut', // Easing for a natural feel
    },
  },
  // exit: {
  //   opacity: 1, // Ensure image stays visible when exiting
  //   scale: 1,
  //   filter: 'blur(0px)', // No blur on exit
  //   transition: {
  //     duration: 0, // Instant exit to prevent disappearance
  //   },
  // },
};