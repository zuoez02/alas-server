import { Server } from './src/server';
import config from './config.json';

const server = new Server();
server.setKey(config.key);
server.start();
