import { SelectedFeature } from "../components/PulseBoard/PulseRouter";
import { KanbanType } from "../factory/KanbanFactory";
import { IModalService } from "../services/impl/ModalService";
import { Sprint } from "../utils/PulseUtils";

export type KanbanStatus = 0 |1 | 2 | 3 | 4;
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
  deleteCard: (id: string) => void,
  saveCard: (arg: KanbanFormValue) => void,
  modifyCard: (arg: KanbanFormValue) => void,
  modalService: IModalService,
  type: KanbanType,
  selectedFeature: SelectedFeature
}

export type KanbanCardType = {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: KanbanStatus;
  time: number;
  target: number;
};

export type KanbanResponse<T> = {
  error: boolean;
  data: T
}
export interface KanbanCardProp extends KanbanCardType {
  setActiveCard: (value: string) => void,
  deleteCard: (id: string) => void,
  modifyCard: (arg: KanbanFormValue) => void,
  modalService: IModalService,
  type: KanbanType,
  selectedFeature: SelectedFeature
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


export type KanbanFormValue = {
  description: string, 
  title: string, 
  priority: number,
  id: string,
  time: number,
  target: number
}

export type KanbanFormType = {
  onValidSubmit: (arg: KanbanFormValue) => void,
  kanbanFormValue?: KanbanFormValue,
  type: KanbanType
}