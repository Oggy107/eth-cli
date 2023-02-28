import { ethers, isError } from "ethers";

import { nodeCommand } from "./Command.js";
import { readContent } from "../utils.js";
import Logger from "../Logger.js";
import Store from "./Store.js";
import { NoConfiguredNameError } from "../errors.js";

export default class Interact extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    interact = async (
        _contract: string,
        abiPath: string,
        method: string,
        key: string | null
    ): Promise<void> => {
        Interact.startSpinner(`calling ${method} on contract`);

        try {
            const abi = await readContent(abiPath);

            const signer = key
                ? new ethers.Wallet(key, this.provider)
                : this.provider;

            let contractAddress = _contract;

            if (!_contract.startsWith("0x")) {
                const tmp = await Store.retrieve("address", _contract);

                if (tmp) {
                    contractAddress = tmp;
                }
            }

            const contract = new ethers.Contract(contractAddress, abi, signer);
            const resp = await eval(`contract.${method}`);

            Interact.stopSpinner();

            const data = {
                data: {
                    resp,
                },
            };

            Logger.log("method call", data);
        } catch (error: any) {
            Interact.stopSpinner(false);

            if (error instanceof NoConfiguredNameError) {
                Logger.error(error, {
                    suggestion:
                        "can not resolve name to address. Try storing address first using store command",
                });
            } else if (isError(error, "INVALID_ARGUMENT")) {
                Logger.error(error, {
                    suggestion:
                        "Try checking name of the passed method and it's parameters OR value of private key",
                });
            } else if (isError(error, "UNSUPPORTED_OPERATION")) {
                Logger.error(error, {
                    suggestion:
                        "Try checking datatypes and number of parameters passed to method",
                });
            } else if (error.code == "ENOENT") {
                Logger.error(error, {
                    suggestion: "Try checking path of passed abi or bytecode",
                });
            } else {
                Logger.error(error);
            }
        }
    };
}
