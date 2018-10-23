import chalk from 'chalk';

// TODO: for production, also add rotating logs here

const logger = {
    info: (message) => {
        console.log(chalk.cyan(`INFO: ${message}`));
    },
    warn: (message) => {
        console.log(chalk.yellow(`WARN: ${message}`));
    },
    error: (message) => {
        console.error(chalk.red(`ERROR: ${message}`));
    }
};

export default logger;
