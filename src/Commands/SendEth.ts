import Command from "./Command.js";
import { ethers, TransactionLike } from "ethers";

import Logger from "../Logger.js";

export default class SendEth extends Command {
    constructor(network: string) {
        super(network);
    }

    sendEth = async (
        to: string,
        amount: string,
        key: string
    ): Promise<void> => {
        this.startSpinner("sending ether");

        try {
            const wallet = new ethers.Wallet(key, this.provider);

            const tx: TransactionLike = {
                value: ethers.parseEther(amount),
                to,
                from: await wallet.getAddress(),
            };

            const txResponse = await wallet.sendTransaction(tx);

            this.stopSpinner();
            this.startSpinner("waiting for block confirmation");

            const txReciept = await txResponse.wait(1);

            const data = {
                ...txResponse,
                ...txReciept,
            };

            this.stopSpinner();

            Logger.log("transaction", data);
        } catch (error: any) {
            this.stopSpinner(false);

            if (ethers.isError(error, "UNCONFIGURED_NAME")) {
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
