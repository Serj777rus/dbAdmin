import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/env.js';
import { logger } from '../config/logger.js';

export const sequelize = new Sequelize({
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg),
  define: {
    underscored: true,
    paranoid: false
  }
});

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Подключение к служебной базе данных установлено');
    await sequelize.sync();
    logger.info('База данных синхронизирована');
  } catch (error) {
    logger.error(`Ошибка подключения к базе: ${error?.message || error}`);
    throw error;
  }
};

