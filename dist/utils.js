"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.sendMessage = function (ws, data) {
        ws.send(JSON.stringify(data));
    };
    Utils.sendSuccess = function (ws, message) {
        this.sendMessage(ws, { message: message, success: true });
    };
    Utils.sendError = function (ws, errorMessage) {
        this.sendMessage(ws, { errorMessage: errorMessage, success: false });
    };
    Utils.saveKey = function (key) {
        var filename = path_1.default.resolve(__dirname, '..', 'key');
        fs_1.default.writeFileSync(filename, key);
        return filename;
    };
    Utils.readConfig = function () {
        var filename = path_1.default.resolve(__dirname, '..', 'config.json');
        var file = fs_1.default.readFileSync(filename);
        return JSON.parse(file.toString());
    };
    return Utils;
}());
exports.Utils = Utils;
