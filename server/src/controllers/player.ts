import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import { google } from 'googleapis';
import token from './token';
import { List } from '../entities/List';
import { Quota } from '../entities/Quota';
import { TODAY } from '../util';
import 'dotenv/config';

const playerController = {
  getPlayerItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = token.isAuthorized(req);
      if (!tokenData) {
        return res.status(401).send('Not Authorized');
      }
      console.log(req.body);

      const resData = [];
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
      let nextPage: string;
      for (let href of req.body.hrefs) {
        const check = await getConnection()
          .createQueryBuilder(List, 'list')
          .where('list.href = :href', { href: req.body.href })
          .getMany();
        console.log(check);

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
              title: el.snippet.title,
              thumbnails: el.snippet.thumbnails,
              songHref: el.snippet.resourceId.videoId,
              videoOwnerChannelTitle: el.snippet.videoOwnerChannelTitle,
              videoOwnerChannelId: el.snippet.videoOwnerChannelId,
            };
          });
          resData.push(...items);
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
