import {Request, Response} from "express";
import _ from "lodash";
import {Bot} from "../models/Bot";
import {validHostname} from "../config";

export const botAuthentication = (req: Request, res: Response) => {
    const hostname = req.header('X-Server-Hostname');

    if (_.isNil(hostname)) {
        return res.json({
            status: 'err',
            error: 'Please include the hostname',
        });
    }

    if (!validHostname(hostname)) {
        return res.json({
            status: 'err',
            error: 'You are not authorized to be authenticated',
        });
    }

    const bot = new Bot(hostname);

    bot.status = 'created';
    bot.gotHeartbeat();

    return res.json({
        status: 'ok',
        token: bot.token,
    });
};
