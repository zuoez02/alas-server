"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var crypto_1 = __importDefault(require("crypto"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_basic_auth_1 = __importDefault(require("express-basic-auth"));
var ws_1 = require("./ws");
var rest_1 = require("./rest");
var utils_1 = require("./utils");
var Server = /** @class */ (function () {
    function Server(config) {
        this.config = Object.assign({
            port: 8080,
            hostname: '0.0.0.0',
        }, config);
        this.app = express_1.default();
        this.app.use(body_parser_1.default.urlencoded({
            extended: true,
        }));
        this.app.use(body_parser_1.default.json());
        if (this.config.key) {
            this.setKey(this.config.key);
        }
        this.app.get('/', function (req, res) {
            res.send('Alas Server');
        });
        this.server = http_1.default.createServer(this.app);
    }
    Server.prototype.setKey = function (key) {
        if (!key) {
            return;
        }
        var hash = crypto_1.default.createHash('md5').update(key).digest('hex');
        this.hash = hash;
        var filename = utils_1.Utils.saveKey(hash);
        console.log("[" + new Date() + "] Key '" + hash + "' for user root is used for authorization and saved in " + filename);
        this.app.use(express_basic_auth_1.default({
            users: {
                'root': hash
            },
        }));
    };
    Server.prototype.start = function () {
        var _this = this;
        this.wss = new ws_1.WsServer(this.server, this.hash);
        this.rest = new rest_1.Rest(this.wss.getDb());
        this.app.use(this.rest.getRouter());
        var port = this.config.port;
        this.server.listen(port, this.config.hostname, function () {
            console.log("[" + new Date() + "] Server started on port " + port + " on host " + _this.config.hostname);
        });
    };
    return Server;
}());
exports.Server = Server;
