import { Command, Option } from "commander";

import Action from "./actions.js";
import config from "./config.js";

const cli = new Command("eth").version(config.version);

const parse = () => {
    cli.addOption(
        new Option("--network <type>", "network to use")
            .default("goerli")
            .choices(["goerli", "mainnet"])
    );

    cli.command("balance")
        .description("get balance of address")
        .requiredOption("--address <string>", "account or contract address")
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).showBalance(args.address);
        });

    cli.command("blocknumber")
        .description("get latest block number")
        .action(() => {
            const network = cli.opts().network;
            new Action(network).showBlockNumber();
        });

    cli.command("block")
        .description("get block data")
        .requiredOption("--number <block number>", "get data of block number")
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).showBlock(parseInt(args.number));
        });

    cli.command("transaction")
        .description("get transaction data")
        .requiredOption("--hash <transaction hash>", "transaction hash")
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).showTransaction(args.hash);
        });

    cli.command("compile")
        .description(
            "compile solidity smart contract. outputs abi and object code in compiled directory. currently compilation of solidity files without libraries(importing other solidity files) is supported"
        )
        .requiredOption(
            "--src <path>",
            "path to solidity smart contract source code"
        )
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).compile(args.src);
        });

    cli.command("deploy")
        .description("deploy a contract")
        .requiredOption(
            "--bytecode <contract bytecode path>",
            "path to contract bytecode"
        )
        .requiredOption("--abi <abi path>", "path to contract abi")
        .requiredOption("--key <private key>", "private key")
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).deploy(args.bytecode, args.abi, args.key);
        });

    cli.command("interact")
        .description("interact with already deployed contract")
        .requiredOption(
            "--contract <contract address>",
            "address of contract to interact with"
        )
        .requiredOption("--abi <abi paht>", "path to contract abi")
        .requiredOption("--method <method call>", 'eg. --method "getNumber()"')
        .option(
            "--key <private key>",
            "private key is needed to call state changing methods"
        )
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).interact(
                args.contract,
                args.abi,
                args.method,
                args.key
            );
        });

    cli.parse();
};

export default parse;
