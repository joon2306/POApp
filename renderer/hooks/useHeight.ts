import { useEffect, useRef, useState } from "react";

export const useHeight = (divRef, updateHeight, calculateHeight) => {

    const [showHeightButtom, setShowHeightButtom] = useState(true);
    const [heightDifference, setHeightDifference] = useState(0);

    useEffect(() => {
        setShowHeightButtom(!showHeightButtom);
        setHeightDifference(calculateHeight(divRef));
    }, [updateHeight])

    return { heightDifference, showHeightButtom };

}