import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import logger from './logging';

dotenv.config();

logger.info(`Loaded config for env ${process.env.ENV}`);

// check if the upload directory exists, otherwise create it in the project root
const uploadPath = path.resolve(path.join(process.cwd(), process.env.UPLOAD_DIR));
try {
    fs.mkdirSync(uploadPath);
} catch (err) {
    if (err.code !== 'EEXIST') throw err;
}

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
    uploadPath
};
