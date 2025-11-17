import { useEffect } from "react";

export default function useKeyboard({ isHovered, callback, keyInput }: { isHovered: boolean, callback: () => void,  keyInput: string}) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isHovered && event.key === keyInput) {
                callback();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHovered]);

}