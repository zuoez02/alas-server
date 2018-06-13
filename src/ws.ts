import WebSocket from 'ws';
import http from 'http';
import { Utils } from './utils';
import { ClientDb, UNKNOWN } from './db';

enum Action {
  REGISTER = 'REGISTER',
  GET_CLIENTS = 'GET_CLIENTS',
}

interface Message {
  action: Action;
  name: string;
  time: number;
  data: any;
}

export class WsServer {
  private wss: WebSocket.Server;
  private db: ClientDb;

  constructor(server: http.Server, hash?: string) {
    this.db = new ClientDb();
    this.wss = new WebSocket.Server({
      server,
      verifyClient: function(info, cb) {
        if (!hash) {
          return cb(true);
        }
        const token = info.req.headers.token
        if (!token) {
          cb(false, 401, 'Unauthorized');
        } else {
          if (hash === token) {
            cb(true);
          } else {
            cb(false, 401, 'Unauthorized');
          }
        }
      },
    });
    this.wss.on('connection', (ws: WebSocket, req) => {
      this.onConnection(ws, req);
    });
  }

  public onConnection(ws: WebSocket, req: http.IncomingMessage) {
    this.db.register(UNKNOWN, ws);
    ws.on('message', this.onMessage(ws));
    ws.on('close', this.onClose(ws));
  }

  public onMessage(ws: WebSocket): (data: any) => void {
    return message => {
      let m: Message;
      if (typeof message === 'string') {
        try {
          m = JSON.parse(message);
        } catch (error) {
          Utils.sendError(ws, 'JSON parse error');
          return;
        }
      } else if (typeof message !== 'object') {
        Utils.sendError(ws, 'Wrong data format');
        return;
      } else {
        m = message;
      }
      switch (m.action) {
        case Action.REGISTER:
          if (!m.name) {
            Utils.sendError(ws, 'No name specific');
            return;
          }
          try {
            const client = this.db.getClientByWs(ws);
            if (client) {
              client.setClientName(m.name);
            } else {
              this.db.register(m.name, ws);
            }
            Utils.sendSuccess(ws, `Register Success, welcome ${m.name}`);
          } catch (error) {
            ws.send(error);
          }
          break;
        case Action.GET_CLIENTS:
          const clients = this.db.getClients();
          Utils.sendSuccess(ws, clients);
          break;
        default:
          Utils.sendError(ws, 'Unknown action.');
          break;
      }
    };
  }

  public onClose(ws: WebSocket) {
    return () => {
      const client = this.db.getClientByWs(ws);
      this.db.unregister(client.clientName);
    };
  }

  public broadcast(data: any) {
    this.wss.clients.forEach((ws: WebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        Utils.sendSuccess(ws, data);
      }
    });
  }

  public getDb(): ClientDb {
    return this.db;
  }
}
