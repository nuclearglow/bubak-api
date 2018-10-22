import validator from 'validator';

import config from '../utils/config';
import User from '../models/user';
import logger from '../utils/logging';

// list all users
export const list = (req, res) => {
    const query = req.query || {};

    User.apiQuery(query)
        .select('name email username')
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            logger.error(err);
            res.status(422).send(err.errors);
        });
};

// get a single user
export const get = (req, res) => {
    User.findById(req.params.userId)
        .select('email username name active admin')
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            logger.error(err);
            res.status(422).send(err.errors);
        });
};

export const put = (req, res) => {
    const data = req.body || {};

    if (data.email && !validator.isEmail(data.email)) {
        return res.status(422).send('Invalid email address.');
    }

    if (data.username && !validator.isAlphanumeric(data.username)) {
        return res.status(422).send('Usernames must be alphanumeric.');
    }

    User.findByIdAndUpdate({ _id: req.params.userId }, data, { new: true })
        .then((user) => {
            if (!user) {
                return res.sendStatus(404);
            }
            // FIXME, how to do this better
            user.password = undefined;
            user.recoveryCode = undefined;

            return res.json(user);
        })
        .catch((err) => {
            logger.error(err);
            return res.status(422).send(err.errors);
        });
};

export const post = (req, res) => {
    // ???
    const data = Object.assign({}, req.body, { user: req.user.sub }) || {};

    User.create(data)
        .then(user => res.json(user))
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

export const del = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.user },
        { active: false },
        { new: true }
    ).then((user) => {
        if (!user) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }).catch((err) => {
        logger.error(err);
        res.status(422).send(err.errors);
    });
};

// initializes the database with the admin user (with creds from .env)
export const init = () => {
    User.findOne({ username: config.adminUser }, (err, adminUser) => {
        if (err || !adminUser) {
            logger.info('Admin user not found, creating it now');
            User.create({
                email: config.adminUserEmail,
                username: config.adminUser,
                password: config.adminUserPass,
                name: config.adminUserName,
                active: true,
                admin: true
            }, (error, admin) => {
                if (error) {
                    logger.error(`Error creating admin user: ${error}`);
                } else {
                    logger.info(`Created admin user: ${admin.username}`);
                }
            });
        } else {
            logger.info('Admin user already exists');
        }
    });
};
