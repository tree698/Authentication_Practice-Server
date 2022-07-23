import express from 'express';
import { config } from './config.js';
import { connectDB } from './db/database.js';
import { User } from './model/user.js';

const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.post('/register', (req, res, next) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

connectDB()
  .then(() => {
    console.log('Mongo DB Connected');
    app.listen(config.host.port);
  })
  .catch(console.error);
