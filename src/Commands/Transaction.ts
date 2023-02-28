import { nodeCommand } from "./Command.js";

import Logger from "../Logger.js";
import { NoConfiguredNameError } from "../errors.js";
import Store from "./Store.js";

export default class Transaction extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    showTransaction = async (_hash: string): Promise<void> => {
        Transaction.startSpinner("fetching transaction");

        try {
            let hash = _hash;

            if (!_hash.startsWith("0x")) {
                const tmp = await Store.retrieve("address", _hash);

                if (tmp) {
                    hash = tmp;
                }
            }

            const tx = await this.provider.getTransaction(hash);

            Transaction.stopSpinner();

            Logger.log("transaction", tx);
        } catch (error: any) {
            Transaction.stopSpinner(false);

            if (error instanceof NoConfiguredNameError) {
                Logger.error(error, {
                    suggestion:
                        "can not resolve name to address. Try storing address first using store command",
                });
            } else {
                Logger.error(error, {
                    suggestion: "Try checking value of passed transaction hash",
                });
            }
        }
    };
}
