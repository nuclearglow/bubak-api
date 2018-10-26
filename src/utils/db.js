import mongoose from 'mongoose';

import config from './config';
import logger from './logging';

// only call this function once - when the application starts
const initializeMoongoose = async () => {
    try {
        mongoose.Promise = global.Promise;
        const db = await mongoose.connect(config.databaseUri, { useNewUrlParser: true });
        logger.info(`Successfully connected to MongoDB cluster in ${config.env} mode.`);

        // If the connection throws an error
        mongoose.connection.on('error', (err) => {
            logger.error(`Mongoose default connection error: ${err}`);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose default connection disconnected');
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                logger.warn('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        return db;
    } catch (err) {
        if (err.message.code === 'ETIMEDOUT') {
            logger.info('Attempting to re-establish database connection.');
            await mongoose.connect(config.databaseUri);
        } else {
            logger.error('Error while attempting to connect to database:');
            logger.error(err);
        }
        return null;
    }
};

export default initializeMoongoose;
