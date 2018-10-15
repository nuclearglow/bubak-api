import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
// import expressWinston from 'express-winston';
import compression from 'compression';
import jwt from 'express-jwt';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/trace.log' })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

logger.info('Setting up Express Server');

const api = express();

api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

api.use(
    jwt({ secret: 'FIXME' }).unless({
        path: [
            '/',
            '/about',
            '/auth/signup',
            '/auth/login',
            '/auth/forgot-password',
            '/auth/reset-password'
        ]
    })
);

api.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Missing authentication credentials.');
    }
});

api.get('/about', (req, res) => {
    res.json({ anarchy: true });
});

api.listen(8080, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
    } else {
        console.info('Now listening on: http://localhost:8080');
    }
    // require('./utils/db');
    // fs.readdirSync(path.join(__dirname, 'routes')).map((file) => {
    //     require(`./routes/${file}`)(api);
    // });
});

export default api;
