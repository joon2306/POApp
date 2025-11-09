import { useEffect, useState } from "react";
import IPulseService from "../services/IPulseService";
import { Pulse } from "../types/Pulse/Pulse";
import IPiService from "../services/IPiService";
import { Pi } from "../types/Feature/Pi";


export type usePulse = {
    pulses: Array<Pulse>;
    pi: Pi;
}

export function usePulse(pulseService: IPulseService, piService: IPiService): usePulse {

    const [pulses, setPulses] = useState<Array<Pulse>>([]);
    const [pi, setPi] = useState<Pi>(null);

    let cancelled = false;

    useEffect(() => {
        if (!cancelled) {
            pulseService.getAll()
                .then(response => setPulses(response));
            
            piService.getCurrent().then(pi => setPi(pi));
        }

        return () => {
            cancelled = true;
        }

    }, [pulseService]);



    return { pulses, pi };

}