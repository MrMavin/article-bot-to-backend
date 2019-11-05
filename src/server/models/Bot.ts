import {randomBytes} from "crypto";
import {redisClient, redisExists, redisHGET} from "../libraries/redis";
import {classToPlain, plainToClass} from "class-transformer";

export class Bot{
    protected readonly hostname: string;

    protected _token: string = '';
    protected _status: string = '';

    constructor(hostname: string) {
        this.hostname = hostname;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;

        this.save();
    }

    get token(): string {
        // first time getting the token?
        if (this._token.length <= 0) {
            this.generateToken();
        }

        return this._token;
    }

    /**
     * Update the bot's heartbeat
     *
     * The heartbeat is the method that we use in order to keep
     * the bot alive. This means that for every request that
     * we receive from the bot we will update the heartbeat.
     * The heartbeat is a flag in redis that has two
     * minutes expiration time.
     */
    public gotHeartbeat() {
        // two minutes heartbeat
        redisClient.set(this.getHeartbeatCacheKey(), "1", "EX", 60 * 2);
    }

    /**
     * Check if a bot is alive
     *
     * We will check for the heartbeat's cache key to exists.
     * Since when we set it we've configured the expiration in
     * two minutes, if it doesn't exists (so we didn't receive
     * any request in the last two minutes) then the bot
     * is considered dead.
     */
    public async isAlive() {
        return await redisExists(this.getHeartbeatCacheKey());
    }

    public save() {
        // getting the token will generate it if
        // it doesn't exists. This way the class
        // will be converted with all the necessary
        // data
        const token = this.token;

        const plainClass = classToPlain(this);
        const strObject = JSON.stringify(plainClass);

        redisClient.hset(this.hostname, token, strObject);
    }

    public kill(): void {
        redisClient.del(this.getHeartbeatCacheKey());
        redisClient.hdel(this.hostname, this._token);
    }

    protected generateToken() {
        this._token = randomBytes(16).toString('hex');
    }

    protected getHeartbeatCacheKey() {
        return `${this.hostname}_${this.token}`;
    }
}

export const loadBotByToken = async (hostname: string, token: string): Promise<Bot | false> => {
    const botAsJSONString = await redisHGET(hostname, token);

    if (!botAsJSONString) {
        return false;
    }

    const botAsJSONObject = JSON.parse(botAsJSONString.toString());

    const bot = plainToClass(Bot, botAsJSONObject);

    // Update the bot's heartbeat in order to
    // keep it alive for the backend
    bot.gotHeartbeat();

    return bot;
};

export const loadBotBySerializedClass = (serializedClass: string) => {
    const botAsJSONObject = JSON.parse(serializedClass.toString());

    return plainToClass(Bot, botAsJSONObject);
};
