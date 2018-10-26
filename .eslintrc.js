module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb-base",
    "env": {
        "browser": false,
        "node": true
    },
    "rules": {
        "indent": ["error", 4],
        "max-len": ["error", { "code": 255 }],
        "no-console": "error",
        "comma-dangle": "off",
    }
};
