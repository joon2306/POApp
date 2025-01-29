export type KanbanStatus = 1 | 2 | 3;
export type KanbanHeaderColor = "pending" | "inProgress" | "onHold";
export type PriorityLevel = 1 | 2 | 3 | 4;

export type HeaderSwimLane = {
  headerTitle: string,
  headerColor: string,
  status: KanbanStatus,
  cards: KanbanCardType[],
  setActiveCard: (index: string) => void,
  onDrop: (status: number) => void,
  calculateHeight : (height: any) => number,
  updateHeight: number,
  deleteCard: (cardId: string) => void
}

export type KanbanCardType = {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: KanbanStatus;
};

export interface KanbanCardProp extends KanbanCardType {
  setActiveCard: (value: string) => void,
  deleteCard: (cardId: string) => void
};

export type SwimLaneConfig = {
  status: KanbanStatus;
  header: {
    title: string;
    color: KanbanHeaderColor;
  };
  cards: KanbanCardType[];
};

export const KANBAN_SWIM_LANE_CONFIG = {
  1: {
    color: "bg-pending-kanban",
    title: "Pending"
  },
  2: {
    color: "bg-inprogress-kanban",
    title: "In Progress"
  },
  3: {
    color: "bg-onhold-kanban",
    title: "On Hold"
  },
} as const;


export const PRIORITY_CONFIG = {
  1: {
    color: "bg-low-priority",
    text: "Low",
    textColor: "text-text-low-priority",
  },
  2: {
    color: "bg-medium-priority",
    text: "Medium",
    textColor: "text-text-medium-priority",
  },
  3: {
    color: "bg-high-priority",
    text: "High",
    textColor: "text-text-high-priority",
  },
  4: {
    color: "bg-critical-priority",
    text: "Critical",
    textColor: "text-text-critical-priority",
  },
} as const;