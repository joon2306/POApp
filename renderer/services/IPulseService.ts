import { PulseFormData } from "../hooks/usePulseForm";
import { Feature, JiraKey } from "../types/Feature/Feature";
import { PiTitle } from "../types/Feature/Pi";
import { JIRA_STATUS, Pulse } from "../types/Pulse/Pulse";
import { Sprint } from "../utils/PulseUtils";

export default interface IPulseService {
    getAll(activeSprint: Sprint, piTitle: PiTitle): Promise<Pulse[]>

    saveFeature(pulse: PulseFormData): void;
    
    deleteJira(featureKey: JiraKey): void;

    modifyFeature(pulse: PulseFormData): void;
}