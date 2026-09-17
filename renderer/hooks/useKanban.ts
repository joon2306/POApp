import { useEffect, useRef, useState } from "react";
import { KanbanCardType, KanbanFormValue, KanbanStatus } from "../types/KanbanTypes";
import { IKanbanService } from "../services/IKanbanService";
import { sortKanbanCards } from "../utils/KanbanUtils";
import { KanbanType } from "../factory/KanbanFactory";


export const useKanban = (kanbanService: IKanbanService, type: KanbanType) => {

    const [activeCard, setActiveCard] = useState(null);
    const [kanbanCards, setKanbanCards] = useState<KanbanCardType[]>([]);
    const [updateHeight, setUpdateHeight] = useState(0);
    const [updateCards, setUpdateCards] = useState(0);
    const manualOrders = useRef<Record<number, string[]>>({});

    const isTodo = type === "TODO";

    function extractParts(str) {
        const index = str.indexOf('-');
        if (index === -1) return [str]; // fallback if no dash

        const first = str.substring(0, index);
        const rest = str.substring(index + 1);

        // If rest is purely digits -> simple format
        if (/^\d+$/.test(rest)) {
            return [Number(first), Number(rest)];
        }

        // More complex -> keep rest as string
        return [Number(first), rest];
    }

    const resolveDropData = (status: number): { selectedCard: KanbanCardType; previousStatus: number } | null => {
        if (!activeCard) {
            return null;
        }

        const [cardStatus, cardId] = extractParts(activeCard);
        if (cardStatus === status) {
            return null;
        }
        const selectedCard = kanbanCards.find(card => {
            if (!isTodo) {
                return card.title === cardId;
            }
            return +card.id === +cardId;
        });
        if (!selectedCard) {
            return null;
        }
        return { selectedCard, previousStatus: cardStatus };
    };

    const handleDrop = (status: number) => {
        setUpdateHeight(updateHeight + 1);
        const dropData = resolveDropData(status);
        if (!dropData) {
            return;
        }

        dropData.selectedCard.status = +status as unknown as KanbanStatus;
        kanbanService.modifyKanbanCard(dropData.selectedCard, dropData.selectedCard.status);
    }

    const executeDrop = (status: number, card: KanbanCardType) => {
        setUpdateHeight(updateHeight + 1);
        card.status = +status as unknown as KanbanStatus;
        kanbanService.modifyKanbanCard(card, card.status);
    }

    const handleDragStart = (cardId: string) => {
        setActiveCard(cardId);
        if (cardId !== null) {
            setUpdateHeight(updateHeight + 1);
        }
    }

    const deleteCard = (id: string) => {
        kanbanService.deleteKanbanCards(id);
        setUpdateCards(updateCards + 1);
    }

    const saveCard = (arg: KanbanFormValue) => {
        kanbanService.addKanbanCard(arg);
        setUpdateCards(updateCards + 1);
    };

    const modifyCard = (arg: KanbanFormValue) => {
        if (isTodo && arg.id !== undefined) {
            const existingCard = kanbanCards.find(card => String(card.id) === String(arg.id));
            if (existingCard && existingCard.priority !== arg.priority) {
                delete manualOrders.current[+existingCard.status];
            }
        }
        kanbanService.modifyKanbanCard(arg, undefined);
        setUpdateCards(updateCards + 1);
    }

    const getCardKey = (card: KanbanCardType) => isTodo ? String(card.id) : card.title;

    const applyManualOrders = (cards: KanbanCardType[]) => {
        const sortedCards = sortKanbanCards([...cards]);
        const persistedOrders = sortedCards.reduce<Record<number, KanbanCardType[]>>((groups, card) => {
            if (card.order !== undefined) {
                (groups[+card.status] ??= []).push(card);
            }
            return groups;
        }, {});
        Object.entries(persistedOrders).forEach(([status, orderedCards]) => {
            manualOrders.current[+status] = orderedCards
                .sort((left, right) => left.order - right.order)
                .map(getCardKey);
        });
        return Object.entries(manualOrders.current).reduce((result, [status, order]) => {
            const laneStatus = Number(status);
            const laneCards = result.filter(card => +card.status === laneStatus);
            if (laneCards.length === 0) {
                return result;
            }

            const byKey = new Map(laneCards.map(card => [getCardKey(card), card]));
            const orderedLane = order
                .map(key => byKey.get(key))
                .filter((card): card is KanbanCardType => Boolean(card));
            const orderedKeys = new Set(orderedLane.map(getCardKey));
            orderedLane.push(...laneCards.filter(card => !orderedKeys.has(getCardKey(card))));

            let laneIndex = 0;
            return result.map(card => +card.status === laneStatus ? orderedLane[laneIndex++] : card);
        }, sortedCards);
    };

    const reorderCard = (targetId: string, targetStatus: number, sourceId?: string) => {
        if (!activeCard) {
            return;
        }

        const [sourceStatus, activeSourceId] = extractParts(activeCard);
        const sourceKey = String(sourceId || activeSourceId);
        if (+sourceStatus !== +targetStatus || sourceKey === String(targetId)) {
            return;
        }

        setKanbanCards(currentCards => {
            const laneCards = currentCards.filter(card => +card.status === +targetStatus);
            const sourceCard = laneCards.find(card => getCardKey(card) === sourceKey);
            const targetIndex = laneCards.findIndex(card => getCardKey(card) === String(targetId));
            if (!sourceCard || targetIndex < 0) {
                return currentCards;
            }

            const sourceIndex = laneCards.indexOf(sourceCard);
            const insertionIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
            if (sourceIndex === insertionIndex) {
                return currentCards;
            }
            const reorderedLane = [...laneCards];
            reorderedLane.splice(sourceIndex, 1);
            reorderedLane.splice(insertionIndex, 0, sourceCard);
            manualOrders.current[+targetStatus] = reorderedLane.map(getCardKey);
            reorderedLane.forEach((card, order) => {
                kanbanService.modifyKanbanCard({ ...card, order }, undefined);
            });

            let laneIndex = 0;
            return currentCards.map(card => +card.status === +targetStatus ? reorderedLane[laneIndex++] : card);
        });
    };

    const loadData = async () => {
        const cards = await kanbanService.getKanbanCards();
        setKanbanCards(applyManualOrders(cards));
    };

    useEffect(() => {
        loadData();
    }, [updateCards]);



    return { handleDrop, handleDragStart, kanbanCards, updateHeight, deleteCard, saveCard, modifyCard, loadData, resolveDropData, executeDrop, reorderCard };

}
