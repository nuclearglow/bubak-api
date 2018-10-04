import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import compression from 'compression';
import jwt from 'express-jwt';

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

// api.use(expressWinston.logger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         })
//     ],
//     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
//     msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//     ignoreRoute: () => false // optional: allows to skip some log messages based on request and/or response
// }));

// api.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         })
//     ]
// }));

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
