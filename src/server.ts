import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { WsServer } from './ws';
import { Rest } from './rest';

export class Server {
  app: express.Application;
  server: http.Server;
  wss: WsServer;
  rest: Rest;

  constructor() {
    this.app = express();
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.app.use(bodyParser.json());
    this.server = http.createServer(this.app);
    this.wss = new WsServer(this.server);
    this.rest = new Rest(this.wss.getDb());
    this.app.use(this.rest.getRouter());
  }

  start() {
    const port = process.env.PORT || 8999;

    this.server.listen(port, () => {
      console.log(`Server started on port ${port} :)`);
    });
  }
}
