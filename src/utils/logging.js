import chalk from 'chalk';

// TODO: for production, also add rotating logs here

const logger = {
    info: (message) => {
        // eslint-disable-next-line no-console
        console.log(chalk.cyan(`INFO: ${message}`));
    },
    warn: (message) => {
        // eslint-disable-next-line no-console
        console.log(chalk.yellow(`WARN: ${message}`));
    },
    error: (message) => {
        // eslint-disable-next-line no-console
        console.error(chalk.red(`ERROR: ${message}`));
    }
};

export default logger;
