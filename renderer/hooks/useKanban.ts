import { useEffect, useState } from "react";
import { KanbanCardType, KanbanFormValue, KanbanStatus } from "../types/KanbanTypes";
import { IKanbanService } from "../services/IKanbanService";
import { sortKanbanCards } from "../utils/KanbanUtils";
import { KanbanType } from "../factory/KanbanFactory";


export const useKanban = (kanbanService: IKanbanService, type: KanbanType) => {

    const [activeCard, setActiveCard] = useState(null);
    const [kanbanCards, setKanbanCards] = useState<KanbanCardType[]>([]);
    const [updateHeight, setUpdateHeight] = useState(0);
    const [updateCards, setUpdateCards] = useState(0);

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


    const handleDrop = (status: number) => {
        setUpdateHeight(updateHeight + 1);
        if (!activeCard) {
            return;
        }


        const [cardStatus, cardId] = extractParts(activeCard)
        if (cardStatus === status) {
            return;
        }
        const selectedCard = kanbanCards.find(card => {
            if (!isTodo) {
                return card.title === cardId;
            }
            return +card.id === +cardId;
        });
        if (!selectedCard) {
            return;
        }
        selectedCard.status = +status as unknown as KanbanStatus;
        kanbanService.modifyKanbanCard(selectedCard, selectedCard.status);

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