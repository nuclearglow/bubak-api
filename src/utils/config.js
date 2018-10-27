import dotenv from 'dotenv';

import { createFolder } from './helpers';

dotenv.config();

export default {
    env: process.env.ENV,
    serverUrl: `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_URL}`,
    databaseUri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    adminUser: process.env.API_ADMIN_USER,
    adminUserPass: process.env.API_ADMIN_PASS,
    adminUserEmail: process.env.API_ADMIN_EMAIL,
    adminUserName: process.env.API_ADMIN_NAME,
    jwtSecret: process.env.JWT_SECRET,
    uploadDir: process.env.UPLOAD_DIR,
    uploadPath: createFolder(process.env.UPLOAD_DIR),
    logPath: createFolder(process.env.LOG_DIR)
};
