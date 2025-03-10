import { KanbanCardType } from "../types/KanbanTypes";

export const generateKanbanId = (cards: KanbanCardType[]): number => {
    if (cards.length === 0) return 1;

    return cards.reduce((max, card) => {
        return Math.max(max, parseInt(card.id));
    }, 0) + 1;

};

export const sortKanbanCards = (cards: KanbanCardType[]) => {
    return cards.sort((a, b) => b.priority - a.priority);
}