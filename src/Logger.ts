import prettyjson from "prettyjson";
import chalk from "chalk";

import { ErrorOptions } from "./types.js";

export default class Logger {
    private static stringifyData = (data: any): string => {
        return JSON.stringify(data, (key, value) => {
            return typeof value === "bigint" ? value.toString() : value;
        });
    };

    static log = (_title: string, _data: any) => {
        const title = chalk.bold.yellow(_title + ":-");

        const data = Logger.stringifyData(_data);

        console.log(`${title}\n${prettyjson.renderString(data)}`);
    };

    static error = (error: any, _options?: ErrorOptions) => {
        const defaultOptions: ErrorOptions = {
            displayWhole: false,
            suggestion: "No Suggestion",
        };

        const options: ErrorOptions = {
            ...defaultOptions,
            ..._options,
        };

        if (!options.displayWhole) {
            const data = {
                name: error.name,
                message: error.message,
                suggestion: options.suggestion,
            };

            console.log(
                `${chalk.bold.red("Error" + ":-")}\n${prettyjson.render(data)}`
            );
        } else {
            const data = this.stringifyData({
                error,
                suggestion: options.suggestion,
            });

            console.log(
                `${chalk.bold.red("Error" + ":-")}\n${prettyjson.renderString(
                    data
                )}`
            );
        }
    };
}
