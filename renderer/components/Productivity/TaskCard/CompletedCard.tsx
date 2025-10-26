import TaskCard, { TaskCardType, TaskCardTypeTask } from "./TaskCard";
import { FaRegCircleCheck } from 'react-icons/fa6';
import Productivity, { Task } from "../../../../main/model/Productivity";
import { useEffect, useState } from "react";
import { LocalTime } from "../../../utils/LocalTime";

export default function CompletedCard({ productivity, timeFormat }: { productivity: Productivity, timeFormat: (h: number, m: number) => string }) {

    const [card, setCard] = useState<TaskCardType>(null);

    const getTime = (time: number): string => {
        if(!time) {
            return "";
        }
        return LocalTime.of(time).format(timeFormat)
    }

    const getTotalTime: (completedTasks: Task[]) => string = (completedTasks) => {
        if (completedTasks.length === 0) {
            return "0m";
        }
        const totalDuration = completedTasks.reduce((accumulator, { duration }) => {
            return accumulator + duration;
        }, 0);
        return getTime(totalDuration);
    }

    const loadCard: () => void = () => {
        const { completedTasks } = productivity;
        const Icon = FaRegCircleCheck;
        const iconColor = "green";
        type Status = "EFFICIENT" | "GOOD" | "BAD";

        const color: Record<Status, { primary: string; secondary: string }> = {
            EFFICIENT: {
                primary: "#F0FDF4",
                secondary: "green",
            },
            GOOD: {
                primary: "#FEFCE8",
                secondary: "#CA8A04",
            },
            BAD: {
                primary: "#FEF2F2",
                secondary: "#B91C1C",
            },
        };
        const title = "Completed Tasks";
        const subTitle = `Total Time: ${getTotalTime(completedTasks)}`;
        const header = `${completedTasks.length} completed`;

        const calculateEfficiency = (timeSpent: number, timePlanned: number): number => {
            return Math.floor((timePlanned / timeSpent) * 100);
        }

        const getEfficiencyStatus = (efficiency: number): Status => {
            if (efficiency >= 100) {
                return "EFFICIENT";
            } else if (efficiency > 80 ) {
                return "GOOD"
            }
            return "BAD";
        }
        const tasks: TaskCardTypeTask[] = completedTasks.map(completed => {
            const efficiency = calculateEfficiency(completed.duration, completed.time);
            const efficiencyColor =color[getEfficiencyStatus(efficiency)];
            return {
                title: completed.title,
                timePlanned: { text: getTime(completed.time) },
                timeSpent: { text: getTime(completed.duration) },
                additionalTexts: [{ text: `Efficient: ${efficiency}%`, color: efficiencyColor.secondary }],
                color: efficiencyColor,
                bgColor: efficiencyColor.primary,
                status: getEfficiencyStatus(efficiency)
            } as TaskCardTypeTask;
        });
        setCard({
            Icon,
            iconColor,
            header,
            subTitle,
            tasks,
            title
        })

    }

    useEffect(() => {
        let cancelled = false;
        if (!cancelled) {
            loadCard();
        }

        return () => {
            cancelled = true;
        }

    }, [productivity]);


    return (
        <>
            {card && <TaskCard {...card} />}
        </>
    )


}