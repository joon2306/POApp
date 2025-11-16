import { useEffect } from "react";

export default function useInsert<T, R>({ isHovered, callback, args }: { isHovered: boolean, callback: (...args: T[]) => R, args: T[] }) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isHovered && event.key === 'Insert') {
                callback(...args);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHovered]);

}