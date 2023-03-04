import { nodeCommand } from "./Command.js";

import Logger from "../Logger.js";
import Store from "./Store.js";

export default class Transaction extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    showTransaction = async (_hash: string): Promise<void> => {
        Transaction.startSpinner("fetching transaction");

        try {
            let hash = await Store.retrieve("address", _hash);

            const tx = await this.provider.getTransaction(hash);

            Transaction.stopSpinner();

            Logger.log("transaction", tx);
        } catch (error: any) {
            Transaction.stopSpinner(false);

            Logger.error(error, {
                suggestion: "Try checking value of passed transaction hash",
            });
        }
    };
}
