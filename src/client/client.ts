import {apiAuthenticate, apiChangeStatus} from "./api";
import {waitSeconds} from "./helpers";
import _ from "lodash";

(
    async () => {
        await apiAuthenticate();

        for (let i = 0; i < 10; i++) {
            await waitSeconds(_.random(4, 8));
            await apiChangeStatus();
        }

        await waitSeconds(_.random(4, 8));
        await apiChangeStatus('dead');

        process.exit();
    }
)();
