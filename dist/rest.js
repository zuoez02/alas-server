"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var db_1 = require("./db");
var utils_1 = require("./utils");
var Rest = /** @class */ (function () {
    function Rest(db) {
        var _this = this;
        this.db = db;
        this.router = express_1.default.Router();
        this.router.post('/message', function (req, res) {
            if (typeof req.body !== 'object' || req.body.data === undefined) {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Wrong request body format, it should be a json with clientName and data',
                });
            }
            if (!req.body.clientName || req.body.clientName === db_1.UNKNOWN) {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Client is not exist',
                });
            }
            var clientName = req.body.clientName;
            var client = _this.db.getClientByName(clientName);
            if (!client) {
                return res.json({
                    success: true,
                });
            }
            utils_1.Utils.sendSuccess(client.ws, { data: req.body, type: 'single' });
            res.json({
                success: true,
            });
        });
        this.router.post('/broadcast', function (req, res) {
            if (typeof req.body !== 'object' || req.body.data === undefined) {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Wrong request body format, it should be a json with data',
                });
            }
            _this.db.broadcast(req.body);
            res.json({
                success: true,
            });
        });
    }
    Rest.prototype.getRouter = function () {
        return this.router;
    };
    return Rest;
}());
exports.Rest = Rest;
