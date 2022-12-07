import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as Sentry from "@sentry/node";
import * as Tracing from '@sentry/tracing';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
   
    Logger.debug(req.query)
    Logger.debug(req.body)
    Logger.debug(req.originalUrl)

    next()

  }
}
