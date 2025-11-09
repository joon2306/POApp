import { Pulse } from "../types/Pulse/Pulse";

export default interface IPulseService {
    getAll(): Promise<Pulse[]>
}