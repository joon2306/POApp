import { useEffect, useRef, useState } from "react";
import { KanbanCardType, KanbanStatus } from "../types/KanbanTypes";
import { IKanbanService } from "../services/IKanbanService";
import { sortKanbanCards } from "../utils/KanbanUtils";


export const useKanban = (kanbanService: IKanbanService, calculateHeight) => {

    const [activeCard, setActiveCard] = useState(null);
    const [kanbanCards, setKanbanCards] = useState<KanbanCardType[]>([]);
    const [updateCard, setUpdateCard] = useState(0);

    const divRef = useRef(null);
    const [heightDifference, setHeightDifference] = useState(0);

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
        const cardCount = updateCard + 1;
        console.log(cardCount);
        setUpdateCard(cardCount);
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

    useEffect(() => {
        if (divRef.current) {
            setHeightDifference(calculateHeight(divRef));
        }
    }, [updateCard]);

    return { handleDrop, handleDragStart, kanbanCards, heightDifference, divRef };

}