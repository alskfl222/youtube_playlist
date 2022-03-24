import { Request, Response, NextFunction } from 'express';
import { Brackets, getConnection } from 'typeorm';

import { google } from 'googleapis';

import token from './token';

import { User } from '../entities/User';
import { List } from '../entities/List';
import { UserList } from '../entities/UserList';
import { Song } from '../entities/Song';
import { SongList } from '../entities/SongList';
import { Quota } from '../entities/Quota';

import { TODAY } from '../util';
import 'dotenv/config';

const listsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        const lists = await getConnection()
          .createQueryBuilder(List, 'list')
          .limit(10)
          .getMany();
        return res
          .status(200)
          .json({ username: undefined, lists, message: 'OK' });
      }
      const { name, email } = tokenData.data;
      const listAll = await getConnection()
        .createQueryBuilder(User, 'user')
        .innerJoinAndSelect('user.userLists', 'userLists')
        .innerJoinAndSelect('userLists.list', 'list')
        .where('user.email = :email', { email: email })
        .getMany();
      const resData = {
        username: name,
        lists:
          listAll.length > 0 ? listAll[0].userLists.map((x) => x.list) : [],
        message: 'OK',
      };
      res.status(200).json(resData);
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },

  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }

      const quota = await getConnection().createQueryBuilder(Quota, 'quota');
      const checkQuota = await quota
        .where('quota.date_utc = :date', { date: TODAY })
        .getOne();

      if (!checkQuota) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Quota)
          .values({
            dateUtc: TODAY,
            quota: 0,
          })
          .execute();
      }

      const q = req.query.q as string;
      const youtube = google.youtube({
        version: 'v3',
        auth: `${process.env.GOOGLE_API_KEY}`,
      });
      const result = await youtube.search.list({
        part: ['snippet'],
        type: ['playlist'],
        q,
        maxResults: 20,
      });
      console.log('RESPONSE');
      console.log(result.data.items[0]);
      await getConnection()
        .createQueryBuilder()
        .update(Quota)
        .set({
          quota: () => 'quota + 100',
        })
        .where('date_utc = :date', { date: TODAY })
        .execute();

      const resultData = result.data.items.map((el) => {
        return {
          title: el.snippet.title,
          href: el.id.playlistId,
          thumbnail: el.snippet.thumbnails.high,
          channelTitle: el.snippet.channelTitle,
          channelHref: el.snippet.channelId,
          channelDesc: el.snippet.description,
        };
      });

      res.status(201).json({
        quota: checkQuota ? checkQuota.quota + 100 : 100,
        data: resultData,
        message: 'OK',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },

  quota: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }

      const quota = await getConnection().createQueryBuilder(Quota, 'quota');
      const checkQuota = await quota
        .where('quota.date_utc = :date', { date: TODAY })
        .getOne();

      if (!checkQuota) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Quota)
          .values({
            dateUtc: TODAY,
            quota: 0,
          })
          .execute();
      }

      res.status(200).json({
        quota: checkQuota ? checkQuota.quota : 0,
        message: 'OK',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },

  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }
      const quota = await getConnection().createQueryBuilder(Quota, 'quota');
      const checkQuota = await quota
        .where('quota.date_utc = :date', { date: TODAY })
        .getOne();
      if (!checkQuota) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Quota)
          .values({
            dateUtc: TODAY,
            quota: 0,
          })
          .execute();
      }
      let countQuota = checkQuota ? checkQuota.quota : 0;
      const { id } = tokenData.data;
      const { name, href } = req.body;

      let checkList = await getConnection()
        .createQueryBuilder(List, 'list')
        .where('list.href = :href', { href })
        .getOne();

      let insertList;
      if (!checkList) {
        insertList = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(List)
          .values({
            name,
            href,
          })
          .execute();
      }
      let checkUserList = await getConnection()
        .createQueryBuilder(UserList, 'userList')
        .where('userList.list_id = :list_id', {
          list_id: checkList ? checkList.id : insertList.raw.insertId,
        })
        .andWhere('userList.user_id = :user_id', { user_id: id })
        .getOne();
      
      console.log(checkList)
      if (!checkUserList) {
        let insertUserList = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(UserList)
          .values({
            userId: id,
            listId: checkList ? checkList.id : insertList.raw.insertId,
          })
          .execute();
      }

      const songs = [];
      let nextPage: undefined | string;

      const youtube = google.youtube({
        version: 'v3',
        auth: `${process.env.GOOGLE_API_KEY}`,
      });
      while (true) {
        const result = await youtube.playlistItems.list({
          playlistId: href,
          part: ['snippet'],
          maxResults: 50,
          pageToken: nextPage === undefined ? null : nextPage,
        });
        const items = result.data.items.map((el) => {
          return {
            name: el.snippet.title,
            href: el.snippet.resourceId.videoId,
            uploader: el.snippet.videoOwnerChannelTitle || '',
            uploader_href: el.snippet.videoOwnerChannelId || '',
          };
        });
        songs.push(...items);
        await getConnection()
          .createQueryBuilder()
          .update(Quota)
          .set({
            quota: () => 'quota + 1',
          })
          .where('date_utc = :date', { date: TODAY })
          .execute();
        countQuota++;
        nextPage = result.data.nextPageToken;
        if (!nextPage) break;
      }
      let songQueryBuilder = await getConnection().createQueryBuilder(
        Song,
        'song'
      );
      let songListQueryBuilder = await getConnection().createQueryBuilder(
        SongList,
        'songList'
      );
      songs.forEach(async (song, idx) => {
        const checkSong = await songQueryBuilder
          .where('song.href = :href', { href: song.href })
          .getOne();
        let insertSong;
        if (!checkSong) {
          insertSong = await songQueryBuilder
            .insert()
            .into(Song)
            .values(song)
            .execute();
        }
        if (!checkList) {
          await songListQueryBuilder
            .insert()
            .into(SongList)
            .values({
              songId: checkSong ? checkSong.id : insertSong.raw.insertId,
              listId: insertList.raw.insertId,
            })
            .execute();
        }
      });

      res.status(201).json({
        data: { name, href },
        message: 'OK',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }
      const hrefs = req.body;
      const { email } = tokenData.data;
      let checkUserList = await getConnection()
        .createQueryBuilder(List, 'list')
        .innerJoinAndSelect('list.userLists', 'userLists')
        .innerJoinAndSelect('userLists.user', 'user')
        .where('user.email = :email', { email })
        .andWhere('list.href IN (:...hrefs)', { hrefs })
        .getMany();
      let deleteUserList = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserList)
        .where('id = :id', {
          id: checkUserList.map((check) => check.userLists[0].id),
        })
        .execute();
      console.log(deleteUserList)
      res.status(200).json({ message: 'OK' });
    } catch (err) {
      res.status(500).json({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default listsController;
