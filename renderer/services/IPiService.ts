import { Pi } from "../types/Feature/Pi";

export default interface IPiService {
    getCurrent(): Promise<Pi>;

    setCurrent(pi: Pi): void; 
}