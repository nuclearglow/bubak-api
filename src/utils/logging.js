import chalk from 'chalk';
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import config from './config';

const logfile = fs.createWriteStream(path.resolve(path.join(config.logPath, 'error.log')), { flags: 'a' });

const logger = {
    info: (message) => {
        // eslint-disable-next-line no-console
        console.log(chalk.cyan(`INFO: ${message}`));
        logfile.write(`${moment().format('YYYY-MM-DD HH:MM:SS')} INFO ${message}\n`);
    },
    warn: (message) => {
        // eslint-disable-next-line no-console
        console.log(chalk.yellow(`WARN: ${message}`));
        logfile.write(`${moment().format('YYYY-MM-DD  HH:MM:SS')} WARN ${message}\n`);
    },
    error: (message) => {
        // eslint-disable-next-line no-console
        console.error(chalk.red(`ERROR: ${message}`));
        logfile.write(`${moment().format('YYYY-MM-DD ERROR HH:MM:SS')}: ${message}˜\n`);
    }
};

export default logger;
