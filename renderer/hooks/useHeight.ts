import { useEffect, useRef, useState } from "react";

export const useHeight = (calculateHeight, updateHeight) => {
    const divRef = useRef(null);
    const [heightDifference, setHeightDifference] = useState(0);

    useEffect(() => {
        if (divRef.current) {
            setHeightDifference(calculateHeight(divRef));
        }
    }, [updateHeight]);

    return { divRef, heightDifference };


}