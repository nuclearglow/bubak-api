import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import jwt from 'express-jwt';

import * as User from './controllers/user';
import logger from './utils/logging';
import db from './utils/db';

// express
const api = express();
// middleware
api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
// api
// api.use(
//     jwt({ secret: 'FIXME' }).unless({
//         path: [
//             '/',
//             '/about',
//             '/auth/signup',
//             '/auth/login',
//             '/auth/forgot-password',
//             '/auth/reset-password'
//         ]
//     })
// );

api.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Missing authentication credentials.');
    }
});

api.get('/about', (req, res) => {
    res.json({ anarchy: true });
});


// User CRUD
api.route('/user').get(User.list);
api.route('/user/:userId').get(User.get);
api.route('/user/:userId').put(User.put);
api.route('/user/').post(User.post);
api.route('/user/:userId').delete(User.del);

// start
api.listen(8080, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
    } else {
        logger.info('Now listening on: http://localhost:8080');
        // check if admin user exists
        User.init();
    }
});

export default api;
