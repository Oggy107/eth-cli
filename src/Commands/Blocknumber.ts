import { nodeCommand } from "./Command.js";

import Logger from "../Logger.js";

export default class Blocknumber extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    showBlockNumber = async (): Promise<void> => {
        this.startSpinner("fetching block number");

        try {
            const block = (await this.provider.getBlockNumber()).toString();

            const data = {
                latestBlock: block,
            };

            this.stopSpinner();

            Logger.log("block number", data);
        } catch (error: any) {
            this.stopSpinner(false);

            Logger.error(error);
        }
    };
}
