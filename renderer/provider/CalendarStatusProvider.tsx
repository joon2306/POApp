import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import CalendarService from "../services/impl/CalendarService";
import { CalendarUpdate } from "../types/CalendarTypes";

const CalendarStatusContext = createContext<CalendarUpdate | null>(null);

export function CalendarStatusProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<CalendarUpdate | null>(null);
    const service = useMemo(() => new CalendarService(), []);

    useEffect(() => {
        let mounted = true;
        const unsubscribe = service.subscribe(update => {
            if (mounted) setStatus(update);
        });
        void service.getStatus().then(update => {
            if (mounted && update) setStatus(update);
        }).catch(() => {
            // The main poller will push a detailed failure status when available.
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [service]);

    return (
        <CalendarStatusContext.Provider value={status}>
            {children}
        </CalendarStatusContext.Provider>
    );
}

export function useCalendarStatus(): CalendarUpdate | null {
    return useContext(CalendarStatusContext);
}
