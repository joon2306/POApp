import ICopyService from "./ICopyService";
let instance: CopyService = null;
import { execFile } from "child_process";
import path from "path";

const exePath = path.join(process.env.NODE_ENV === 'production' ? process.resourcesPath : __dirname, "..", "resources", "bin", "clipboardy.exe");
console.log("exePath: ", exePath)
export default class CopyService implements ICopyService {

    constructor() {
        if (instance === null) {
            instance = this;
        }
        return this;
    }

    copy(input: string[]): Promise<void> {
        return new Promise(resolve => {
            input = input.filter(element => element);
            const clipboardyInput = ["write", ...input];
            console.log("clipboardyInput: ", clipboardyInput);
            execFile(exePath, clipboardyInput, (err) => {
                console.error(err)
                resolve();
            });
        })

    }

}