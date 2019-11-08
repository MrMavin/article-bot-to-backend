import {Request, Response} from "express";
import {availableHosts} from "../config";
import {Pool} from "../models/Pool";
import _ from "lodash";

export const cronRemoveDeadBots = async (req: Request, res: Response) => {
    await Promise.all(
        _.map(availableHosts, async (host: string) => {
            const pool = new Pool(host);

            await pool.removeDeadBots();
        })
    );

    return res.json({
        status: 'ok',
    });
};
