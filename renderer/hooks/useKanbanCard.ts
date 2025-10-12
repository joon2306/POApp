import { useEffect, useState } from "react";

export const useKanbanCard = (deleteCard: (title: string, description: string) => void, title: string, description: string) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteCard = () => deleteCard(title, description);

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