import { nodeCommand } from "./Command.js";
import { ethers, TransactionLike } from "ethers";

import Logger from "../Logger.js";
import Store from "./Store.js";
import { NoConfiguredNameError } from "../errors.js";

export default class SendEth extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    sendEth = async (
        _to: string,
        amount: string,
        key: string
    ): Promise<void> => {
        SendEth.startSpinner("sending ether");

        try {
            const wallet = new ethers.Wallet(key, this.provider);

            let to = _to;

            if (!_to.startsWith("0x")) {
                const tmp = await Store.retrieve("address", _to);

                if (tmp) {
                    to = tmp;
                }
            }

            const tx: TransactionLike = {
                value: ethers.parseEther(amount),
                to,
                from: await wallet.getAddress(),
            };

            const txResponse = await wallet.sendTransaction(tx);

            SendEth.stopSpinner();
            SendEth.startSpinner("waiting for block confirmation");

            const txReciept = await txResponse.wait(1);

            const data = {
                ...txResponse,
                ...txReciept,
            };

            SendEth.stopSpinner();

            Logger.log("transaction", data);
        } catch (error: any) {
            SendEth.stopSpinner(false);

            if (error instanceof NoConfiguredNameError) {
                Logger.error(error, {
                    suggestion:
                        "can not resolve name to address. Try storing address first using store command",
                });
            } else if (ethers.isError(error, "UNCONFIGURED_NAME")) {
                Logger.error(error, {
                    suggestion:
                        "provided address does not seem correct. Try checking it",
                });
            } else if (ethers.isError(error, "INVALID_ARGUMENT")) {
                Logger.error(error, {
                    suggestion:
                        "Try checking value of passed arguments like amount and private key",
                });
            } else if (ethers.isError(error, "INSUFFICIENT_FUNDS")) {
                Logger.error(error, {
                    suggestion: "Your are broke :(",
                });
            } else {
                Logger.error(error);
            }
        }
    };
}
