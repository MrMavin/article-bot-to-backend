import _ from "lodash";

export const availableHosts = [
    'bot-farm-1',
    'bot-farm-2',
    'bot-farm-3',
];

export const availableStatuses = [
    'running',
    'stopped',
    'waiting',
    'synchronizing',
    'analyzing',
];

export const randomHostname = (): string => {
    return availableHosts[_.random(_.size(availableHosts) - 1)];
};

export const randomStatus = (): string => {
    return availableStatuses[_.random(_.size(availableStatuses) - 1)];
};

