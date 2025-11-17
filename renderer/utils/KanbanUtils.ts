import { COLOR_CONFIG } from "../components";
import { KanbanType } from "../factory/KanbanFactory";
import { Feature, JiraKey, SPRINT_OPTIONS } from "../types/Feature/Feature";
import { KanbanCardType, PriorityLevel } from "../types/KanbanTypes";
import { Sprint } from "./PulseUtils";

export const generateKanbanId = (cards: KanbanCardType[]): number => {
    if (cards.length === 0) return 1;

    return cards.reduce((max, card) => {
        return Math.max(max, parseInt(card.id));
    }, 0) + 1;

};

export const sortKanbanCards = (cards: KanbanCardType[]) => {
    return cards.sort((a, b) => {
        if (a.priority < b.priority) return 1;
        if (a.priority > b.priority) return -1;
        return a.time - b.time
    });
}

export const getTagColors = (type: KanbanType, priority: PriorityLevel,
    sprintTarget: Feature["target"], activeSprint: Sprint): keyof typeof COLOR_CONFIG => {
    if (type === "TODO") {
        switch (priority) {
            case 1:
                return "low";
            case 2:
                return "medium";
            case 3:
                return "high";
            default:
                return "critical";
        }
    }

    const activeSprintTarget = SPRINT_OPTIONS.find(option => option.label === activeSprint).value;
    if (!activeSprintTarget) {
        return "critical";
    }

    if (sprintTarget === activeSprintTarget) {
        return "high";
    }
    if (activeSprintTarget > sprintTarget) {
        return "critical";
    }
    if (sprintTarget - activeSprintTarget  === 1) {
        return "medium";
    }

    return "low";
}