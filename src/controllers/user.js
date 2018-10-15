import async from 'async';
import validator from 'validator';

import User from '../models/user';

import logger from '../utils/logging';

const list = (req, res) => {
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

const get = (req, res) => {
    User.findById(req.params.userId)
        .select('* -password -recoveryCode')
        .catch((err) => {
            logger.error(err);
            res.status(422).send(err.errors);
        });
};

const put = (req, res) => {
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

const post = (req, res) => {
    // ???
    const data = Object.assign({}, req.body, { user: req.user.sub }) || {};

    User.create(data)
        .then(user => res.json(user))
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

const del = (req, res) => {
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

export default {
    list, get, put, post, del
};
