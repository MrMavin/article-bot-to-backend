import _ from "lodash";

export const availableHosts = [
    'bot-farm-1',
    'bot-farm-2',
    'bot-farm-3',
];

export const validHostname = (hostname: string): boolean => {
    return _.includes(availableHosts, hostname);
};
