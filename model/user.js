import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { config } from '../config.js';

const userSchema = new Mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: 1 },
  password: { type: String, minlength: 5 },
  lastname: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 },
  image: { type: String },
  token: { type: String },
  tokenExp: { type: Number },
});

userSchema.pre('save', async function () {
  const user = this;
  console.log('user', user);
  const hashed = await bcrypt.hash(user.password, config.bycrypt.saltRounds);
  user.password = hashed;
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = (callback) => {
  const user = this;
  console.log('user', user);

  var token = jwt.sign(user._id.toHexString(), 'secret');
  user.token = token;

  var oneHour = moment().add(1, 'hour').valueOf();
  user.tokenExp = oneHour;

  user.save((err, user) => {
    if (err) return callback(err);
    callback(null, user);
  });
};

export const User = Mongoose.model('shopping/user', userSchema);
