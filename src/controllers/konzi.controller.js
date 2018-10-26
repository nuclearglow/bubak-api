import Konzi from '../models/konzi.model';
import logger from '../utils/logging';

// list all konzis
export const list = async (req, res) => {
    try {
        const query = req.query || {};
        const konzis = await Konzi.apiQuery(query).select('date description');
        if (!konzis) {
            logger.warn('No konzis found');
            return res.json([]);
        }
        return res.json(konzis);
    } catch (err) {
        logger.error(err);
        return res.status(422).send(err.errors);
    }
};

// get a single konzi
export const get = async (req, res) => {
    try {
        const konzi = await Konzi.findById(req.params.konziId).select('date title description');
        if (!konzi) {
            logger.info(`Konzi not found: ${req.params.konziId}`);
            return res.sendStatus(404);
        }
        return res.json(konzi);
    } catch (err) {
        logger.error(err);
        return res.status(422).send(err.errors);
    }
};

// create konzi
export const post = async (req, res) => {
    try {
        const konzi = new Konzi(req.body);
        await konzi.save();
        logger.info(`Konzi created: ${konzi.title}`);
        return res.status(201).send(konzi.id);
    } catch (err) {
        logger.error(err);
        return res.sendStatus(422);
    }
};

// update konzi
export const put = async (req, res) => {
    try {
        const data = req.body || {};
        const konzi = await Konzi.findByIdAndUpdate({ _id: req.params.konziId }, data);
        if (!konzi) {
            logger.info(`Konzi not updated: ${req.params.konziId}`);
            return res.sendStatus(404);
        }
        logger.info(`Konzi updated: ${konzi.title}`);
        return res.sendStatus(204);
    } catch (err) {
        logger.error(err);
        return res.sendStatus(422);
    }
};

// delete konzi
export const del = async (req, res) => {
    try {
        const konzi = await Konzi.findByIdAndDelete({ _id: req.params.konziId });
        if (!konzi) {
            logger.warn(`Konzi not deleted: ${req.params.konziId}`);
            return res.sendStatus(404);
        }
        logger.info(`Konzi deleted: ${konzi.title}`);
        return res.sendStatus(204);
    } catch (err) {
        logger.error(err);
        return res.sendStatus(422);
    }
};
