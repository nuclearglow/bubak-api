import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';

import logger from './utils/logging';
import initializeMoongoose from './utils/db';
import { verifyTokenMiddleware } from './utils/auth';

import * as Auth from './controllers/auth.controller';
import * as User from './controllers/user.controller';
import * as Konzi from './controllers/konzi.controller';

// connect to db
initializeMoongoose();
// set up api
const api = express();
// set up middleware
api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
// require a token - unless using whitelisted calls
api.use(verifyTokenMiddleware().unless({
    path: [
        { url: '/login', methods: 'POST' }, // login is public
        { url: '/recover', methods: 'POST' }, // forgot password is oublix
        /\/reset\/[0-9a-fA-F]{128}/, // allow reset URL with recovery code from email
        { url: '/konzi', methods: 'GET' } // konzis are public
    ]
}));
// Auth routes
api.route('/login').post(Auth.login);
api.route('/recover').post(Auth.recover);
api.route('/reset/:recoveryCode').post(Auth.reset);
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
// start server
api.listen(8080, (err) => {
    if (err) {
        logger.error(`Error starting server: ${err}`);
    } else {
        logger.info('Now listening on: http://localhost:8080');
        // check if admin user exists
        User.init();
    }
});
