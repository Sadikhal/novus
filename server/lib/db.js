import mongoose from 'mongoose';

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongoDb!");
  } catch (error) {
    console.log(error);
  }
};