import { useEffect, useState } from "react";

export const useKanbanCard = (deleteCard: (id: string) => void, id: string) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteCard = () => deleteCard(id);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isHovered && event.key === 'Delete') {
                handleDeleteCard();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHovered]);

    return { setIsHovered }
}