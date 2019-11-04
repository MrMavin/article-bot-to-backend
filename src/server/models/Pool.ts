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

    async getBots(): Promise<Bot[]> {
        return await new Promise((resolve, reject) => {
            redisClient.hvals(this._hostname, (err, bots) => {
                if (_.isNil(bots)) {
                    reject();
                }else{
                    resolve(bots);
                }
            });
        }).then((bots) => {
            return _.map(_.toArray(bots), (bot: string) => {
                return loadBotBySerializedClass(bot);
            });
        }).catch(() => {
            return [];
        });
    }

    async removeDeadBots() {
        const bots = await this.getBots();

        await Promise.all(
            _.map(bots, async (bot: Bot) => {
                const isAlive = await bot.isAlive();

                if (!isAlive) {
                    bot.kill();
                }
            }));
    }
}
