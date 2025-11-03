import { useEffect } from "react";

export default function useInsert<T, R>({ isHovered, callback, arg }: { isHovered: boolean, callback: (arg: T) => R, arg: T }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isHovered && event.key === 'Insert') {
                callback(arg);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHovered]);

}