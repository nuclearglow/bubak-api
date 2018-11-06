import formidable from 'formidable';
import slug from 'slug';
import fs from 'fs';
import moment from 'moment';
import path from 'path';

import config from '../utils/config';
import logger from '../utils/logging';
import { formatFileSize } from '../utils/helpers';

import Konzi from '../models/konzi.model';

// list all konzis
export const list = async (req, res) => {
    try {
        const query = req.query || {};
        const konzis = await Konzi.apiQuery(query).select('title date description flyer');
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

// create konzi (with image upload)
export const post = async (req, res) => {
    try {
        // configure formidable file upload
        const form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = config.uploadPath;
        // wrap the callback in a promise for async await support
        const konzi = await new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, file) => {
                if (err) {
                    reject(err);
                }
                // create model from form fields
                const newKonzi = new Konzi(fields);
                // check if we have a file upload
                if (file && file.file) {
                    const { size, path: temporaryUploadPath, type } = file.file;
                    // i.e. type image/png -> png
                    const flyerExtension = type.split('/')[1];
                    // rename temporary file to final name
                    const flyerFilename = `${moment(newKonzi.date).format('YYYY-MM-DD')}-${slug(newKonzi.title, { lower: true })}.${flyerExtension}`;
                    const finalFlyerPath = path.join(path.dirname(temporaryUploadPath), flyerFilename);
                    fs.renameSync(temporaryUploadPath, finalFlyerPath);
                    // for the db, we save the relative download path /uploadDir/name
                    const flyerRelativePath = path.join(config.uploadDir, flyerFilename);
                    newKonzi.flyer = flyerRelativePath;
                    logger.info(`Flyer for Konzi saved: ${flyerRelativePath} (${formatFileSize(size)})`);
                }
                resolve(newKonzi);
            });
        });
        // save to db
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
