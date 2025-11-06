import { IKanbanService } from "../services/IKanbanService";
import { ToDoKanbanService } from "../services/impl/ToDoKanbanService";

export default interface IKanbanFactory {

    build(): IKanbanService;
}

export type KanbanType = "TODO" | "FEATURE";



export class KanbanFactory implements IKanbanFactory {

    #type: KanbanType;


    constructor(type: KanbanType) {
        this.#type = type;
    }

    static of(type: KanbanType): IKanbanFactory {
        return new KanbanFactory(type);
    }

    build(): IKanbanService {
        if (this.#type === "TODO") {
            return new ToDoKanbanService();
        }
    }
}