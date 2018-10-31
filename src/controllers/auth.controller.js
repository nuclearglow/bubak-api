import validator from 'validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import User from '../models/user.model';
import logger from '../utils/logging';
import { createToken } from '../utils/auth';
import config from '../utils/config';

// login a user
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            logger.warn(`Login failed: User not found: ${username}`);
            res.sendStatus(401);
            return;
        }
        const valid = await user.verifyPassword(password);
        if (valid) {
            logger.info(`User logged in: ${username}`);
            const token = createToken(user.id);
            res.status(200).json({ token });
        } else {
            logger.warn(`Login failed! Password mismatch: ${username}`);
            res.sendStatus(401);
        }
    } catch (err) {
        logger.error(`Login failed for ${username}: ${err}`);
    }
};

// enter a valid email or username and a recivery code gets sent to the email to reset the password
export const recover = async (req, res) => {
    const { usernameOrEmail } = req.body;
    let user = null;
    try {
        if (usernameOrEmail) {
            // what do we have here ?
            if (validator.isEmail(usernameOrEmail)) {
                user = await User.findOne({ email: usernameOrEmail });
            } else if (validator.isAlphanumeric(usernameOrEmail)) {
                user = await User.findOne({ username: usernameOrEmail });
            }
        }
        if (user) {
            // we have a user, generate a random recovery code that works in a URL
            const recoveryCode = crypto.randomBytes(Math.ceil(128 / 2)).toString('hex').slice(0, 128);
            // save the code in the User record
            user.recoveryCode = recoveryCode;
            await user.save();
            // send the email to the user
            const recoveryUrl = `${config.serverUrl}/reset/${recoveryCode}`;
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                host: config.smtpHost,
                port: config.smtpPort,
                secure: config.smtpPort === 465, // true for 465, false for other ports
                auth: {
                    user: config.smtpUser,
                    pass: config.smtpPass // generated ethereal password
                }
            });
            // setup email data with unicode symbols
            const mailOptions = {
                from: 'bubak', // sender address
                to: `${config.adminUserEmail}`, // list of receivers
                subject: 'Hello', // Subject line
                text: `Passwort verschwitzt? Klick hier: ${recoveryUrl}`, // plain text body
                html: `Passwort verschwitzt? Klick hier: ${recoveryUrl}` // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                    logger.error(`Error sending mail: ${error}`);
                } else {
                    logger.info(`Message sent: ${JSON.stringify(response)}`);
                }
            });
        }
    } catch (err) {
        logger.warn(`Recover: invalid user name or email: ${usernameOrEmail}: ${err}`);
    } finally {
        res.sendStatus(204);
    }
};

// if a user has successfully followed the recover link, a new password is set
export const reset = async (req, res) => {
    const { newPassword } = req.body;
    // check password length
    if (!newPassword || newPassword.length < 8) {
        return res.status(406).send('Reset Password failed: : Invalid password');
    }
    try {
        // get user from /path
        const { recoveryCode } = req.params;
        const user = await User.findOne({ recoveryCode });
        if (!user) {
            logger.warn('Reset Password failed: Invalid recoveryCode.');
            return res.sendStatus(400);
        }
        // ok, save the user with the new password
        user.password = newPassword;
        await user.save();
    } catch (err) {
        logger.error(`Reset Password failed: ${err}`);
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
};
