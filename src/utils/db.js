import mongoose from 'mongoose';

// FIXME: use config
import config from './config';
import logger from './logging';

mongoose.Promise = global.Promise;

logger.info(`Database URI: ${config.databaseUri}`);

const connection = mongoose.connect(config.databaseUri);

connection
    .then((db) => {
        logger.info(
            `Successfully connected to ${config.databaseUri} MongoDB cluster in ${config.env} mode.`,
        );
        return db;
    })
    .catch((err) => {
        if (err.message.code === 'ETIMEDOUT') {
            logger.info('Attempting to re-establish database connection.');
            mongoose.connect(config.databaseUri);
        } else {
            logger.error('Error while attempting to connect to database:');
            logger.error(err);
        }
    });

export default connection;
