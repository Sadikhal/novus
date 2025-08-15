import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 120 }
    }
  };

  const bgColors = ["#8f9722", "#F5F5F5", "#97c0c9"];

  const checkAnimation = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-[#358b73] to-[#3f5624] "
        initial={{ backgroundColor: bgColors[0] }}
        animate={{ backgroundColor: bgColors[2] }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.2
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 120,
              delay: 0.5 
            }}
            className="mx-auto mb-6"
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              className="text-cyan-800"
            >
              <motion.path
                d="M38 52.5L46 60.5L64 40.5"
                fill="transparent"
                strokeWidth="8"
                stroke="currentColor"
                strokeLinecap="round"
                variants={checkAnimation}
                initial="hidden"
                animate="visible"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeWidth="8"
                stroke="currentColor"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  transition: { 
                    duration: 1, 
                    delay: 0.8 
                  }
                }}
              />
            </svg>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h1 
              variants={childVariants}
              className="text-3xl font-bold text-gray-800 mb-2 font-poppins"
            >
              Order Confirmed!
            </motion.h1>
            
            <motion.p 
              variants={childVariants}
              className="text-gray-600 mb-6 font-robotos"
            >
              Thank you for your purchase! Your order has been successfully processed.
            </motion.p>

            <motion.div 
              variants={childVariants}
              className="bg-[#dfdada] rounded-lg p-4 text-left space-y-2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-sm font-medium text-gray-600 font-poppins">
                Order ID: <span className="text-gray-800 px-3">{state?.orderId || 'N/A'}</span>
              </p>
              <p className="text-sm font-medium text-gray-600 font-poppins">
                Total Paid: <span className="text-gray-800 px-2">${state?.total?.toFixed(2) || '0.00'}</span>
              </p>
            </motion.div>

            <motion.button
              variants={childVariants}
              
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 20px rgba(143, 151, 34, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/my-orders')}
              className="w-full glass bg-[#1a546c] hover:bg-[#157215] text-white py-3 px-6 rounded-lg font-semibold transition-colors font-robotos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              View Order Details
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-[-1]"
          initial={{ backgroundColor: bgColors[1] }}
          animate={{ backgroundColor: bgColors[0] }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}