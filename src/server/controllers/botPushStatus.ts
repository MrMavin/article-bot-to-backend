import {Request, Response} from "express";
import _ from "lodash";
import {loadBotByToken} from "../models/Bot";

export const botPushStatus = async (req: Request, res: Response) => {
    const hostname = req.header('X-Server-Hostname');
    const token = req.header('X-Bot-Token');
    const status = _.get(req.body, 'status');

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

    if (status === 'dead') {
        bot.kill();
    }else{
        bot.status = status;
    }

    return res.json({
        status: 'ok',
    });
};
