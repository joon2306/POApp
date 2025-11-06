import { IconType } from "react-icons"
import ProgressBar from "../../ProgressBar/ProgressBar";
import Card, { VariableSize } from "../../Card";
import { useEffect, useState } from "react";

type TextColor = {
    text: string;
    color?: string;
}
export type TaskCardTypeTask = {
    title: string;
    Icon?: IconType
    timeSpent: TextColor;
    timePlanned: TextColor;
    additionalTexts?: TextColor[];
    status?: string;
    color?: {
        primary: string;
        secondary: string;
    }
    progress?: {
        color: string;
        progress: number;
    }, 
    bgColor?: string;
}

export type TaskCardType = {
    Icon: IconType;
    iconColor: string;
    title: string;
    subTitle: string;
    header: string;
    tasks: TaskCardTypeTask[];
}

export default function TaskCard(props: TaskCardType) {
    const auto: VariableSize = {
        medium: "auto",
        large: "auto"
    }
    const { Icon } = props;

    function Header() {
        return (
            <div className="flex justify-between">

                <div className="flex gap-4 items-center">
                    <Icon color={props.iconColor} size="3vw" />
                    <div className="mb-2">
                        <h1 className="text-lg font-bold text-[#000000]">{props.title}</h1>
                        <p className="text-sm">{props.subTitle}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <p className="text-sm">{props.header}</p>
                </div>

            </div>
        )
    }

    function EmptyCard(): React.ReactElement {
        const Content = () => {
            return (
                <>
                    <h1 className="text-lg font-semibold">There are no tasks</h1>
                </>
            );
        }
        return (
            <>
                <Card height={auto} width={auto} Content={Content}></Card>

            </>

        );
    }

    function Task(task: TaskCardTypeTask): React.ReactElement {

        function Text({ prefix, val, color }: { prefix?: string, val: string, color: string }) {
            return <span style={color ? { ...{ color: color } } : {}} className="text-xs">{prefix ? `${prefix}:` : ""} {val}</span>
        }

        const { Icon, progress, status } = task;
        const statusColor = task.color ? task.color.secondary : "green";
        function Content() {
            return (
                <div>
                    <div className="flex justify-between mb-5">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-base font-semibold text-[#000000]">{task.title}</h1>
                        {
                            Icon && (
                                <Icon color={task.color?.secondary} />
                            )
                        }
                    </div>

                    <div>
                        {status && (
                            <div className="text-xs text-white font-bold py-1.5 px-3 rounded-full" style={{backgroundColor: statusColor}}>
                                {status}
                            </div>
                        )}
                    </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3">
                        <Text prefix="Time Spent" val={task.timeSpent.text} color={task.timeSpent.color} />
                        <Text prefix="Time Planned" val={task.timePlanned.text} color={task.timePlanned.color} />
                        {
                            task.additionalTexts && task.additionalTexts.length > 0 && task.additionalTexts.map((item, i) => {
                                return (
                                    <div key={i}>
                                        <Text val={item.text} color={item.color} />
                                    </div>
                                )
                            })
                        }
                    </div>

                    {progress && <div className="w-full mt-5">
                        <ProgressBar color={progress.color} progress={progress.progress} />
                    </div>
                    }



                </div>
            )
        }
        return (
            <>
                <Card width={auto} height={auto} Content={Content} bgColor={task.bgColor} />
            </>
        )
    }


    function Body(): React.ReactElement {
        const [tasks, setTasks] = useState<TaskCardTypeTask[]>([]);

        useEffect(() => {
            let cancelled = false;

            if (!cancelled) {
                setTasks(props.tasks);
            }

            return () => {
                cancelled = true;
            }

        }, [props.tasks])

        return (
            <div className="my-3">
                {
                    tasks.length === 0 ? (
                        <>
                            <EmptyCard />
                        </>
                    ) : (
                        <>
                            {
                                tasks.map((task, index) => {
                                    return (
                                        <div className="my-2" key={index}>
                                            <Task {...task} />
                                        </div>

                                    );
                                })
                            }
                        </>
                    )
                }
            </div>
        );

    }


    function Content() {

        return (
            <>
                <Header />
                <Body />
            </>
        )
    }
    return (
        <div className="mt-3">
            <Card width={auto} height={auto} Content={Content} />
        </div>
    )
}