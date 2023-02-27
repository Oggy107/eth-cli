import Command from "./Command.js";
import { ethers } from "ethers";

import Logger from "../Logger.js";

export default class Balance extends Command {
    constructor(network: string) {
        super(network);
    }

    showBalance = async (address: string): Promise<void> => {
        this.startSpinner("fetching balance");

        try {
            const balance = (
                await this.provider.getBalance(address)
            ).toString();

            this.stopSpinner();

            const data = {
                wei: balance,
                eth: ethers.formatEther(balance),
            };

            Logger.log("balance", data);
        } catch (error: any) {
            this.stopSpinner(false);

            if (ethers.isError(error, "UNCONFIGURED_NAME")) {
                Logger.error(error, {
                    suggestion:
                        "provided address does not seem correct. Try checking it",
                });
            } else {
                Logger.error(error);
            }
        }
    };
}
