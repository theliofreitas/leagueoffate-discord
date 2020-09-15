import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true });

export default mongoose;