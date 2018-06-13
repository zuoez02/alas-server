import express from 'express';
import http from 'http';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { WsServer } from './ws';
import { Rest } from './rest';
import { Utils } from './utils';

export class Server {
  app: express.Application;
  server: http.Server;
  wss: WsServer;
  rest: Rest;
  hash: string;

  constructor() {
    this.app = express();
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.app.use(bodyParser.json());
    this.server = http.createServer(this.app);
  }

  setKey(key: string) {
    const hash = crypto.createHash('md5').update(key).digest('hex');
    this.hash = hash;
    const filename = Utils.saveKey(hash);
    console.log(`key ${hash} is used for authorization and saved in ${filename}`);
    this.app.use('/*', (req, res, next) => {
      console.log(hash);
      if (req.headers['alas-key'] !== hash) {
        return res.status(401).send();
      }
      next();
    });
  }

  start() {
    this.wss = new WsServer(this.server, this.hash);
    this.rest = new Rest(this.wss.getDb());
    this.app.use(this.rest.getRouter());

    const port = process.env.PORT || 8999;
    this.server.listen(port, () => {
      console.log(`Server started on port ${port} :)`);
    });
  }
}
