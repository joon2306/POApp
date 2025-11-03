import { useEffect, useState } from "react";
import useDelete from "./useDelete";

export const useKanbanCard = (deleteCard: (id: string) => void, id: string) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteCard = () => deleteCard(id);
    useDelete({isHovered, callback: handleDeleteCard, arg: id});

    return { setIsHovered }
}