import { KanbanDbItem } from "../model/KanbanItem";
import Productivity from "../model/Productivity";

export default interface IProductivityService {

    get(inProgressCards: KanbanDbItem[]): Productivity;

    add(deletedCard: KanbanDbItem): void;

    handleExpired(): void;
}