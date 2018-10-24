import validator from 'validator';

import config from '../utils/config';
import Konzi from '../models/konzi';
import logger from '../utils/logging';

// list all konzis
export const list = (req, res) => {
    const query = req.query || {};

    Konzi.apiQuery(query)
        .select('date descxription')
        .then((konzis) => {
            res.json(konzis);
        })
        .catch((err) => {
            logger.error(err);
            res.status(422).send(err.errors);
        });
};

// get a single konzi
export const get = (req, res) => {
    Konzi.findById(req.params.konziId)
        .select('date title description')
        .then((konzi) => {
            res.json(konzi);
        })
        .catch((err) => {
            logger.error(err);
            res.status(422).send(err.errors);
        });
};

// create konzi
export const post = (req, res) => {
    const data = Object.assign({}, req.body);

    Konzi.create(data)
        .then((konzi) => {
            logger.info(`Konzi created: ${konzi.title}`);
            res.status(201).send(konzi.id);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

// update konzi
export const put = (req, res) => {
    const data = req.body || {};

    Konzi.findByIdAndUpdate({ _id: req.params.konziId }, data)
        .then((konzi) => {
            if (!konzi) {
                return res.sendStatus(404);
            }
            logger.info(`Konzi updated: ${konzi.title}`);
            return res.sendStatus(204);
        })
        .catch((err) => {
            logger.error(err);
            return res.status(422).send(err.errors);
        });
};

// delete user
export const del = (req, res) => {
    Konzi.findByIdAndDelete({ _id: req.params.konziId })
        .then((konzi) => {
            if (!konzi) {
                res.sendStatus(404);
            }
            logger.info(`Konzi deleted: ${konzi.title}`);
            res.sendStatus(204);
        }).catch((err) => {
            logger.error(err);
            res.status(422).send(err.errors);
        });
};
