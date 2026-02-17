import ILogService from "../ILogService";

export default class LoggerService implements ILogService {

    private _id: string;

    constructor(id: string) {
        this._id = `[${id}]`;
    }

    public info(...args: string[]) {
        console.info(this._id, ...args);
    }

}