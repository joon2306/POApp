interface KanbanDbItem {
    id?: number;
    title: string;
    description: string;
    priority: number;
    status: number;
    time: number;
}

export default interface KanbanResponse<T> {
    error: boolean;
    data: T;
}

export type { KanbanDbItem };


