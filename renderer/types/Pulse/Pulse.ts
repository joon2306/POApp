import { Feature } from "../Feature/Feature";


export type State = "NORMAL" | "COMPLETED" | "BLOCKED" | "HAS_DEPENDENCIES";

type PulseColor = {
    bgColor: string;
    hoverColor: string;
    borderHoverColor: string;
    boxShadow: string;
    progressColor: string;
}

export const StateColors: Record<State, PulseColor> = {
    NORMAL: {
        bgColor: "#FFFFFF",
        hoverColor: "#F9FAFB",
        borderHoverColor: "#60A5FA",
        boxShadow: "0 2px 6px rgba(96, 165, 250, 0.3)",
        progressColor: "#3B82F6" 
    },
    COMPLETED: {
        bgColor: "#F0FDF4",
        hoverColor: "#DCFCE7",
        borderHoverColor: "#22C55E",
        boxShadow: "0 2px 6px rgba(34, 197, 94, 0.3)",
        progressColor: "#10B981"
    },
    BLOCKED: {
        bgColor: "#FEF2F2",
        hoverColor: "#FEE2E2",
        borderHoverColor: "#EF4444",
        boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)",
        progressColor: "#DC2626"
    },
    HAS_DEPENDENCIES: {
        bgColor: "#FFFBEB",
        hoverColor: "#FEF3C7",
        borderHoverColor: "#F59E0B",
        boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
        progressColor: "#F97316"
    }
}

export type Pulse = Feature & {
    progress: number;
    state: State;
    tags: Array<State>;
}