import { Feature, JiraKey } from "../Feature/Feature";
import { PiTitle } from "../Feature/Pi";


export type State = "NORMAL" | "COMPLETED" | "BLOCKED" | "HAS_DEPENDENCIES" | "INCONSISTENT" | "INCONSISTENT DEPENDENCIES";

type PulseColor = {
    bgColor: string;
    hoverColor: string;
    borderHoverColor: string;
    boxShadow: string;
    progressColor: string;
    bgImage?: string;
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
    },
    INCONSISTENT: {
        bgColor: "#FFFFFF",
        hoverColor: "#FEF2F2",
        borderHoverColor: "#DC2626",
        progressColor: "#DC2626",
        boxShadow: "0 2px 6px rgba(220, 38, 38, 0.3)",
        bgImage: "repeating-linear-gradient(45deg, rgb(255, 255, 255), rgb(255, 255, 255) 15px, rgb(254, 226, 226) 15px, rgb(254, 226, 226) 30px)"
    },
    "INCONSISTENT DEPENDENCIES" : {
        bgColor: "#FFFFFF",
        hoverColor: "#FEF2F2",
        borderHoverColor: "#DC2626",
        progressColor: "#DC2626",
        boxShadow: "0 2px 6px rgba(220, 38, 38, 0.3)",
        bgImage: "repeating-linear-gradient(45deg, rgb(255, 255, 255), rgb(255, 255, 255) 15px, rgb(254, 226, 226) 15px, rgb(254, 226, 226) 30px)"
    }
}

export type Pulse = Feature & {
    state: State;
    tags: Array<State>;
}

export const JIRA_STATUS = {
    PENDING: 1,
    IN_PROGRESS: 2,
    ON_HOLD: 3,
    COMPLETED: 4 
} as const;

export const JIRA_TYPE = {
    FEATURE: 1,
    DEPENDENCY: 2,
    USER_STORY: 3
} as const;

export type JiraType = typeof JIRA_TYPE[keyof typeof JIRA_TYPE];

export type JiraServerResponse = {
    jiraKey: JiraKey;
    title: string;
    target: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    status: typeof JIRA_STATUS [keyof typeof JIRA_STATUS];
    type: typeof JIRA_TYPE[keyof typeof JIRA_TYPE];
    piRef: PiTitle;
    featureRef?: JiraKey;
}