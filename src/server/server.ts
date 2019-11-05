import Express from 'express';
import "reflect-metadata";
import {botAuthentication} from "./controllers/botAuthentication";
import {botPushStatus} from "./controllers/botPushStatus";
import {systemStatus} from "./controllers/systemStatus";

const express = Express();

express.use(Express.urlencoded({ extended:true }));
express.use(Express.json());

// configurations
express.set('view engine', 'pug');
express.set('views', './src/server/views');

// routes
express.post('/bot/auth', botAuthentication);
express.post('/bot/pushStatus', botPushStatus);
express.get('/', systemStatus);

// server
express.listen(3000);
