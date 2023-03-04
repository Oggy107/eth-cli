import { ethers, isError } from "ethers";

import { nodeCommand } from "./Command.js";
import { readContent } from "../utils.js";
import Logger from "../Logger.js";
import Store from "./Store.js";
import { NoRegisterdKeyFound } from "../errors.js";

export default class Interact extends nodeCommand {
    constructor(network: string) {
        super(network);
    }

    interact = async (
        _contractAddress: string,
        abiPath: string,
        method: string,
        privateKeyName: string,
        password: string
    ): Promise<void> => {
        Interact.startSpinner(`calling ${method} on contract`);

        try {
            const abi = await readContent(abiPath);

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

            let contractAddress = await Store.retrieve(
                "address",
                _contractAddress
            );

            const contract = new ethers.Contract(
                contractAddress,
                abi,
                new ethers.Wallet(privateKey, this.provider)
            );

            const resp = await eval(`contract.${method}`);

            Interact.stopSpinner();

            const data = {
                resp,
            };

            Logger.log("method call", data);
        } catch (error: any) {
            Interact.stopSpinner(false);

            if (error instanceof NoRegisterdKeyFound) {
                Logger.error(error, {
                    suggestion:
                        "you must first register your private key with secure password using store command",
                });
                process.exit(1);
            } else if (isError(error, "UNCONFIGURED_NAME")) {
                Logger.error(error, {
                    suggestion: "Try checking value of passed contract hash",
                });
                process.exit(1);
            } else if (isError(error, "INVALID_ARGUMENT")) {
                Logger.error(error, {
                    suggestion:
                        "Try checking name of the passed method and it's parameters OR value of private key",
                });
                process.exit(1);
            } else if (isError(error, "UNSUPPORTED_OPERATION")) {
                Logger.error(error, {
                    suggestion:
                        "Try checking datatypes and number of parameters passed to method",
                });
                process.exit(1);
            } else if (error.code == "ENOENT") {
                Logger.error(error, {
                    suggestion: "Try checking path of passed abi or bytecode",
                });
                process.exit(1);
            } else {
                if (error.message.includes("TODO")) {
                    Logger.error(error, {
                        suggestion:
                            "Try checking value of passed contract hash",
                    });
                } else {
                    Logger.error(error);
                }
                process.exit(1);
            }
        }
    };
}
