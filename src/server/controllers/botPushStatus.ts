import {Request, Response} from "express";
import _ from "lodash";
import {loadBotByToken} from "../models/Bot";

export const botPushStatus = (req: Request, res: Response) => {
    const hostname = _.get(req.params, 'hostname');
    const token = _.get(req.params, 'token');
    const status = _.get(req.params, 'status');

    if (_.isEmpty(hostname) || _.isEmpty(token)) {
        return res.json({
            status: 'err',
            error: 'Please include hostname, token and status',
        });
    }

    const bot = loadBotByToken(hostname, token);

    if (_.isNil(bot) || !bot) {
        return res.json({
            status: 'err',
            error: 'Bot not found',
        });
    }

    bot.status = status;

    return res.json({
        status: 'ok',
    });
};
