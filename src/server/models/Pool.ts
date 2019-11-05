import {redisHVALS} from "../libraries/redis";
import _ from "lodash";
import {Bot, loadBotBySerializedClass} from "./Bot";

export class Pool{
    protected readonly _hostname: string;
    protected bots: Bot[] = null;

    constructor(hostname: string) {
        this._hostname = hostname;
    }

    get hostname() {
        return this._hostname;
    }

    /**
     * Load bots from redis cache
     */
    async getBots(): Promise<Bot[]> {
        if (!_.isNil(this.bots)) {
            return this.bots;
        }

        const result = await redisHVALS(this._hostname);

        if (!result) {
            this.bots = [];
        }else{
            const array = _.toArray(result);

            // Bots are returned as a serialized class
            // so we will need to convert it to the
            // Bot class
            this.bots = _.map(array, (bot: string) => {
                return loadBotBySerializedClass(bot);
            });
        }

        return this.bots;
    }

    async removeDeadBots() {
        const bots = await this.getBots();

        await Promise.all(
            _.map(bots, async (bot: Bot) => {
                const isAlive = await bot.isAlive();

                if (!isAlive) {
                    // Perform a local cache clear
                    // next time bots will be reloaded
                    this.bots = null;

                    bot.kill();
                }
            }));
    }
}
