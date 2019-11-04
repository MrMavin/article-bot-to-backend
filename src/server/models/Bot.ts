import {randomBytes} from "crypto";
import {redisClient} from "../libraries/redis";
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
        if (this._token.length <= 0) {
            this.generateToken();
        }

        return this._token;
    }

    public gotHeartbeat() {
        redisClient.set(this.getHeartbeatCacheKey(), "1", "EX", 60 * 2); // two minutes
    }

    public async isAlive() {
        return new Promise((resolve, reject) => {
            redisClient.exists(this.getHeartbeatCacheKey(), (err, res) => {
                if (res === 0) {
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
    }

    public save() {
        const token = this.token;

        const plainClass = classToPlain(this);
        const strObject = JSON.stringify(plainClass);

        redisClient.hset(this.hostname, token, strObject);
    }

    public kill() {
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

export const loadBotByToken = (hostname: string, token: string): Bot | false => {
    const botAsJSONString = redisClient.hget(hostname, token);

    if (!botAsJSONString) {
        return false;
    }

    const botAsJSONObject = JSON.parse(botAsJSONString.toString());

    return plainToClass(Bot, botAsJSONObject);
};

export const loadBotBySerializedClass = (serializedClass: string) => {
    const botAsJSONObject = JSON.parse(serializedClass.toString());

    return plainToClass(Bot, botAsJSONObject);
};
