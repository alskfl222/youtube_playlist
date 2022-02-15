import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

import { google } from 'googleapis';
import { GetTokenOptions } from 'google-auth-library';

import token from './token';

import { User } from '../entities/User';

import 'dotenv/config';

const SERVER_PORT = process.env.SERVER_PORT || 4000;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_DOMAIN}:${SERVER_PORT}/users/login/callback`
);

const authURL = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/youtube.readonly',
  ],
});

const usersController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.redirect(authURL);
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
  callback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationCode: GetTokenOptions['code'] = req.query
        .code as string;
      const { tokens } = await oauth2Client.getToken(authorizationCode);
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
      const userinfo = await oauth2.userinfo.get();
      const queryBuilder = await getConnection().createQueryBuilder(User, 'user');
      const check = await queryBuilder
        .where('user.email = :email', { email: userinfo.data.email })
        .getOne();

      const tokenData = {
        id: -1,
        name: userinfo.data.name,
        email: userinfo.data.email,
        token: {
          youtube: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          },
        },
      };
      if (!check) {
        const insert = await queryBuilder
          .insert()
          .into(User)
          .values([{ name: userinfo.data.name, email: userinfo.data.email }])
          .execute();
        console.log('새로운 계정 추가');
        tokenData['id'] = insert.raw.insertId;
      } else {
        console.log('기존 회원 로그인');
        tokenData['id'] = check.id;
      }

      const accessToken = token.generateAccessToken(tokenData)
      delete tokenData['token']
      token.sendAccessToken(res, tokenData, accessToken)
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default usersController;
