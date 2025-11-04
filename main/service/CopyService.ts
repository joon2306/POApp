import ICopyService from "./ICopyService";
let instance: CopyService = null;
import { execFile } from "child_process";
import path from "path";
import IExeService from "./IExeService";

export default class CopyService implements ICopyService {

    #exeService: IExeService;
    constructor(exeService: IExeService) {
        if (instance === null) {
            this.#exeService = exeService;
            this.copy = this.copy.bind(this)
            instance = this;
        }
        return this;
    }

    copy(input: string[]): Promise<void> {
        input = input.filter(element => element);
        const clipboardyInput = ["write", ...input];
        console.log("clipboardyInput: ", clipboardyInput);
        return this.#exeService.execute("clipboardy", clipboardyInput);

    }

}