import WebSocket from 'ws';

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
}
