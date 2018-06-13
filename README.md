# Alas Server
> Server for alas service

## Install

Before use the project. You need to have node environment. Suggest [node version manager](https://github.com/creationix/nvm).

Then use follow steps:
```bash
git clone https://github.com/zuoez02/alas-server
npm install --production
```

After that, you should config the secret key and start port in `config.json`;

Then use `npm start` to boot the server. The using secret key is saving in `key` file.

You can use [pm2](https://pm2.io/runtime/) or other service to keep it running background.
