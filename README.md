# bubak-api

our backend REST API

## inspired by

https://medium.com/@christossotiriou/speed-up-nodejs-server-side-development-with-webpack-4-hmr-8b99a932bdda

## prereqs

```shell
brew install mongodb
brew services start mongodb
```

Create database
Create .env file <- `src/utils/config.js`
For JWT_SECRET, use a RNG such as https://ipty.de/random/

## setup

```shell
nvm install stable
nvm use
npm i
```

## develop

```shell
npm start
```
