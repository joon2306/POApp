import { useEffect, useRef, useState } from "react";
import { KanbanCardType, KanbanStatus } from "../types/KanbanTypes";
import { IKanbanService } from "../services/IKanbanService";
import { sortKanbanCards } from "../utils/KanbanUtils";


export const useKanban = (kanbanService: IKanbanService) => {

    const [activeCard, setActiveCard] = useState(null);
    const [kanbanCards, setKanbanCards] = useState<KanbanCardType[]>([]);
    const [updateCard, setUpdateCard] = useState(0);

    const handleDrop = (status: number) => {
        if (!activeCard) {
            return;
        }

        const [cardStatus, cardId] = activeCard.split("-");
        if (cardStatus === status) {
            return;
        }
        const selectedCard = kanbanCards.find(card => card.id === cardId);
        if (!selectedCard) {
            return;
        }
        setUpdateCard(updateCard + 1);
        selectedCard.status = +status as unknown as KanbanStatus;

    }

    const handleDragStart = (cardId: string) => {
        setActiveCard(cardId)
    }

    useEffect(() => {
        const loadData = async () => {
            const cards = await kanbanService.getKanbanCards();
            setKanbanCards(sortKanbanCards(cards));
        };
        loadData();
    }, [kanbanService]);

    

    return { handleDrop, handleDragStart, kanbanCards, updateCard};

}