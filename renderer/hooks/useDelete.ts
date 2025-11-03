import { useEffect } from "react";

export default function useDelete<T, R>({ isHovered, callback, arg }: { isHovered: boolean, callback: (arg: T) => R, arg: T }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isHovered && event.key === 'Delete') {
                callback(arg);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHovered]);

}