// FIXME: replace with newer token implementation
import jwt from 'jsonwebtoken';
import unless from 'express-unless';

import logger from './logging';
import config from './config';

export const createToken = userId => jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: 3600, algorithm: 'HS256' });

export const verifyToken = token => new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
        if (err || !decodedToken) {
            reject(new Error(`Verify token failed: ${err}`));
        }
        resolve(decodedToken);
    });
});

export const verifyTokenMiddleware = () => {
    const middleware = (req, res, next) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            // Expected HTTP Header: Authorization: Bearer <token>
            const token = req.headers.authorization.split(' ')[1];
            verifyToken(token)
                .then((decodedToken) => {
                    req.token = decodedToken;
                    next();
                })
                .catch((err) => {
                    logger.warn(`${req.path}: ${err}`);
                    res.sendStatus(401);
                });
        } else {
            logger.warn(`${req.path}: No token presented`);
            res.sendStatus(401);
        }
    };
    middleware.unless = unless;
    return middleware;
};
