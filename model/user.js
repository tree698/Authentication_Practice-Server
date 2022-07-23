import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config.js';

const userSchema = new Mongoose.Schema({
  name: { type: String, maxlength: 50, required: true },
  email: { type: String, trim: true, unique: 1, required: true },
  password: { type: String, minlength: 5, required: true },
  lastname: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 },
  image: { type: String },
  token: { type: String },
  tokenExp: { type: Number },
});

userSchema.pre('save', async function () {
  const user = this;
  const hashed = await bcrypt.hash(user.password, config.bycrypt.saltRounds);
  user.password = hashed;
});

export const User = Mongoose.model('shopping/user', userSchema);
