import User from '../models/user.model';
import logger from '../utils/logging';
import { createToken } from '../utils/auth';

// login a user
export const login = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .select('+password')
        .then((user) => {
            if (!user) {
                logger.warn(`Login failed: User not found: ${username}`);
                res.sendStatus(401);
            } else {
                user.verifyPassword(password, (err, valid) => {
                    if (!err && valid) {
                        logger.info(`User logged in: ${username}`);
                        const token = createToken(user.id);
                        res.status(200).json({ token });
                    } else {
                        logger.warn(`Login failed! Password mismatch: ${username}`);
                        res.sendStatus(401);
                    }
                });
            }
        })
        .catch(err => logger.error(`Login failed for ${username}: ${err}`));
};

export const recover = (req, res) => {
    // TODO: send email with recovery code
};

export const reset = (req, res) => {
    // TODO: endpoint to send new password to
};
