import { getConnection } from 'typeorm';
import { Chat } from '../entities/Chat';
import { ChatPlayer } from '../entities/ChatPlayer';
import * as SocketIO from 'socket.io';

export default async function socketEvent(socket: SocketIO.Socket) {
  const qb = await getConnection().createQueryBuilder();

  socket.on('join', async (playerId, userId) => {
    console.log(playerId, userId);
    socket.join(playerId);
    const before = await getConnection()
      .createQueryBuilder(Chat, 'chat')
      .innerJoin('chat.chatPlayers', 'chatPlayers')
      .innerJoin('chatPlayers.player', 'player')
      .innerJoin('chat.user', 'user')
      .select(['chat.userId', 'chat.chat', 'chat.addedAt', 'user.name'])
      .where('player.id = :playerId', { playerId })
      .getMany();
    const chats = before.map((chat) => {
      return {
        userId: chat.userId,
        username: chat.user.name,
        chat: chat.chat,
        addedAt: chat.addedAt,
      };
    });
    socket.emit('joinRoom', {
      chats,
      message: `USER ${userId} JOIN PLAYER ${playerId}`,
    });
  });
  socket.on('sendChat', async (playerId, userId, username, chat) => {
    console.log(playerId, userId, username, chat);
    try {
      const insertChat = await qb
        .insert()
        .into(Chat)
        .values({
          userId,
          chat,
        })
        .execute();
      console.log(insertChat);
      const insertChatPlayer = await qb
        .insert()
        .into(ChatPlayer)
        .values({
          playerId,
          chatId: insertChat.raw.insertId,
        })
        .execute();
      socket.emit('newChat', { userId, username, chat, addedAt: insertChat.generatedMaps[0].addedAt });
    } catch {
      socket.emit('error', 'internal server error');
    }
  });
  socket.on('disconnect', () => {
    console.log('SOCKET DISCONNECT');
  });
}
