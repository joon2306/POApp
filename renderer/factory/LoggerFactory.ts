import ILogService from "../services/ILogService";
import LoggerService from "../services/impl/LoggerService";

export default class LoggerFactory {

    static getLogger(id: string): ILogService {
        return new LoggerService(id);
    }
}