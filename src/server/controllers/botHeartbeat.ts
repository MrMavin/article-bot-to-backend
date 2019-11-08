import {Request, Response} from "express";
import _ from "lodash";
import {loadBotByToken} from "../models/Bot";

export const botHeartbeat = async (req: Request, res: Response) => {
    const hostname = req.header('X-Server-Hostname');
    const token = req.header('X-Bot-Token');

    if (_.isEmpty(hostname) || _.isEmpty(token)) {
        return res.json({
            status: 'err',
            error: 'Please include hostname and token',
        });
    }

    const bot = await loadBotByToken(hostname, token);

    if (_.isNil(bot) || !bot) {
        return res.json({
            status: 'err',
            error: 'Bot not found',
        });
    }

    bot.gotHeartbeat();

    return res.json({
        status: 'ok',
    });
};
