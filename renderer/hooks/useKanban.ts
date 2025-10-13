import { useEffect, useState } from "react";
import { KanbanCardType, KanbanFormValue, KanbanStatus } from "../types/KanbanTypes";
import { IKanbanService } from "../services/IKanbanService";
import { sortKanbanCards } from "../utils/KanbanUtils";


export const useKanban = (kanbanService: IKanbanService) => {

    const [activeCard, setActiveCard] = useState(null);
    const [kanbanCards, setKanbanCards] = useState<KanbanCardType[]>([]);
    const [updateHeight, setUpdateHeight] = useState(0);
    const [updateCards, setUpdateCards] = useState(0);

    const handleDrop = (status: number) => {
        setUpdateHeight(updateHeight + 1);
        if (!activeCard) {
            return;
        }

        const [cardStatus, cardId] = activeCard.split("-");
        if (cardStatus === status) {
            return;
        }
        const selectedCard = kanbanCards.find(card => +card.id === +cardId);
        if (!selectedCard) {
            return;
        }
        selectedCard.status = +status as unknown as KanbanStatus;
        kanbanService.modifyKanbanCard(selectedCard , selectedCard.status);

    }

    const handleDragStart = (cardId: string) => {
        setActiveCard(cardId);
        if (cardId !== null) {
            setUpdateHeight(updateHeight + 1);
        }
    }

    const deleteCard =  (id: string) => {
        kanbanService.deleteKanbanCards(id);
        setUpdateCards(updateCards + 1);
    }

    const saveCard = (arg: KanbanFormValue) => {
        kanbanService.addKanbanCard(arg);
        setUpdateCards(updateCards + 1);
    };

    const modifyCard = (arg: KanbanFormValue) => {
        kanbanService.modifyKanbanCard(arg, undefined);
        setUpdateCards(updateCards + 1);
    }
    const loadData = async () => {
        const cards = await kanbanService.getKanbanCards();
        const sortedCards = sortKanbanCards(cards);
        setKanbanCards(sortedCards);
    };

    useEffect(() => {
        loadData();
    }, [updateCards]);



    return { handleDrop, handleDragStart, kanbanCards, updateHeight, deleteCard, saveCard, modifyCard, loadData };

}