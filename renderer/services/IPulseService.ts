import { Pulse } from "../types/Pulse/Pulse";
import { Sprint } from "../utils/PulseUtils";

export default interface IPulseService {
    getAll(activeSprint: Sprint | "Inactive"): Promise<Pulse[]>
}