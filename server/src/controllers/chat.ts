import { getConnection } from 'typeorm';
import { Chat } from '../entities/Chat';
import * as SocketIO from 'socket.io';
import { verify } from 'jsonwebtoken';

export default async function socketEvent(socket: SocketIO.Socket) {
  const chat = getConnection().createQueryBuilder(Chat, 'chat');

  socket.on('join', (playerId) => {
    console.log(playerId);
    socket.join(playerId);
    socket.emit('joinRoom', `JOIN PLAYER ${playerId}`);
  });
  socket.on('sendChat', (message, playerId) => {
    console.log(playerId, message);
    const cookie = socket.handshake.headers.cookie as string;
    let username: string;
    let accessToken: string;
    try {
      accessToken = cookie.split('Bearer%20')[1];
    } catch {}
    if (accessToken) {
      username = verify(accessToken, process.env.ACCESS_SECRET).data.name
    }
    const insertNewChat = chat.insert().into(Chat);
    socket.emit('newChat', {username, message});
  });
  socket.on('disconnect', () => {
    console.log('SOCKET DISCONNECT');
  });
}
