import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import { Song } from '../entities/Song';
import { List } from '../entities/List';
import { Quota } from '../entities/Quota';
import { Player } from '../entities/Player';
import { PlayerList } from '../entities/PlayerList';
import { Chat } from '../entities/Chat';
import { ChatPlayer } from '../entities/ChatPlayer';
import { TODAY } from '../util';
import 'dotenv/config';

const playerController = {
  id: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hrefs = req.body;
      hrefs.sort();
      let playerId: undefined | number;
      const toCheckPlayerId = await getConnection()
        .createQueryBuilder(Player, 'player')
        .innerJoin('player.playerLists', 'playerLists')
        .innerJoin('playerLists.list', 'list')
        .select(['player.id'])
        .where('list.href IN (:...hrefs)', { hrefs })
        .getMany()
        .then((res) => res.map((player) => player.id));
      for (let checkPlayerId of toCheckPlayerId) {
        const isPlayerList = await getConnection()
          .createQueryBuilder(List, 'list')
          .innerJoin('list.playerLists', 'playerLists')
          .where('playerLists.playerId = :playerId', {
            playerId: checkPlayerId,
          })
          .getMany()
          .then((res) => res.map((list) => list.href))
          .then((check) => {
            if (check.length !== hrefs.length) {
              return false;
            }
            check.sort();
            for (let i = 0; i < check.length; i++) {
              if (check[i] !== hrefs[i]) return false;
            }
            return true;
          });
        if (isPlayerList === true) {
          playerId = checkPlayerId;
          break;
        }
      }
      let insertPlayerId;
      if (!playerId) {
        let listIds = await getConnection()
          .createQueryBuilder(List, 'list')
          .select('list.id')
          .addSelect('list.name')
          .where('list.href IN (:...hrefs)', { hrefs })
          .getMany();
        insertPlayerId = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Player)
          .values({})
          .execute();
        let insertPlayerList = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(PlayerList)
          .values(
            listIds.map((list) => {
              return {
                playerId: insertPlayerId.raw.insertId,
                listId: list.id,
              };
            })
          )
          .execute();
      }
      res.status(200).json({
        playerId: playerId ? playerId : insertPlayerId.raw.insertId,
        message: 'OK',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
  items: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const songs = await getConnection()
        .createQueryBuilder(Song, 'song')
        .innerJoin('song.songLists', 'songLists')
        .innerJoin('songLists.list', 'list')
        .innerJoin('list.playerLists', 'playerLists')
        .innerJoin('playerLists.player', 'player')
        .where('player.id = :id', { id })
        .getMany();
      console.log('songs[0]: ', songs[0])
      res.json({
        data: songs,
        message: 'ok',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },

  chatDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { userId, addedAt } = req.body;
      addedAt = new Date(addedAt);
      const checkChat = await getConnection()
        .createQueryBuilder(Chat, 'chat')
        .innerJoin('chat.chatPlayers', 'chatPlayers')
        .select(['chat.id', 'chatPlayers.id'])
        .where('chat.userId = :userId', { userId })
        .andWhere('chat.addedAt = :addedAt', { addedAt })
        .getOne();
      const chatId = checkChat.id;
      const chatPlayersId = checkChat.chatPlayers[0].id;
      console.log(chatId, chatPlayersId);
      let deleteChatPlayers = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ChatPlayer)
        .where('id = :id', {
          id: chatPlayersId,
        })
        .execute();
      console.log(deleteChatPlayers)
      let deleteChat = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Chat)
        .where('id = :id', {
          id: chatId,
        })
        .execute();
      console.log(deleteChat)

      res.status(200).send('OK');
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default playerController;
