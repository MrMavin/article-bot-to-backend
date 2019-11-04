import {redisClient} from "../libraries/redis";
import _ from "lodash";
import {Bot, loadBotBySerializedClass} from "./Bot";

export class Pool{
    protected readonly _hostname: string;

    constructor(hostname: string) {
        this._hostname = hostname;
    }

    get hostname() {
        return this._hostname;
    }

    getBots() {
        const bots = redisClient.hvals(this._hostname);

        if (_.isEmpty(bots)) {
            return [];
        }

        return _.map(_.toArray(bots), bot => {
            return loadBotBySerializedClass(bot.toString());
        });
    }

    removeDeadBots() {
        _.map(this.getBots(), (bot: Bot) => {
            if (!bot.isAlive()) {
                bot.kill();
            }
        });
    }
}
