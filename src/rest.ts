import express from 'express';
import { ClientDb, UNKNOWN } from './db';
import { Utils } from './utils';

export class Rest {
  private db: ClientDb;
  private router: express.Router;

  constructor(db: ClientDb) {
    this.db = db;
    this.router = express.Router();

    this.router.post('/message', (req, res) => {
      if (typeof req.body !== 'object' || req.body.data === undefined) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Wrong request body format, it should be a json with clientName and data',
        });
      }
      if (!req.body.clientName || req.body.clientName === UNKNOWN ) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Client is not exist',
        });
      }
      const clientName = req.body.clientName;
      const client = this.db.getClientByName(clientName);
      if (!client) {
        return res.json({
          success: true,
        });
      }
      Utils.sendSuccess(client.ws, { data: req.body, type: 'single' });
      res.json({
        success: true,
      });
    });

    this.router.post('/broadcast', (req, res) => {
      if (typeof req.body !== 'object' || req.body.data === undefined) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Wrong request body format, it should be a json with data',
        })
      }
      this.db.broadcast(req.body);
      res.json({
        success: true,
      });
    });
  }

  public getRouter(): express.Router {
    return this.router;
  }
}

