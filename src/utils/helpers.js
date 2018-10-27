import path from 'path';
import fs from 'fs';

export const formatFileSize = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / (1024 ** i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

/**
 * create the folder dir in the project root if it does not exist yet
 * @param {*} dir the folder to create
 * @returns absolte path to the created folder
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
