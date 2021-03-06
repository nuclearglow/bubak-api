import path from 'path';
import fs from 'fs';

import sizeOf from 'image-size';

/**
 * @param {int} bytes a bytenumber of bytes such as a file size
 * @returns {string} formatted size
 */
export const formatFileSize = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / (1024 ** i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

/**
 * create the folder dir in the project root if it does not exist yet
 * @param {path} dir to the folder to create, relative to the project root
 * @returns {path} absolute path to the created folder
 */
export const createFolder = (dir) => {
    const p = path.resolve(path.join(process.cwd(), dir));
    try {
        fs.mkdirSync(p);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
    return p;
};

/**
 * takes a full image path, and returns the size as object containing width and height
 * @param {string} imagePath expects the path to an image
 */
export const getImageSize = async imagePath => sizeOf(imagePath);
