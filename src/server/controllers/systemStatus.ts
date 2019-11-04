import {Request, Response} from "express";
import {availableHosts} from "../config";
import {Pool} from "../models/Pool";
import _ from "lodash";

export const systemStatus = (req: Request, res: Response) => {
    const pools = [];

    _.map(availableHosts, (host: string) => {
        const pool = new Pool(host);

        pool.removeDeadBots();

        pools.push({
            hostname: host,
            bots: pool.getBots(),
        });
    });

    res.render('status', {pools});
};
