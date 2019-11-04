import {Request, Response} from "express";
import {availableHosts} from "../config";
import {Pool} from "../models/Pool";
import _ from "lodash";

export const systemStatus = async (req: Request, res: Response) => {
    const pools = [];

    await Promise.all(_.map(availableHosts, async (host: string) => {
        const pool = new Pool(host);

        await pool.removeDeadBots();

        pools.push({
            hostname: host,
            bots: await pool.getBots(),
        });
    }));

    res.render('status', {pools});
};
