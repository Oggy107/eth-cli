import { DistinctQuestion } from "inquirer";
import { FuzzyPathQuestionOptions } from "inquirer-fuzzy-path";

const getPathQuestion = (
    message: string,
    name: string
): FuzzyPathQuestionOptions => {
    return {
        type: "fuzzypath",
        name: name,
        excludePath: (nodePath: any) => {
            return (
                nodePath.startsWith("node_modules") ||
                nodePath.startsWith(".git")
            );
        },
        // excludePath :: (String) -> Bool
        // excludePath to exclude some paths from the file-system scan
        excludeFilter: (nodePath: any) => nodePath == ".",
        // excludeFilter :: (String) -> Bool
        // excludeFilter to exclude some paths from the final list, e.g. '.'
        itemType: "any",
        // itemType :: 'any' | 'directory' | 'file'
        // specify the type of nodes to display
        // default value: 'any'
        // example: itemType: 'file' - hides directories from the item list
        rootPath: ".",
        // rootPath :: String
        // Root search directory
        message: message,
        // default: "",
        suggestOnly: false,
        // suggestOnly :: Bool
        // Restrict prompt answer to available choices or use them as suggestions
        depthLimit: 5,
        // depthLimit :: integer >= 0
        // Limit the depth of sub-folders to scan
        // Defaults to infinite depth if undefined
    } as FuzzyPathQuestionOptions;
};

const getAbi: FuzzyPathQuestionOptions = getPathQuestion(
    "Enter contract abi path:",
    "abi"
);

const getKey: DistinctQuestion = {
    message: "Enter privatek key:",
    type: "password",
    mask: "*",
    name: "key",
};

export const networkQuestion: DistinctQuestion = {
    message: "Enter network type to use:",
    default: "goerli",
    type: "list",
    name: "network",
    choices: ["mainnet", "goerli"],
};

export const blockNumberQuestion: DistinctQuestion = {
    message: "Enter the block number:",
    type: "number",
    name: "blockNumber",
};

export const balanceQuestion: DistinctQuestion = {
    message: "Enter the address:",
    name: "address",
};

export const transactionQuestion: DistinctQuestion = {
    message: "Enter transaction hash:",
    name: "hash",
};

export const compileQuestion: FuzzyPathQuestionOptions = getPathQuestion(
    "Enter solidity source code path:",
    "src"
);

export const deployQuestion = {
    getBytecode: getPathQuestion("Enter contract bytecode path:", "bytecode"),
    getAbi,
    getKey,
};

export const interactQuestion = {
    getContractAddress: {
        message: "Enter contract address:",
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
        message: "Enter address whom to send Ether:",
        name: "to",
    } as DistinctQuestion,
    getAmount: {
        message: "Enter amount to send:",
        name: "amount",
    } as DistinctQuestion,
    getKey,
};
