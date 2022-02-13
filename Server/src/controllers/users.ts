import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

import token from './token';

import { User } from '../entities/User';

const usersController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body;
      const user = await getConnection()
        .createQueryBuilder(User, 'user')
        .where('user.name = :name AND user.email = :email', { name, email })
        .getOne();
      if (user) {
        const accessToken = token.generateAccessToken(user);
        token.sendAccessToken(res, user, accessToken);
      } else {
        res.status(401).send('Invalid ID or password');
      }
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  },
  verify: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = token.isAuthorized(req)
      res.status(200).json(data)
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error',
      });
      next(err);
    }
  }
};

export default usersController;
