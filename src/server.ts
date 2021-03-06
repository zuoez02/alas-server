import express from 'express';
import http from 'http';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';
import { WsServer } from './ws';
import { Rest } from './rest';
import { Utils } from './utils';

export class Server {
  app: express.Application;
  server: http.Server;
  wss: WsServer;
  rest: Rest;
  config: any;
  hash: string;

  constructor(config) {
    this.config = Object.assign({
      port: 8080,
      hostname: '0.0.0.0',
    }, config);
    this.app = express();
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.app.use(bodyParser.json());
    if (this.config.key) {
      this.setKey(this.config.key);
    }

    this.app.get('/', (req, res) => {
      res.send('Alas Server');
    });
    
    this.server = http.createServer(this.app);

  }

  setKey(key: string) {
    if (!key) {
      return;
    }
    const hash = crypto.createHash('md5').update(key).digest('hex');
    this.hash = hash;
    const filename = Utils.saveKey(hash);
    console.log(`[${new Date()}] Key '${hash}' for user root is used for authorization and saved in ${filename}`);
    this.app.use(basicAuth({
      users: {
        'root': hash
      },
    }));
  }

  start() {
    this.wss = new WsServer(this.server, this.hash);
    this.rest = new Rest(this.wss.getDb());
    this.app.use(this.rest.getRouter());

    const port = this.config.port;
    this.server.listen(port, this.config.hostname, () => {
      console.log(`[${new Date()}] Server started on port ${port} on host ${this.config.hostname}`);
    });
  }
}
