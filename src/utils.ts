import fs from "fs";

export const readContent = async (file: string): Promise<string> => {
    return await fs.promises.readFile(file, "utf-8");
};

export const writeContent = async (
    file: string,
    content: string
): Promise<void> => {
    await fs.promises.writeFile(file, content, "utf-8");
};

// export const appendContent = async (
//     file: string,
//     content: string
// ): Promise<void> => {
//     await fs.promises.appendFile(file, content, "utf-8");
// };

export const createFileIfNotExists = (file: string): void => {
    if (!fs.existsSync(file)) {
        fs.closeSync(fs.openSync(file, "w"));
    }
};

export const createDirIfNotExists = async (dir: string): Promise<void> => {
    if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir);
    }
};
