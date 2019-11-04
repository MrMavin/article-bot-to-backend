import {Request, Response} from "express";
import _ from "lodash";
import {Bot} from "../models/Bot";
import {validHostname} from "../config";

export const botAuthentication = (req: Request, res: Response) => {
    const hostname = _.get(req.params, 'hostname');

    if (_.isEmpty(hostname)) {
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

    bot.gotHeartbeat();

    return res.json({
        status: 'ok',
        token: bot.token,
    });
};
