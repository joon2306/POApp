import { FaRegCirclePlay } from "react-icons/fa6";
import TaskCard, { TaskCardType, TaskCardTypeTask } from "./TaskCard";
import { PiWarningCircleBold } from "react-icons/pi";
import Productivity, { Task } from "../../../../main/model/Productivity";
import { useEffect, useState } from "react";
import { LocalTime } from "../../../utils/LocalTime";

export default function InProgressCard({ productivity, timeFormat }: { productivity: Productivity, timeFormat: (h: number, m: number) => string }) {

    const [card, setCard] = useState<TaskCardType>(null);

    const getTime = (time: number): string => {
        if(!time) {
            return "";
        }
        return LocalTime.of(time).format(timeFormat)
    }

    const getTotalTime: (inProgressTasks: Task[]) => string = (inProgressTasks) => {
        if (inProgressTasks.length === 0) {
            return "0m";
        }
        const totalDuration = inProgressTasks.reduce((accumulator, { duration }) => {
            return accumulator + duration;
        }, 0);
        return getTime(totalDuration);
    }

    const getProgress: (timeSpent: number, timePlanned: number) => number = (s, p) => {
        const progress = (s / p) * 100;
        if (progress > 100) {
            return 100
        }

        return progress;
    }

    const loadCard: () => void = () => {
        const { inProgressTasks } = productivity;
        const Icon = FaRegCirclePlay;
        const iconColor = "#EA580C";
        const color = {
            primary: "#FEF2F2",
            secondary: "#B91C1C"
        }
        const title = "In Progress Tasks";
        const subTitle = `Total Time: ${getTotalTime(inProgressTasks)}`;
        const header = `${inProgressTasks.length} active`;
        const getProgressColor = (overTime: string) => overTime ? color.secondary : iconColor;

        const getOvertime = (task: Task) => {
            if (task.duration < task.time) {
                return;
            }
            return getTime(task.duration - task.time);
        }
        const tasks: TaskCardTypeTask[] = inProgressTasks.map(inProgress => {
            const overTime = getOvertime(inProgress);
            return {
                title: inProgress.title,
                timePlanned: { text: getTime(inProgress.time) },
                timeSpent: { text: getTime(inProgress.duration) },
                additionalTexts: overTime ? [{ text: `Overtime: ${overTime}`, color: color.secondary }] : undefined,
                color: color,
                Icon: overTime ? PiWarningCircleBold : undefined,
                progress: { progress: getProgress(inProgress.duration, inProgress.time), color: getProgressColor(overTime)},
                bgColor: overTime ? color.primary : undefined
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