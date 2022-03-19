import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import { google } from 'googleapis';
import token from './token';
import { Song } from '../entities/Song';
import { List } from '../entities/List';
import { SongList } from '../entities/SongList';
import { Quota } from '../entities/Quota';
import { TODAY } from '../util';
import 'dotenv/config';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}/callback` // callback 주소
);

const playerController = {
  getPlayerItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }
      console.log(req.body);
      const check = await getConnection()
        .createQueryBuilder(Song, 'song')
        .innerJoinAndSelect('song.songLists', 'songLists')
        .innerJoinAndSelect('songLists.list', 'list')
        .where('list.href = :href', { href: req.body.href })
        .getMany();
      console.log(check);
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
      const youtube = google.youtube({
        version: 'v3',
        auth: `${process.env.GOOGLE_API_KEY}`,
      });
      const resData = [];
      const result = await youtube.playlistItems.list({
        playlistId: req.body.href,
        part: ['snippet'],
        maxResults: 50,
      });
      const items = result.data.items.map((el) => {
        return { 
          title : el.snippet.title,
          thumbnails : el.snippet.thumbnails.default.url,
          songHref : el.snippet.resourceId.videoId,
          videoOwnerChannelTitle : el.snippet.videoOwnerChannelTitle,
          videoOwnerChannelId : el.snippet.videoOwnerChannelId,
        }
      });
      console.log(items)
      resData.push(items);
      await getConnection()
        .createQueryBuilder()
        .update(Quota)
        .set({
          quota: () => 'quota + 1',
        })
        .where('date_utc = :date', { date: TODAY })
        .execute();
      countQuota++;
      let nextPage = result.data.nextPageToken;

      while (nextPage) {
        const nextResult = await youtube.playlistItems.list({
          playlistId: req.body.href,
          part: ['snippet'],
          maxResults: 50,
          pageToken: nextPage,
        });
        const nextItems = nextResult.data.items.map((el) => {
          return { 
            title : el.snippet.title,
            thumbnails : el.snippet.thumbnails.default.url,
            songHref : el.snippet.resourceId.videoId,
            videoOwnerChannelTitle : el.snippet.videoOwnerChannelTitle,
            videoOwnerChannelId : el.snippet.videoOwnerChannelId,
          }
        });
        resData.push(nextItems);
        await getConnection()
          .createQueryBuilder()
          .update(Quota)
          .set({
            quota: () => 'quota + 1',
          })
          .where('date_utc = :date', { date: TODAY })
          .execute();
        countQuota++;
        nextPage = nextResult.data.nextPageToken;
        if (!nextPage) break;
      }

      res.json({
        quota: countQuota,
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
