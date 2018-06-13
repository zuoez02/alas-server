"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var utils_1 = require("./utils");
var db_1 = require("./db");
var Action;
(function (Action) {
    Action["REGISTER"] = "REGISTER";
    Action["GET_CLIENTS"] = "GET_CLIENTS";
})(Action || (Action = {}));
var WsServer = /** @class */ (function () {
    function WsServer(server, hash) {
        var _this = this;
        this.db = new db_1.ClientDb();
        this.wss = new ws_1.default.Server({
            server: server,
            verifyClient: function (info, cb) {
                if (!hash) {
                    return cb(true);
                }
                var token = info.req.headers.token;
                if (!token) {
                    cb(false, 401, 'Unauthorized');
                }
                else {
                    if (hash === token) {
                        cb(true);
                    }
                    else {
                        cb(false, 401, 'Unauthorized');
                    }
                }
            },
        });
        this.wss.on('connection', function (ws, req) {
            _this.onConnection(ws, req);
        });
    }
    WsServer.prototype.onConnection = function (ws, req) {
        this.db.register(db_1.UNKNOWN, ws);
        ws.on('message', this.onMessage(ws));
        ws.on('close', this.onClose(ws));
    };
    WsServer.prototype.onMessage = function (ws) {
        var _this = this;
        return function (message) {
            var m;
            if (typeof message === 'string') {
                try {
                    m = JSON.parse(message);
                }
                catch (error) {
                    utils_1.Utils.sendError(ws, 'JSON parse error');
                    return;
                }
            }
            else if (typeof message !== 'object') {
                utils_1.Utils.sendError(ws, 'Wrong data format');
                return;
            }
            else {
                m = message;
            }
            switch (m.action) {
                case Action.REGISTER:
                    if (!m.name) {
                        utils_1.Utils.sendError(ws, 'No name specific');
                        return;
                    }
                    try {
                        var client = _this.db.getClientByWs(ws);
                        if (client) {
                            client.setClientName(m.name);
                        }
                        else {
                            _this.db.register(m.name, ws);
                        }
                        utils_1.Utils.sendSuccess(ws, "Register Success, welcome " + m.name);
                    }
                    catch (error) {
                        ws.send(error);
                    }
                    break;
                case Action.GET_CLIENTS:
                    var clients = _this.db.getClients();
                    utils_1.Utils.sendSuccess(ws, clients);
                    break;
                default:
                    utils_1.Utils.sendError(ws, 'Unknown action.');
                    break;
            }
        };
    };
    WsServer.prototype.onClose = function (ws) {
        var _this = this;
        return function () {
            var client = _this.db.getClientByWs(ws);
            _this.db.unregister(client.clientName);
        };
    };
    WsServer.prototype.broadcast = function (data) {
        this.wss.clients.forEach(function (ws) {
            if (ws.readyState === ws_1.default.OPEN) {
                utils_1.Utils.sendSuccess(ws, data);
            }
        });
    };
    WsServer.prototype.getDb = function () {
        return this.db;
    };
    return WsServer;
}());
exports.WsServer = WsServer;
