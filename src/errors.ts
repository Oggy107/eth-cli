export class NoConfiguredNameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "No Configured Name Error";
    }
}

export class DependencyPresentError extends Error {
    constructor() {
        super(
            "Dependencies in solidity source code detected. Currently only compilation of solidity files without dependencies(without import statements) is supported"
        );
        this.name = "DependencyPresentError";
    }
}

export class CompilationError extends Error {
    data: Array<{}>;

    constructor(errorArray: Array<{}>) {
        super("Compilation Error");
        this.name = "compilationError";
        this.data = errorArray;
    }
}
