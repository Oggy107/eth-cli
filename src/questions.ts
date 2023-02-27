import { DistinctQuestion } from "inquirer";

const getKey: DistinctQuestion = {
    message: "Enter privatek key: ",
    type: "password",
    mask: "*",
    name: "key",
};

const getAbi: DistinctQuestion = {
    message: "Enter contract abi path: ",
    name: "abi",
};

export const networkQuestion: DistinctQuestion = {
    message: "Enter network type to use: ",
    default: "goerli",
    type: "list",
    name: "network",
    choices: ["mainnet", "goerli"],
};

export const blockNumberQuestion: DistinctQuestion = {
    message: "Enter the block number: ",
    type: "number",
    name: "blockNumber",
};

export const balanceQuestion: DistinctQuestion = {
    message: "Enter the address: ",
    name: "address",
};

export const transactionQuestion: DistinctQuestion = {
    message: "Enter transaction hash: ",
    name: "hash",
};

export const compileQuestion: DistinctQuestion = {
    message: "Enter solidity source code path: ",
    name: "src",
};

export const deployQuestion = {
    getByecode: {
        message: "Enter contract bytecode path: ",
        name: "bytecode",
    } as DistinctQuestion,
    getAbi: {
        message: "Enter contract abi path: ",
        name: "abi",
    } as DistinctQuestion,
    getKey,
};

export const interactQuestion = {
    getContractAddress: {
        message: "Enter contract address: ",
        name: "contract",
    } as DistinctQuestion,
    getMethod: {
        message: "Enter method to call (format: methodName(1, 2, 3 ,...)): ",
        name: "method",
    } as DistinctQuestion,
    getAbi,
    getKey,
};

export const sendEthQuestion = {
    getToAddress: {
        message: "Enter address whom to send Ether: ",
        name: "to",
    } as DistinctQuestion,
    getAmount: {
        message: "Enter amount to send: ",
        name: "amount",
    } as DistinctQuestion,
    getKey,
};
