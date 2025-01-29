import { useEffect, useState } from "react";

export const useKanbanCard = (handleDeleteCard: () => void) => {
    const [isHovered, setIsHovered] = useState(false);

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