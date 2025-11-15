import { PulseFormData } from "../hooks/usePulseForm";
import { PiTitle } from "../types/Feature/Pi";
import { Pulse } from "../types/Pulse/Pulse";
import { Sprint } from "../utils/PulseUtils";

export default interface IPulseService {
    getAll(activeSprint: Sprint | "Inactive", piTitle: PiTitle): Promise<Pulse[]>

    saveFeature(pulse: PulseFormData): void;
}