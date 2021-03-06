import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

import { google } from 'googleapis';

import token from './token';

import { User } from '../entities/User';

import 'dotenv/config';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${
    process.env.CLIENT_DOMAIN +
    (process.env.CLIENT_PORT !== '80' ? ':' + process.env.CLIENT_PORT : '')
  }/callback` // callback 주소
);

const authURL = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    // 'https://www.googleapis.com/auth/youtube.readonly',
  ],
});

const usersController = {
  auth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.redirect(authURL);
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('LOGIN START');
      const code: string = req.body.code;

      const { tokens } = await oauth2Client.getToken(code);
      console.log('Get TOKENS');
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
      const googleUserInfoResponse = await oauth2.userinfo.get();

      const googleUserInfo = googleUserInfoResponse.data;
      console.log('Get USERINFO');

      const queryBuilder = await getConnection().createQueryBuilder(
        User,
        'user'
      );
      const check = await queryBuilder
        .where('user.email = :email', { email: googleUserInfo.email })
        .getOne();

      const tokenData = {
        id: -1,
        name: googleUserInfo.name,
        email: googleUserInfo.email,
      };
      if (!check) {
        const insert = await queryBuilder
          .insert()
          .into(User)
          .values([{ name: googleUserInfo.name, email: googleUserInfo.email }])
          .execute();
        console.log('새로운 계정 추가');
        tokenData['id'] = insert.raw.insertId;
      } else {
        console.log('기존 회원 로그인');
        tokenData['id'] = check.id;
      }

      const accessToken = token.generateAccessToken(tokenData);
      delete tokenData['token'];
      token.sendAccessToken(res, tokenData, accessToken);
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('Authorization', {
        // domain: process.env.SERVER_DOMAIN,
        path: '/',
        // sameSite: 'none',
        // secure: true,
        httpOnly: true,
      }); //쿠키 클리어
      res.status(200).send({ message: 'OK' });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
};

export default usersController;
