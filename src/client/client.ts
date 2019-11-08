import {apiAuthenticate, apiChangeStatus, apiHeartBeat} from "./api";
import {waitSeconds} from "./helpers";
import _ from "lodash";

(
    async () => {
        await apiAuthenticate();

        for (let i = 0; i < 10; i++) {
            await waitSeconds(_.random(3, 5));
            // heartbeat is not useful since the change status
            // api will also fire gotHeartbeat
            // await apiHeartBeat();
            await apiChangeStatus();
        }

        await waitSeconds(_.random(3, 5));
        // same as above
        // await apiHeartBeat();
        await apiChangeStatus('dead');

        process.exit();
    }
)();
