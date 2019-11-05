import Axios from 'axios';
import {randomHostname, randomStatus} from "./config";
import _ from 'lodash';

export const axiosInstance = Axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
        'X-Server-Hostname': randomHostname(),
    }
});

export const apiAuthenticate = async () => {
    const result = await axiosInstance.post('/bot/auth');

    const token = _.get(result, 'data.token');

    axiosInstance.defaults.headers = {
        ...axiosInstance.defaults.headers,
        'X-Bot-Token': token,
    };
};

export const apiChangeStatus = async (status: string = '') => {
    if (_.isEmpty(status)) {
        status = randomStatus();
    }

    await axiosInstance.post('/bot/pushStatus', {
        status,
    });
};
