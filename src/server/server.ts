import Express from 'express';
import "reflect-metadata";
import {botAuthentication} from "./controllers/botAuthentication";
import {botPushStatus} from "./controllers/botPushStatus";
import {systemStatus} from "./controllers/systemStatus";
import {botHeartbeat} from "./controllers/botHeartbeat";
import {cronRemoveDeadBots} from "./controllers/cronRemoveDeadBots";

const express = Express();

express.use(Express.urlencoded({ extended:true }));
express.use(Express.json());

// configurations
express.set('view engine', 'pug');
express.set('views', './src/server/views');

// routes
express.post('/bot/auth', botAuthentication);
express.post('/bot/heartbeat', botHeartbeat);
express.post('/bot/pushStatus', botPushStatus);
express.post('/cron/remove_dead_bots', cronRemoveDeadBots);
express.get('/', systemStatus);

// server
express.listen(3000);
