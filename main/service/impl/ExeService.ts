import path from "path";
import IExeService from "../IExeService";
import { execFile } from "child_process";

let instance: ExeService = null;
export default class ExeService implements IExeService {

    constructor() {
        if (instance === null) {
            instance = this;
        }
        return instance;
    }

    execute<T>(exeName: string, args: string[]): Promise<T> {
        const exePath = this.getExePath(exeName);
        console.log("exePath: ", exePath);
        return new Promise((resolve) => {
            execFile(exePath, args, (error, stdout, stderr) => {
                if (error ) console.error(error)
                if (stderr) console.error(stderr)
                resolve(stdout as unknown as T);
            });
        })
    }



    getExePath(exeName: string): string {
        return path.join(process.env.NODE_ENV === 'production' ? process.resourcesPath : __dirname, "..", "resources", "bin", `${exeName}.exe`);
    }
}