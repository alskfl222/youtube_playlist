import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

// import { google } from 'googleapis';

import token from './token';

import { List } from '../entities/List';

import 'dotenv/config';

// const SERVER_PORT = process.env.SERVER_PORT || 4000;

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.SERVER_DOMAIN}:${SERVER_PORT}/users/login/callback`
// );

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
      const queryBuilder = await getConnection().createQueryBuilder(
        List,
        'list'
      );
      const listAll = await queryBuilder.getMany();
      res.status(200).json({ data: listAll, message: 'OK' });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default listsController;
