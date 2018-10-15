import dotenv from 'dotenv';
import logger from './logging';

dotenv.config();

logger.info(`Loaded config for env ${process.env.ENV}`);

export default {
    env: process.env.ENV,
    databaseUri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    adminUser: process.env.API_ADMIN_USER,
    adminUserPass: process.env.API_ADMIN_PASS,
    adminUserEmail: process.env.API_ADMIN_EMAIL,
    adminUserName: process.env.API_ADMIN_NAME
};
