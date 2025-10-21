type Productivity = {
    completedTasks: CompletedTask[];
    inProgressTasks: Task[];
    timeRemaining: number;
    timeConsumed: number;
    taskProductivity: number;
    overallProductivity: number;
}

export type Task = {
    title: string;
    duration: number;
    start: number;
    productivity: number;
}

export type CompletedTask = Task & {
    completed: number;
    time: number;
}

export default Productivity;