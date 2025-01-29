import { useEffect, useRef, useState } from "react";

export const useDroppable = (divRef, updateHeight, calculateHeight, isBottom) => {

    const [showHeightButtom, setShowHeightButtom] = useState(true);
    const [heightDifference, setHeightDifference] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShowHeightButtom(!showHeightButtom);
        setHeightDifference(calculateHeight(divRef));
    }, [updateHeight])

    const getHeight = () => {
        if (isBottom && showHeightButtom) {
            return `${heightDifference}px`;
        }
        if (isBottom && !showHeightButtom) {
            return '0px';
        }
        if (show && !isBottom) {
            return '130px';
        }
        return '30px';
    };

    return { getHeight, show, setShow };

}