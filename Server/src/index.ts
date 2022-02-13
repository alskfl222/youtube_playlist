import 'reflect-metadata';

import { createConnection } from 'typeorm';
import express from 'express';
import cors from 'cors'
// const cookieParser = require('cookie-parser');

import router from './routes'

import 'dotenv/config';

createConnection()
  .then(async (connection) => {
    console.log('DATABASE CONNECTED');

    const app = express();
    app.set('port', process.env.SERVER_PORT || 4000)
    app.use(cors())
    app.use(express.json());

    app.use('/', router)

    app.listen(app.get('port'), () => {
        console.log(`SERVER listens on PORT ${app.get('port')}`)
    })
  })
  .catch((error) => console.log(error));



