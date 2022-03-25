import { Request, Response, NextFunction } from 'express';
import { Brackets, getConnection } from 'typeorm';
import { google } from 'googleapis';
import { Song } from '../entities/Song';
import { List } from '../entities/List';
import { Quota } from '../entities/Quota';
import { Player } from '../entities/Player';
import { PlayerList } from '../entities/PlayerList';
import { TODAY } from '../util';
import 'dotenv/config';

const playerController = {
  id: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hrefs = req.body;
      hrefs.sort();
      let playerId: undefined | number;
      let toCheckPlayerId = await getConnection()
        .createQueryBuilder(Player, 'player')
        .innerJoin('player.playerLists', 'playerLists')
        .innerJoin('playerLists.list', 'list')
        .select(['player.id'])
        .where('list.href IN (:...hrefs)', { hrefs })
        .getMany()
        .then((res) => res.map((player) => player.id));
      for (let checkPlayerId of toCheckPlayerId) {
        let checkPlayerList = await getConnection()
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
        if (checkPlayerList === true) {
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
      res.status(200).json({ playerId: playerId ? playerId : insertPlayerId.raw.insertId, message: 'OK' });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
  items: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const resData = [];
      for (let href of req.body.hrefs) {
        let getSongs = await getConnection()
          .createQueryBuilder(List, 'list')
          .innerJoinAndSelect('list.songLists', 'songLists')
          .innerJoinAndSelect('songLists.song', 'song')
          .where('list.href = :href', { href })
          .getMany();
        const songData = getSongs[0].songLists.map((songList) => {
          return songList.song;
        });
        resData.push(...songData);
      }

      res.json({
        data: resData,
        message: 'ok',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default playerController;
