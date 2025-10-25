import { IconType } from "react-icons";
import Card from "../Card";
import { HiOutlineClock } from 'react-icons/hi';
import ProgressBar from "../ProgressBar/ProgressBar";

type TrackingProductivityCard = {
    icon: IconType
}

type BodyContentData = {
    text: string;
    color?: string;
    style?: string
}

type BodyContent = {
    left: BodyContentData;
    right?: BodyContentData;
}

export default function TrackingProductivityCard() {

    function Header({ title, iconSize, color }: { title: string, iconSize: string | number, color: string }) {
        return (
            <div className="flex justify-between">
                <HiOutlineClock color={color} size={iconSize} />
                <p className="md:text-xs lg:text-sm md:pt-1 lg:pt-2 font-medium">{title}</p>
            </div>
        )
    }

    function BodyContent({ left, right }: BodyContent) {
        return (
            <div className="flex justify-between">
                <div className={left.style ?? "text-sm"} style={{ ...(left.color ? { color: left.color } : {}) }}>{left.text}</div>
                {
                    right &&

                    <p className={right.style ?? ""} style={{ ...(right.color ? { color: right.color } : {}) }}>{right.text}</p>
                }

            </div>
        )
    }

    function Footer({ Content }: { Content: React.ComponentType }) {
        return (
            <div className="mt-3">
                <Content></Content>
            </div>
        )

    }

    function FooterContent() {
        return (
            <ProgressBar color="bg-blue-600" progress={68.75} />
        )
    }

    function Body({ content }: { content: BodyContent[] }) {
        return (
            <div className="mt-2">
                {
                    content &&
                    content.map((item, i) => {
                        if(i === 0) {
                            item.left.style = "text-xl font-bold";
                        }
                        return <BodyContent {...item} key={i} />
                    })
                }
            </div>
        )
    }

    function cardContent() {

        const content: BodyContent[] =
            [
                {
                    left: {
                        text: "2H 30m",
                        color: "#2563EB"
                    }
                },
                {
                    left: {
                        text: "of 8h 0m planned"
                    }
                }
            ]
        return (
            <>
                <Header title={"TIME LEFT"} iconSize={"3vw"} color={"#2563EB"} />
                <Body content={content} />
                <Footer Content={FooterContent}></Footer>
            </>

        )
    }

    return (
        <>
            <Card width={{ large: "300px", medium: "250px" }} height={{ large: "300px", medium: "150px" }} Content={cardContent}></Card>
        </>

    );
}