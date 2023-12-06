/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import app from './App';
import connectDB from './utils/DBcontext';

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

dotenv.config();
// create server
app.listen(process.env.PORT, () => {
  console.log(`Server is connected with port ${process.env.PORT}`);
  connectDB();
});
