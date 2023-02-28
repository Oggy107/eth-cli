import { nodeCommand } from "./Command.js";

import Logger from "../Logger.js";

export default class Blocknumber extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    showBlockNumber = async (): Promise<void> => {
        Blocknumber.startSpinner("fetching block number");

        try {
            const block = (await this.provider.getBlockNumber()).toString();

            const data = {
                latestBlock: block,
            };

            Blocknumber.stopSpinner();

            Logger.log("block number", data);
        } catch (error: any) {
            Blocknumber.stopSpinner(false);

            Logger.error(error);
        }
    };
}
