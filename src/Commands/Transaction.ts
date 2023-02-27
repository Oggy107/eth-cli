import { nodeCommand } from "./Command.js";

import Logger from "../Logger.js";

export default class Block extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    showTransaction = async (hash: string): Promise<void> => {
        this.startSpinner("fetching transaction");

        try {
            const tx = await this.provider.getTransaction(hash);

            this.stopSpinner();

            Logger.log("transaction", tx);
        } catch (error: any) {
            this.stopSpinner(false);

            Logger.error(error, {
                suggestion: "Try checking value of passed transaction hash",
            });
        }
    };
}
