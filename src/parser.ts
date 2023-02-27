import { Command, Option } from "commander";
import inquirer from "inquirer";
import inquirer_fuzzy_path from "inquirer-fuzzy-path";

import config from "./config.js";

import Balance from "./Commands/Balance.js";
import Block from "./Commands/Block.js";
import Blocknumber from "./Commands/Blocknumber.js";
import Transaction from "./Commands/Transaction.js";
import Compile from "./Commands/Compile.js";
import Deploy from "./Commands/Deploy.js";
import Interact from "./Commands/Interact.js";
import SendEth from "./Commands/SendEth.js";

import {
    networkQuestion,
    blockNumberQuestion,
    balanceQuestion,
    transactionQuestion,
    compileQuestion,
    deployQuestion,
    interactQuestion,
    sendEthQuestion,
} from "./questions.js";

const cli = new Command("eth").version(config.version);

inquirer.registerPrompt("fuzzypath", inquirer_fuzzy_path);
// const ui = new inquirer.ui.BottomBar();
// console.log(ui.log.write("ctrl+c to quit"));

const parse = async () => {
    cli.command("balance")
        .description("get balance of address")
        .action((args) => {
            inquirer
                .prompt([networkQuestion, balanceQuestion])
                .then((answers) => {
                    console.log();
                    new Balance(answers.network).showBalance(answers.address);
                });
        });

    cli.command("blocknumber")
        .description("get latest block number")
        .action(async () => {
            new Blocknumber(cli.opts().network).showBlockNumber();
        });

    cli.command("block")
        .description("get block data")
        .action((args) => {
            inquirer
                .prompt([networkQuestion, blockNumberQuestion])
                .then((answers) => {
                    console.log();
                    new Block(answers.network).showBlock(
                        parseInt(answers.blockNumber)
                    );
                });
        });

    cli.command("transaction")
        .description("get transaction data")
        .action((args) => {
            inquirer
                .prompt([networkQuestion, transactionQuestion])
                .then((answers) => {
                    console.log();
                    new Transaction(answers.network).showTransaction(
                        answers.hash
                    );
                });
        });

    cli.command("compile")
        .description(
            "compile solidity smart contract. outputs abi and object code in compiled directory. currently compilation of solidity files without libraries(importing other solidity files) is supported"
        )
        .action((args) => {
            inquirer.prompt([compileQuestion]).then((answers) => {
                console.log();
                new Compile().compile(answers.src);
            });
        });

    cli.command("deploy")
        .description("deploy a contract")
        .action((args) => {
            inquirer
                .prompt([
                    networkQuestion,
                    deployQuestion.getBytecode,
                    deployQuestion.getAbi,
                    deployQuestion.getKey,
                ])
                .then((answers) => {
                    console.log();
                    new Deploy(answers.network).deploy(
                        answers.bytecode,
                        answers.abi,
                        answers.key
                    );
                });
        });

    cli.command("interact")
        .description("interact with already deployed contract")
        .action((args) => {
            inquirer
                .prompt([
                    networkQuestion,
                    interactQuestion.getContractAddress,
                    interactQuestion.getAbi,
                    interactQuestion.getMethod,
                    interactQuestion.getKey,
                ])
                .then((answers) => {
                    console.log();
                    new Interact(answers.network).interact(
                        answers.contract,
                        answers.abi,
                        answers.method,
                        answers.key
                    );
                });
        });

    cli.command("sendEth")
        .description("send ether to address")
        .action((args) => {
            inquirer
                .prompt([
                    networkQuestion,
                    sendEthQuestion.getToAddress,
                    sendEthQuestion.getAmount,
                    sendEthQuestion.getKey,
                ])
                .then((answers) => {
                    console.log();
                    new SendEth(answers.network).sendEth(
                        answers.to,
                        answers.amount,
                        answers.key
                    );
                });
        });

    cli.parse();
};

export default parse;
