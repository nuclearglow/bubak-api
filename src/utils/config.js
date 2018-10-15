import dotenv from 'dotenv';
import logger from './logging';

dotenv.config();

logger.info('Loaded dotenv config');

export default {
    env: process.env.ENV,
    databaseUri: process.env.DB_HOST
};
