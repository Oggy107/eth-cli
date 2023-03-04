import { nodeCommand } from "./Command.js";
import { ethers, TransactionLike } from "ethers";

import Logger from "../Logger.js";
import Store from "./Store.js";
import { NoRegisterdKeyFound } from "../errors.js";

export default class SendEth extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    sendEth = async (
        _to: string,
        amount: string,
        privateKeyName: string,
        password: string
    ): Promise<void> => {
        SendEth.startSpinner("sending ether");

        try {
            let privateKey = await Store.retrieve(
                "private key",
                privateKeyName
            );

            if (ethers.isKeystoreJson(privateKey)) {
                privateKey = (
                    await ethers.decryptKeystoreJson(privateKey, password)
                ).privateKey;
            } else {
                throw new NoRegisterdKeyFound();
            }

            let to = await Store.retrieve("address", _to);

            const wallet = new ethers.Wallet(privateKey, this.provider);

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

            if (error instanceof NoRegisterdKeyFound) {
                Logger.error(error, {
                    suggestion:
                        "you must first register your private key with secure password using store command",
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
