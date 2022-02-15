import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

interface tokenData {
  id: number;
  name: string;
  email: string;
  token?: object;
}

export default {
  generateAccessToken: (data: tokenData) =>
    sign({ data }, process.env.ACCESS_SECRET, {
      expiresIn: 60 * 60 * 1000, // 1 hr
    }),
  sendAccessToken: (res: Response, data: tokenData, accessToken: string) => {
    res.header('Authorization', `Bearer ${accessToken}`);
    res.status(200).json({ data, message: 'OK' });
  },
  isAuthorized: (req: Request) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return null;
    }
    const accessToken = authorization.split('Bearer ')[1];
    try {
      return verify(accessToken, process.env.ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  },
};
