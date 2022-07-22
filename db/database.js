import mongoose from 'mongoose';
import { config } from '../config.js';

export async function connectDB() {
  mongoose.connect(config.db.host);
}
