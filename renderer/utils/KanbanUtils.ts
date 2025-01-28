import { KanbanCardType, KanbanStatus } from "../types/KanbanTypes";

export const generateKanbanIds = (
    cards: Omit<KanbanCardType, "id">[],
    statusPrefixMap: Record<KanbanStatus, string>
): KanbanCardType[] => {
    const grouped = cards.reduce((acc, card) => {
        const prefix = statusPrefixMap[card.status];
        acc[prefix] = acc[prefix] || [];
        acc[prefix].push(card);
        return acc;
    }, {} as Record<string, Omit<KanbanCardType, "id">[]>);

    return Object.entries(grouped).flatMap(([prefix, group]) =>
        group.map((card, index) => ({
            ...card,
            id: `${prefix}_${index + 1}`
        }))
    );
};

export const sortKanbanCards = (cards: KanbanCardType[]) => {
    return cards.sort((a, b) => b.priority - a.priority);
}
