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
    res.cookie('Authorization', `Bearer ${accessToken}`, {
      domain: 'alskfl.xyz',
      path: '/',
      maxAge: 10 * 60 * 60 * 1000, // 1 + 9 hr
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    res.json({ data, message: "OK" });
  },
  isAuthorized: (req: Request) => {
    const authorization = req.cookies.Authorization;
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
