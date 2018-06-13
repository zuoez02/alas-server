"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var utils_1 = require("./utils");
var config = utils_1.Utils.readConfig();
var server = new server_1.Server(config);
server.start();
