import Redis from 'redis';
import _ from 'lodash';

export const redisClient = Redis.createClient();

export const redisExists = (key: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        redisClient.exists(key, (err, data) => {
            if (!_.isNil(err)) {
                reject(err);
            }

            if (data === 0) {
                resolve(false);
            }else{
                resolve(true);
            }
        });
    });
};

export const redisHGET = (hash: string, field: string): Promise<any | false> => {
    return new Promise<any | false>((resolve, reject) => {
        redisClient.hget(hash, field, (err, data) => {
            if (!_.isNil(err)) {
                reject(err);
            }

            if (!_.isNil(data)) {
                resolve(data);
            }else{
                resolve(false);
            }
        });
    });
};

export const redisHVALS = (hash: string): Promise<any | false> => {
    return new Promise<any | false>((resolve, reject) => {
        redisClient.hvals(hash, (err, data) => {
            if (!_.isNil(err)) {
                reject(err);
            }

            if (!_.isNil(data)) {
                resolve(data);
            }else{
                resolve(false);
            }
        });
    });
};

