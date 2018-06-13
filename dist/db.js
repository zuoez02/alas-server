"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var utils_1 = require("./utils");
exports.UNKNOWN = 'UNKNOWN';
var Client = /** @class */ (function () {
    function Client(clientName, ws) {
        this.clientName = clientName;
        this.registerTime = new Date().getTime();
        this.isUnKnown = clientName === exports.UNKNOWN;
        this.ws = ws;
    }
    Client.prototype.setClientName = function (clientName) {
        this.clientName = clientName;
        this.isUnKnown = clientName === exports.UNKNOWN;
        this.registerTime = new Date().getTime();
    };
    Client.prototype.destory = function () {
        this.ws = null;
    };
    return Client;
}());
exports.Client = Client;
var ClientDb = /** @class */ (function () {
    function ClientDb() {
        this.clients = [];
    }
    ClientDb.prototype.getClients = function () {
        return this.clients.map(function (client) { return ({
            clientName: client.clientName,
            registerTime: client.registerTime,
        }); });
    };
    ClientDb.prototype.register = function (clientName, ws) {
        var client = this.getClientByName(clientName);
        if (client && client.clientName !== exports.UNKNOWN) {
            throw new Error('The client name is already exists, try another one');
        }
        var newClient = new Client(clientName, ws);
        this.clients.push(newClient);
    };
    ClientDb.prototype.getClientByName = function (clientName) {
        for (var _i = 0, _a = this.clients; _i < _a.length; _i++) {
            var client = _a[_i];
            if (client.clientName === clientName) {
                return client;
            }
        }
        return null;
    };
    ClientDb.prototype.getClientByWs = function (ws) {
        for (var _i = 0, _a = this.clients; _i < _a.length; _i++) {
            var client = _a[_i];
            if (client.ws === ws) {
                return client;
            }
        }
        return null;
    };
    ClientDb.prototype.unregister = function (clientName) {
        for (var clientIndex = 0; clientIndex < this.clients.length; clientIndex++) {
            var client = this.clients[clientIndex];
            if (client.clientName === clientName) {
                this.clients.splice(clientIndex, 1);
                client.destory();
                return client;
            }
        }
        return null;
    };
    ClientDb.prototype.broadcast = function (data) {
        this.clients.forEach(function (client) {
            var ws = client.ws;
            if (ws.readyState === ws_1.default.OPEN) {
                utils_1.Utils.sendSuccess(ws, { data: data, type: 'broadcast' });
            }
        });
    };
    return ClientDb;
}());
exports.ClientDb = ClientDb;
