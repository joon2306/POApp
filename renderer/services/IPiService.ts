import { Pi, PiTitle } from "../types/Feature/Pi";

export default interface IPiService {
    getCurrent(): Promise<Pi>;

    setCurrent(title: PiTitle, timestamp: number): void; 
    
    removeCurrent(): void;
}