import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './api/routes/index.js';
import { appConfig, securityConfig } from './config/env.js';
import { errorHandler } from './api/middlewares/errorHandler.js';

export const createApp = () => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: appConfig.frontendUrl,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.use(
    rateLimit({
      windowMs: securityConfig.rateLimitWindowMs,
      max: securityConfig.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Превышен лимит запросов, попробуйте позже'
    })
  );

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};

