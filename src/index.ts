import { Server } from './server';
import { Utils } from './utils';

const config = Utils.readConfig();
const server = new Server(config);
server.start();
