import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

import { google, youtube_v3 } from 'googleapis';

import token from './token';

import { User } from '../entities/User';
import { List } from '../entities/List';
import { UserList } from '../entities/UserList';
import { Quota } from '../entities/Quota';

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
      const today = new Date();
      today.setHours(today.getHours() - 9);
      const TODAY = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const quota = await getConnection().createQueryBuilder(Quota, 'quota');
      const checkQuota = await quota
        .where('quota.date_utc = :date', { date: TODAY })
        .getOne();
        
      console.log(checkQuota)

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
      await getConnection()
        .createQueryBuilder()
        .update(Quota)
        .set({
          quota: () => 'quota + 1',
        })
        .where('date_utc = :date', { date: TODAY })
        .execute();

      res.status(201).json({
        quota: checkQuota.quota + 1,
        data: result.data.items.map(el => el.snippet),
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
        data: { list: { ...insertList.generatedMaps[0], name, href } },
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
