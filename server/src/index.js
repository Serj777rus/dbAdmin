import 'express-async-errors';
import { createApp } from './app.js';
import { initDatabase } from './db/sequelize.js';
import { appConfig } from './config/env.js';
import { logger } from './config/logger.js';
import './models/index.js';

const bootstrap = async () => {
  await initDatabase();
  const app = createApp();
  app.listen(appConfig.port, () => {
    logger.info(`Сервис запущен на порту ${appConfig.port}`);
  });
};

bootstrap().catch((error) => {
  logger.error(`Не удалось запустить сервис: ${error?.message || error}`);
  process.exit(1);
});

