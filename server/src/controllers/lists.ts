import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

import { google } from 'googleapis';

import token from './token';

import { User } from '../entities/User';
import { List } from '../entities/List';
import { UserList } from '../entities/UserList';
import { Quota } from '../entities/Quota';

import { TODAY } from '../util';
import 'dotenv/config';

// const SERVER_PORT = process.env.SERVER_PORT || 4000;

// const listsController = {
// getAll: async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const tokenData = token.isAuthorized(req);
//     if (!tokenData) {
//       return res.status(401).send('Not Authorized');
//     }
//     console.log(tokenData)
//     oauth2Client.setCredentials(tokenData.data.token.youtube);
//     const youtube = google.youtube({ auth: oauth2Client, version: 'v3' });
//     const result = {};
//     const listsData = [];
//     console.log("GET LISTS")
//     let lists = await youtube.playlists.list({
//       part: ['snippet'],
//       maxResults: 25,
//       mine: true,
//     });
//     while (true) {
//       listsData.push(...lists.data.items);
//       let nextPageToken: string | undefined;
//       nextPageToken = lists.data.nextPageToken;
//       if (!nextPageToken) {
//         result['channel'] = {
//           id: lists.data.items[0].snippet.channelId,
//           title: lists.data.items[0].snippet.channelTitle,
//         };
//         break;
//       }
//       lists = await youtube.playlists.list({
//         part: ['snippet'],
//         maxResults: 50,
//         mine: true,
//         pageToken: nextPageToken,
//       });
//     }
//     console.log(listsData[0])
//     result['data'] = listsData.map((el) => {
//       return {
//         id: el.id,
//         title: el.snippet.title,
//         description: el.snippet.description,
//       };
//     });
//     res.json({ result, message: "OK" });
//   } catch (err) {
//     res.status(500).send({
//       message: 'Internal server error',
//     });
//     next(err);
//   }
// },
//}

const listsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }
      const { data } = tokenData;
      const { email } = data;
      const listAll = await getConnection()
        .createQueryBuilder(User, 'user')
        .innerJoinAndSelect('user.userLists', 'userLists')
        .innerJoinAndSelect('userLists.list', 'list')
        .where('user.email = :email', { email: email })
        .getMany();
      const resData = {
        username: data.name,
        list: listAll[0].userLists.map((x) => x.list),
      };
      res.status(200).json({ data: resData, message: 'OK' });
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
      console.log("RESPONSE")
      console.log(result.data.items[0])
      await getConnection()
        .createQueryBuilder()
        .update(Quota)
        .set({
          quota: () => 'quota + 100',
        })
        .where('date_utc = :date', { date: TODAY })
        .execute();

      const resultData = result.data.items.map(el => {
        return {
          title: el.snippet.title,
          href: el.id.playlistId,
          thumbnail: el.snippet.thumbnails.high,
          channelTitle: el.snippet.channelTitle,
          channelHref: el.snippet.channelId,
          channelDesc: el.snippet.description,
        }
      })

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
    }
    
    catch (err) {
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
      const { id } = tokenData.data;
      const { name, href } = req.body;
      const insertList = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(List)
        .values({
          userId: id,
          name,
          href,
        })
        .execute();
      const insertUserList = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserList)
        .values({
          userId: id,
          listId: insertList.raw.insertId,
        })
        .execute();

      res.status(201).json({
        data: { ...insertList.generatedMaps[0], name, href },
        message: 'OK',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default listsController;
