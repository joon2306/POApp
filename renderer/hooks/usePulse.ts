import { useEffect, useState } from "react";
import IPulseService from "../services/IPulseService";
import { Pulse } from "../types/Pulse/Pulse";


export type usePulse = {
    pulses: Array<Pulse>;
}

export function usePulse(pulseService: IPulseService): usePulse {

    const [pulses, setPulses] = useState<Array<Pulse>>([]);

    let cancelled = false;

    useEffect(() => {
        if (!cancelled) {
            pulseService.getAll()
                .then(response => setPulses(response));
        }

        return () => {
            cancelled = true;
        }

    }, [pulseService]);



    return { pulses };

}