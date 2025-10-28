
import Productivity from "../../../main/model/Productivity";
import useProductivity from "../../hooks/useProductivity";
import Card, { CardType } from "../Card";
import ProgressBar from "../ProgressBar/ProgressBar";
import { HiOutlineClock } from 'react-icons/hi';
import { FaArrowTrendUp, FaRegCalendar, FaRegCircleCheck } from 'react-icons/fa6';
import { LocalTime } from "../../utils/LocalTime";
import { useEffect, useState } from "react";
import Tag from "../Tag/Tag";
import TrackingCard, { BodyContent, TrackingContent } from "./TrackingCard";
import InProgressCard from "./TaskCard/InProgressCards";
import CompletedCard from "./TaskCard/CompletedCard";
import NumberUtils from "../../utils/NumberUtils";


export default function ProductivityComponent() {

    const { productivity, date, trackingProductivityCards } = useProductivity(getTrackingProductivityCards) as {
        productivity: Productivity,
        date: string,
        trackingProductivityCards: TrackingContent[]
    };


    return (
        <div className="m-5">
            <Header date={date}></Header>

            <div className="my-10 grid gap-8 grid-cols-3">
                {
                    trackingProductivityCards.map((card, index) => <TrackingCard {...card} key={index} />)
                }

            </div>
            <div className="grid gap-8 grid-cols-2">
                <InProgressCard productivity={productivity} timeFormat={timeFormat}/>
                <CompletedCard productivity={productivity} timeFormat={timeFormat} />
            </div>
        </div>

    )

}

function Header({ date }: { date: string }) {

    return (
        <div className="flex justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[#000000]">Productivity Dashboard</h1>
                <p>Track your tasks and time efficiency</p>
            </div>

            <div className="mt-1">
                <p>Today's Date</p>
                <p className="text-lg font-semibold text-[#000000]">{date}</p>
            </div>
        </div>
    )

}

function TagFooter({ text }: { text: string }) {
    return (
        <div className="mt-3 flex text-xs items-center">
            <Tag text={text} />
        </div>
    )
}

function getTrackingProductivityCards(productivity: Productivity): TrackingContent[] {


    const cardProps: Omit<CardType, "Content"> = {
        width: {
            large: "300px",
            medium: "100px"
        },
        height: {
            large: "200px",
            medium: "175px"
        }
    };

    const contents: IGetTrackingProductivityCardContent[] = [timeTracking,
        taskTracking, overallTracking, statusTracking];

    return contents.map(content => content(productivity, cardProps));

}

const timeFormat = (h: number, m: number) => h === 0 ? `${m}m` : `${h}h ${m}m`;

interface IGetTrackingProductivityCardContent {
    (productivity: Productivity, cardProps: Omit<CardType, "Content">): TrackingContent;
}


const timeTracking: IGetTrackingProductivityCardContent = (productivity: Productivity, cardProps: Omit<CardType, "Content">) => {
    const content: BodyContent[] =
        [
            {
                left: {
                    text: LocalTime.of(productivity.timeRemaining).format(timeFormat),
                    color: "#2563EB"
                }
            },
            {
                left: {
                    text: "of 7h planned"
                }
            }
        ] as const;

    function Footer() {
        const [progress, setProgress] = useState<number>(0);

        const calculateProgress = () => {
            const progress = (productivity.timeConsumed / (7 * 60)) * 100;
            setProgress(progress);
        }

        useEffect(() => {
            let cancelled = false;
            if (!cancelled) {
                calculateProgress();
            }

            return () => {
                cancelled = true;
            }

        }, [productivity.timeConsumed]);
        return (
            <ProgressBar color="#2563EB" progress={progress} />
        )

    }

    return {
        Icon: HiOutlineClock,
        footer: Footer,
        iconColor: "#2563EB",
        iconSize: "3vw",
        title: "TIME LEFT",
        body: content,
        cardProps
    }
}

const taskTracking: IGetTrackingProductivityCardContent = (productivity: Productivity, cardProps: Omit<CardType, "Content">) => {
    function Footer() {
        const [txt, setTxt] = useState<string>("");

        useEffect(() => {
            let cancelled = false;
            if (!cancelled) {
                const taskProductivity =   productivity.taskProductivity * 100;
                taskProductivity < 90 ? setTxt("Needs Improvement") : setTxt("Good Pace");
            }

            return () => {
                cancelled = true;
            }

        }, [productivity.taskProductivity])
        return (
            <TagFooter text={txt} />
        )
    }

    const content: BodyContent[] =
        [
            {
                left: {
                    text: `${(NumberUtils.of(productivity.taskProductivity * 100).toFixed(2))}%`,
                    color: "#9333EA"
                }
            },
            {
                left: {
                    text: "All tasks average"
                }
            }
        ] as const;

    return {
        Icon: FaArrowTrendUp,
        footer: Footer,
        iconColor: "#9333EA",
        iconSize: "3vw",
        title: "TASK EFFICIENCY",
        body: content,
        cardProps
    }
}

const overallTracking: IGetTrackingProductivityCardContent = (productivity: Productivity, cardProps: Omit<CardType, "Content">) => {
    function Footer() {
        const [txt, setTxt] = useState<string>("");

        useEffect(() => {
            let cancelled = false;
            if (!cancelled) {
                const taskProductivity = productivity.overallProductivity * 100;
                taskProductivity < 75 ? setTxt("Needs Improvement") : setTxt("Good Pace");
            }

            return () => {
                cancelled = true;
            }

        }, [productivity.overallProductivity])
        return (
            <TagFooter text={txt} />
        )
    }

    const content: BodyContent[] =
        [
            {
                left: {
                    text: `${(NumberUtils.of(productivity.overallProductivity * 100).toFixed(2))}%`,
                    color: "#2563EB"
                }
            },
            {
                left: {
                    text: `${LocalTime.of(productivity.timeConsumed).format(timeFormat)} time worked`
                }
            }
        ] as const;

    return {
        Icon: FaRegCalendar,
        footer: Footer,
        iconColor: "#2563EB",
        iconSize: "3vw",
        title: "TODAY'S EFFICIENCY",
        body: content,
        cardProps
    }
}


const statusTracking: IGetTrackingProductivityCardContent = (productivity: Productivity, cardProps: Omit<CardType, "Content">) => {
    function Footer() {
        return (
            <>
            </>
        )
    }

    cardProps.height = {
        large: "150px",
        medium: "125px"
    }

    const content: BodyContent[] =
        [
            {
                left: {
                    text: "Completed",
                    style: ""
                },
                right: {
                    text: productivity.completedTasks.length.toString(),
                    style: "text-[green]"
                }
            },
            {
                left: {
                    text: "In Progress"
                },
                right: {
                    text: productivity.inProgressTasks.length.toString(),
                    style: "text-[red]"
                }
            }
        ] as const;

    return {
        Icon: FaRegCircleCheck,
        footer: Footer,
        iconColor: "green",
        iconSize: "3vw",
        title: "TASKS TODAY",
        body: content,
        cardProps
    }
}


