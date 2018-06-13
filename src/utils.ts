import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

export class Utils {
  static sendMessage(ws: WebSocket, data: any) {
    ws.send(JSON.stringify(data));
  }

  static sendSuccess(ws: WebSocket, message: any) {
    this.sendMessage(ws, { message, success: true })
  }

  static sendError(ws: WebSocket, errorMessage: string) {
    this.sendMessage(ws, { errorMessage, success: false });
  }

  static saveKey(key: string): string {
    const filename = path.resolve(__dirname, '..', 'key');
    fs.writeFileSync(filename, key);
    return filename;
  }

  static readConfig() {
    const filename = path.resolve(__dirname, '..', 'config.json');
    const file = fs.readFileSync(filename);
    return JSON.parse(file.toString());
  }
}
