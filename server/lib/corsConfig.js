import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CLIENT_URL.split(',');
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;