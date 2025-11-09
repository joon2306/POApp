import { useEffect, useState } from "react";
import IPulseService from "../services/IPulseService";
import { Pulse } from "../types/Pulse/Pulse";
import IPiService from "../services/IPiService";
import { PulseUtils, Sprint } from "../utils/PulseUtils";


export type usePulse = {
    pulses: Array<Pulse>;
    activeSprint: Sprint;
    piTitle: string;
}

export function usePulse(pulseService: IPulseService, piService: IPiService): usePulse {

    const [pulses, setPulses] = useState<Array<Pulse>>([]);
    const [activeSprint, setActiveSprint] = useState<Sprint | "Inactive">("Inactive");
    const [piTitle, setPiTitle] = useState<string>("");

    let cancelled = false;

    useEffect(() => {
        if (!cancelled) {
            piService.getCurrent().then(pi => {
                setPiTitle(pi.title);
                const activeSprint = PulseUtils.getActiveSprint(pi);
                setActiveSprint(activeSprint);
                return activeSprint;
            }).then((activeSprint) => pulseService.getAll(activeSprint))
                .then(response => setPulses(response));
        }

        return () => {
            cancelled = true;
        }

    }, [pulseService]);



    return { pulses, activeSprint, piTitle };

}