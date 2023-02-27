import { JsonRpcProvider, ethers } from "ethers";
import ora, { Ora } from "ora";
import logSymbols from "log-symbols";

import config from "../config.js";

abstract class Command {
    protected spinner: Ora = ora({ spinner: "dots5" });

    protected startSpinner = (name: string): void => {
        this.spinner.text = name;
        this.spinner.start();
    };

    /**
     *
     * @param success success indicator. defaults to  true
     */
    protected stopSpinner = (success = true): void => {
        this.spinner.stopAndPersist({
            symbol: success ? logSymbols.success : logSymbols.error,
        });
        console.log();
    };
}

/**
 * nodeCommand interacts with blockchain node. use this to derive commands that need node interaction
 */
export abstract class nodeCommand extends Command {
    protected provider: JsonRpcProvider;

    constructor(network: string) {
        super();

        this.provider = new ethers.JsonRpcProvider(
            network == config.networks.goerli.name
                ? config.networks.goerli.rpc_url
                : config.networks.mainnet.rpc_url
        );
    }
}

/**
 * localCommand does not interact with blockchain node. use this to derive commands that do not need node interaction
 */
export abstract class localCommand extends Command {
    constructor() {
        super();
    }
}
