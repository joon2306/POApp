import { useEffect, useMemo, useState } from "react";
import CommsService from "../services/impl/CommsService";
import ProductivityService from "../services/impl/ProductivityService";
import Productivity from "../../main/model/Productivity";
import LocalDate from "../utils/LocalDate";

export default function useProductivity() {
    const productivityService = useMemo(() => new ProductivityService(new CommsService()), []);

    const initProductivity: () => Productivity = () => {
        return {
            completedTasks: [],
            inProgressTasks: [],
            overallProductivity: 0,
            taskProductivity: 0,
            timeConsumed: 0,
            timeRemaining: 0
        }
    }

    const [productivity, setProductivity] = useState<Productivity>(initProductivity());
    const [date, setDate] = useState<string>("");

    const initDate: () => void = () => {
        try {
            const dateStr = LocalDate.now().format((d, y, m) => `${d}, ${m} ${y}`);
            setDate(dateStr);
        } catch (error) {
            console.error("error getting date: ", error);
        }
    }

    

    useEffect(() => {
        let cancelled = false;
        initDate();
        const load = async () => {
            productivityService.getProductivity().then(result => {
                if (!cancelled && result) {
                    setProductivity(result)
                }

            });
        }
        load();
        const timeout = setTimeout(() => load(), 1000 * 60 * 3);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        }
    }, [productivityService]);

    return { productivity, date };
}