import { localCommand } from "./Command.js";
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

import { StoreTypes, Addresses } from "../types.js";
import { NoConfiguredNameError } from "../errors.js";

export default class Store extends localCommand {
    private static configDirPath: string = path.join(os.homedir(), ".eth-cli");

    static store = async (type: StoreTypes, data: string, name: string) => {
        try {
            Store.startSpinner("Storing data");
            await createDirIfNotExists(Store.configDirPath);

            if (type == "address") {
                const file = path.join(Store.configDirPath, "address.json");

                createFileIfNotExists(file);
                const prevData = await readContent(file);

                if (prevData.length == 0) {
                    // const c = {[name]: data}
                    await writeContent(
                        file,
                        JSON.stringify([{ [name]: data }])
                    );
                    Store.stopSpinner();
                } else {
                    const json = JSON.parse(prevData) as Addresses;

                    for (let i = 0; i < json.length; i++) {
                        const value = json[i];
                        if (value[name]) {
                            json[i] = { [name]: data };
                            await writeContent(file, JSON.stringify(json));
                            Store.stopSpinner();

                            Logger.log(
                                "Updated",
                                "updated address successfully"
                            );
                            return;
                        }
                    }

                    json.push({ [name]: data });
                    await writeContent(file, JSON.stringify(json));

                    Store.stopSpinner();
                    Logger.log("Stored", "stored address successfully");
                }
            }
        } catch (error: any) {
            Store.stopSpinner(false);
            Logger.error(error);
        }
    };

    static retrieve = async (type: StoreTypes, name: string) => {
        if (type == "address") {
            const file = path.join(Store.configDirPath, "address.json");

            if (!fs.existsSync(file)) {
                throw new NoConfiguredNameError(
                    "No configured names for address found"
                );
            }

            const json = JSON.parse(await readContent(file)) as Addresses;

            for (let i = 0; i < json.length; i++) {
                const value = json[i];
                if (value[name]) {
                    return value[name];
                }
            }

            throw new NoConfiguredNameError(
                "No configured names for address found"
            );
        }
    };
}
