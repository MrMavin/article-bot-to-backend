import {Request, Response} from "express";

export const systemStatus = (req: Request, res: Response) => {
    res.render('status', {});
};
