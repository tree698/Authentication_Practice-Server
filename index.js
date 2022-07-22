import express from 'express';
import { config } from './config.js';
import { connectDB } from './db/database.js';

const app = express();

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

connectDB()
  .then(() => {
    console.log('Mongo DB Connected');
    app.listen(config.host.port);
  })
  .catch(console.error);
