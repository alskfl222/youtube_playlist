import 'reflect-metadata';
import http from 'http';

import { createConnection } from 'typeorm';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as SocketIO from 'socket.io';

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
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true },
});

app.set('port', process.env.SERVER_PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
  })
);

io.on('connection', (socket) => {
  console.log('SOCKET CONNECTED?');
  socket.on('sendMessage', (message) => {
    socket.emit('relayMessage', message)
  })
  socket.on('disconnect', () => {
    console.log('SOCKET DISCONNECT');
  });
});

app.use('/', router);

server.listen(app.get('port'), () => {
  console.log(`SERVER listens on PORT ${app.get('port')}`);
});
