import { Request, Response, NextFunction } from 'express';
import { Brackets, getConnection } from 'typeorm';
import { google } from 'googleapis';
import { Song } from '../entities/Song';
import { List } from '../entities/List';
import { Quota } from '../entities/Quota';
import { TODAY } from '../util';
import 'dotenv/config';

const playerController = {
  id: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hrefs = req.body;
      let checkId = await getConnection()
        .createQueryBuilder(List, 'list')
        .innerJoinAndSelect('list.playerLists', 'playerLists')
        .innerJoinAndSelect('playerLists.player', 'player')
        .where(
          new Brackets((qb) => {
            hrefs.forEach((href) => {
              qb.where('list.href = :href', { href });
            });
          })
        )
        .getMany();
      console.log(checkId);
      if (!checkId) {
        
      }

      res.status(200).json({ data: req.body, message: 'OK' });
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
