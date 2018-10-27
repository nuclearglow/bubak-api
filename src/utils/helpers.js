
export const formatFileSize = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / (1024 ** i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

export default formatFileSize;
