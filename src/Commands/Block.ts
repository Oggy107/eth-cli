import { nodeCommand } from "./Command.js";

import { isError } from "ethers";

import Logger from "../Logger.js";

export default class Block extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    showBlock = async (blockNumber: number): Promise<void> => {
        this.startSpinner("fetching block");

        try {
            const block = await this.provider.getBlock(blockNumber);

            this.stopSpinner();

            Logger.log("block", block);
        } catch (error: any) {
            this.stopSpinner(false);

            if (isError(error, "INVALID_ARGUMENT")) {
                if (error.message.includes("overflow")) {
                    Logger.error(error, {
                        suggestion:
                            "provided block number is greater than blocks on blockchain. Try providing a lower block number",
                    });
                } else {
                    Logger.error(error, {
                        suggestion:
                            "provided block number does not have number data type. Make sure it is of type number",
                    });
                }
            } else {
                Logger.error(error);
            }
        }
    };
}
