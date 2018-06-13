import WebSocket from 'ws';
import { Utils } from './utils';
export const UNKNOWN = 'UNKNOWN';

export class Client {
  public clientName: string;
  public registerTime: number;
  public isUnKnown: boolean;
  public ws: WebSocket;

  constructor(clientName: string, ws: WebSocket) {
    this.clientName = clientName;
    this.registerTime = new Date().getTime();
    this.isUnKnown = clientName === UNKNOWN;
    this.ws = ws;
  }

  setClientName(clientName: string) {
    this.clientName = clientName;
    this.isUnKnown = clientName === UNKNOWN;
    this.registerTime = new Date().getTime();
  }

  destory() {
    this.ws = null;
  }
}

export class ClientDb {
  private clients: Client[] = [];

  public getClients(): any[] {
    return this.clients.map((client) => ({
      clientName: client.clientName,
      registerTime: client.registerTime,
    }));
  }

  public register(clientName: string, ws: WebSocket) {
    const client = this.getClientByName(clientName);
    if (client && client.clientName !== UNKNOWN) {
      throw new Error('The client name is already exists, try another one');
    }
    const newClient = new Client(clientName, ws);
    this.clients.push(newClient);
  }

  public getClientByName(clientName: string): Client {
    for (const client of this.clients) {
      if (client.clientName === clientName) {
        return client;
      }
    }
    return null;
  }

  public getClientByWs(ws: WebSocket): Client {
    for (const client of this.clients) {
      if (client.ws === ws) {
        return client;
      }
    }
    return null;
  }

  public unregister(clientName: string): Client {
    for (let clientIndex = 0; clientIndex < this.clients.length; clientIndex++) {
      const client = this.clients[clientIndex];
      if (client.clientName === clientName) {
        this.clients.splice(clientIndex, 1);
        client.destory();
        return client;
      }
    }
    return null;
  }

  public broadcast(data: any) {
    this.clients.forEach((client: Client) => {
      const ws = client.ws;
      if (ws.readyState === WebSocket.OPEN) {
        Utils.sendSuccess(ws, { data, type: 'broadcast' });
      }
    });
  }
}
