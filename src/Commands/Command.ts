import { JsonRpcProvider, ethers } from "ethers";
import ora, { Ora } from "ora";
import logSymbols from "log-symbols";

import config from "../config.js";

export default abstract class Command {
    protected provider: JsonRpcProvider;
    protected spinner: Ora;

    constructor(network: string) {
        this.provider = new ethers.JsonRpcProvider(
            network == config.networks.goerli.name
                ? config.networks.goerli.rpc_url
                : config.networks.mainnet.rpc_url
        );

        this.spinner = ora({ spinner: "dots5" });
    }

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
