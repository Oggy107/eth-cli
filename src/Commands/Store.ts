import { localCommand } from "./Command.js";
import { ethers } from "ethers";
import {
    readContent,
    writeContent,
    createFileIfNotExists,
    createDirIfNotExists,
} from "../utils.js";
import os from "os";
import path from "path";
import fs from "fs";
import Logger from "../Logger.js";

import { StoreTypes, Addresses, Keys } from "../types.js";
import { NoConfiguredNameError } from "../errors.js";

export default class Store extends localCommand {
    private static configDirPath: string = path.join(os.homedir(), ".eth-cli");

    private static _store = async <T extends Keys | Addresses>(
        file: string,
        type: StoreTypes,
        name: string,
        data: string
    ) => {
        createFileIfNotExists(file);
        const prevData = await readContent(file);

        if (prevData.length == 0) {
            // const c = {[name]: data}
            await writeContent(file, JSON.stringify([{ [name]: data }]));
            Store.stopSpinner();
            Logger.log("Stored", `stored ${type} successfully`);
        } else {
            const json = JSON.parse(prevData) as T;

            for (let i = 0; i < json.length; i++) {
                const value = json[i];
                if (value[name]) {
                    json[i] = { [name]: data };
                    await writeContent(file, JSON.stringify(json));
                    Store.stopSpinner();

                    Logger.log("Updated", `updated ${type} successfully`);
                    return;
                }
            }

            json.push({ [name]: data });
            await writeContent(file, JSON.stringify(json));

            Store.stopSpinner();
            Logger.log("Stored", `stored ${type} successfully`);
        }
    };

    private static _retrieve = async (file: string, nameToResolve: string) => {
        if (!fs.existsSync(file)) {
            throw new NoConfiguredNameError();
        }

        const json = JSON.parse(await readContent(file)) as Addresses | Keys;

        for (let i = 0; i < json.length; i++) {
            const value = json[i];
            if (value[nameToResolve]) {
                return value[nameToResolve];
            }
        }

        return nameToResolve;
    };

    static store = async (
        type: StoreTypes,
        data: string,
        name: string,
        password?: string
    ) => {
        try {
            Store.startSpinner("Storing data");
            await createDirIfNotExists(Store.configDirPath);

            if (type == "address") {
                Store._store(
                    path.join(Store.configDirPath, "address.json"),
                    "address",
                    name,
                    data
                );
            } else if (type == "private key") {
                const encryptedKey = await ethers.encryptKeystoreJson(
                    new ethers.Wallet(data),
                    password!
                );
                Store._store(
                    path.join(Store.configDirPath, "key.json"),
                    "private key",
                    name,
                    encryptedKey
                );
            }
        } catch (error: any) {
            Store.stopSpinner(false);
            Logger.error(error);
        }
    };

    static retrieve = async (
        type: StoreTypes,
        nameToResolve: string
    ): Promise<string> => {
        if (type == "address") {
            return await Store._retrieve(
                path.join(Store.configDirPath, "address.json"),
                nameToResolve
            );
        } else if (type == "private key") {
            return await Store._retrieve(
                path.join(Store.configDirPath, "key.json"),
                nameToResolve
            );
        } else {
            return nameToResolve;
        }
    };
}
