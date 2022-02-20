import 'reflect-metadata';

import { createConnection } from 'typeorm';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import router from './routes';

import 'dotenv/config';

const connectDB = () => {
  createConnection()
  .then(async (connection) => {
    console.log('DATABASE CONNECTED');
  })
  .catch((error) => {
    console.log(error)
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log("TRY RECONNECT")
      setTimeout(connectDB, 2000)
    } else {
      throw error;
    }
  });
}

connectDB()

const app = express();
app.set('port', process.env.SERVER_PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH'],
  })
);

app.use('/', router);

app.listen(app.get('port'), () => {
  console.log(`SERVER listens on PORT ${app.get('port')}`);
});
