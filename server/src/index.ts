import 'reflect-metadata';

import { createConnection } from 'typeorm';
import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'

import router from './routes'

import 'dotenv/config';

createConnection()
  .then(async (connection) => {
    console.log('DATABASE CONNECTED');

    const app = express();
    app.set('port', process.env.SERVER_PORT || 4000)
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      origin: "*",
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS', 'PATCH'],
    }))
    app.use(express.json());

    app.use('/', router)

    app.listen(app.get('port'), () => {
        console.log(`SERVER listens on PORT ${app.get('port')}`)
    })
  })
  .catch((error) => console.log(error));



