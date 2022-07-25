import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { connectDB } from './db/database.js';
import { User } from './model/user.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'email not found',
      });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: 'Wrong password',
        });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

connectDB()
  .then(() => {
    console.log('Mongo DB Connected');
    app.listen(config.host.port);
  })
  .catch(console.error);
