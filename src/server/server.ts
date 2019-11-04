import Express from 'express';
import "reflect-metadata";
import {botAuthentication} from "./controllers/botAuthentication";
import {botPushStatus} from "./controllers/botPushStatus";
import {systemStatus} from "./controllers/systemStatus";

const express = Express();

express.use(Express.json());
express.use(Express.urlencoded({ extended: true }));

express.set('view engine', 'pug');
express.set('views', './src/server/views');

express.post('/bot/auth', botAuthentication);
express.post('/bot/:token/pushStatus', botPushStatus);
express.get('/', systemStatus);

express.listen(3000);
