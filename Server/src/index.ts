import 'reflect-metadata';

import { createConnection } from 'typeorm';
import * as express from 'express';
import 'dotenv/config';

import { Song } from './entities/Song'

createConnection()
  .then(async (connection) => {
    console.log('DATABASE CONNECTED');
    return connection
  })
  .then(async (connection) => {
    const songs = await connection.manager.find(Song);
    console.log(songs)
  })
  .catch((error) => console.log(error));



const app = express();
app.set('port', process.env.SERVER_PORT || 4000)

app.listen(app.get('port'), () => {
    console.log(`SERVER listens on PORT ${app.get('port')}`)
})