import validator from 'validator';

import config from '../utils/config';
import User from '../models/user.model';
import logger from '../utils/logging';

// list all users
export const list = async (req, res) => {
    try {
        const users = await User.find({}).select('name email username');
        if (!users) {
            logger.error('No users exist');
            return res.sendStatus(404);
        }
        return res.json(users);
    } catch (err) {
        logger.error(err);
        return res.sendStatus(422);
    }
};

// get a single user
export const get = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('email username name active admin');
        if (!user) {
            logger.warn(`User not found: ${req.params.userId}`);
            return res.sendStatus(404);
        }
        return res.json(user);
    } catch (err) {
        logger.error(err);
        return res.status(422).send(err.errors);
    }
};

// create user
export const post = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        logger.info(`User created: ${user.username}`);
        return res.status(201).send(user.id);
    } catch (err) {
        logger.error(err);
        return res.sendStatus(500);
    }
};

// update user
export const put = async (req, res) => {
    // FIXME: insecure
    const data = req.body || {};

    if (data.email && !validator.isEmail(data.email)) {
        return res.status(422).send('Invalid email address.');
    }
    if (data.username && !validator.isAlphanumeric(data.username)) {
        return res.status(422).send('Usernames must be alphanumeric.');
    }

    try {
        const user = await User.findByIdAndUpdate({ _id: req.params.userId }, data);
        if (!user) {
            logger.warn(`User update failed. Not found: ${req.params.userId}`);
            return res.sendStatus(404);
        }
        logger.info(`User updated: ${user.username}`);
        return res.sendStatus(204);
    } catch (err) {
        logger.error(err);
        return res.status(422).send(err.errors);
    }
};

// delete user
export const del = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.params.userId });
        if (!user) {
            logger.warn(`User not deleted: ${req.params.userId}`);
            return res.sendStatus(404);
        }
        logger.info(`User deleted: ${user.username}`);
        return res.sendStatus(204);
    } catch (err) {
        logger.error(err);
        return res.status(422).send(err.errors);
    }
};

// initializes the database with the admin user (with creds from .env)
export const init = async () => {
    try {
        const adminUser = await User.findOne({ username: config.adminUser });
        if (!adminUser) {
            logger.info('Admin user not found, creating it now');
            await User.create({
                email: config.adminUserEmail,
                username: config.adminUser,
                password: config.adminUserPass,
                name: config.adminUserName,
                active: true,
                admin: true
            });
        } else {
            logger.info('Admin user already exists');
        }
    } catch (err) {
        logger.error(`Error creating admin user: ${err}`);
    }
};
