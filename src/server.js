import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';

import logger from './utils/logging';
import db from './utils/db';

import { verifyTokenMiddleware } from './utils/auth';
import * as Auth from './controllers/auth.controller';
import * as User from './controllers/user.controller';
import * as Konzi from './controllers/konzi.controller';

const api = express();

// middleware
api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

// require token - unless using whitelisted calls
api.use(verifyTokenMiddleware().unless({
    path: [
        { url: '/login', methods: 'POST' },
        { url: '/recover', methods: 'POST' },
        { url: '/konzi', methods: 'GET' }
    ]
}));

// Auth routes
api.route('/login').post(Auth.login);
api.route('/recover').post(Auth.recover);

// User CRUD
api.route('/user').get(User.list);
api.route('/user/:userId').get(User.get);
api.route('/user/:userId').put(User.put);
api.route('/user/').post(User.post);
api.route('/user/:userId').delete(User.del);

// Konzi CRUD
api.route('/konzi').get(Konzi.list);
api.route('/konzi/:konziId').get(Konzi.get);
api.route('/konzi/:konziId').put(Konzi.put);
api.route('/konzi/').post(Konzi.post);
api.route('/konzi/:konziId').delete(Konzi.del);

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
