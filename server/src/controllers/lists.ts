import { Request, Response, NextFunction } from 'express';

import { google } from 'googleapis';

import token from './token';

import 'dotenv/config';

const SERVER_PORT = process.env.SERVER_PORT || 4000;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_DOMAIN}:${SERVER_PORT}/users/login/callback`
);

const listsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }
      oauth2Client.setCredentials(tokenData.data.token.youtube);
      const youtube = google.youtube({ auth: oauth2Client, version: 'v3' });
      const result = {};
      const listsData = [];
      let lists = await youtube.playlists.list({
        part: ['snippet'],
        maxResults: 25,
        mine: true,
      });
      while (true) {
        listsData.push(...lists.data.items);
        let nextPageToken: string | undefined;
        nextPageToken = lists.data.nextPageToken;
        if (!nextPageToken) {
          result['channel'] = {
            id: lists.data.items[0].snippet.channelId,
            title: lists.data.items[0].snippet.channelTitle,
          };
          break;
        }
        lists = await youtube.playlists.list({
          part: ['snippet'],
          maxResults: 50,
          mine: true,
          pageToken: nextPageToken,
        });
      }
      result['data'] = listsData.map((el) => {
        return {
          id: el.id,
          title: el.snippet.title,
          description: el.snippet.description,
        };
      });
      res.send(result);
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default listsController;
