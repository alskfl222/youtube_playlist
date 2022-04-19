import 'reflect-metadata';
import http from 'http';
import { createConnection } from 'typeorm';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as SocketIO from 'socket.io';
import socketEvent from './controllers/chat';
import router from './routes';
import 'dotenv/config';

const connectDB = () => {
  createConnection()
    .then(async (connection) => {
      console.log('DATABASE CONNECTED');
    })
    .catch((error) => {
      console.log(error);
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('TRY RECONNECT');
        setTimeout(connectDB, 2000);
      } else {
        throw error;
      }
    });
};

connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIO.Server(server, {
  cors: {
    origin: `${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io',
  transports: ['websocket'],
});

app.set('port', process.env.SERVER_PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [`${process.env.CLIENT_DOMAIN + ':' + process.env.CLIENT_PORT}`],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
  })
);

io.on('connection', (socket) => {
  console.log('SOCKET CONNECTED');
  socketEvent(socket);
});

app.use('/', router);

server.listen(app.get('port'), () => {
  console.log(`SERVER listens on PORT ${app.get('port')}`);
});
