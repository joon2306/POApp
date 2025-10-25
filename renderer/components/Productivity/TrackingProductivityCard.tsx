import { IconType } from "react-icons";
import Card, { CardType } from "../Card";
import ProgressBar from "../ProgressBar/ProgressBar";

type TrackingProductivityCard = {
    icon: IconType
}

type BodyContentData = {
    text: string;
    color?: string;
    style?: string
}

export type BodyContent = {
    left: BodyContentData;
    right?: BodyContentData;
}

export type TrackingProductivityCardContent = {
    Icon: IconType;
    title: string;
    iconSize: string;
    iconColor: string;
    body: BodyContent[];
    footer: React.ComponentType;
    cardProps: Omit<CardType, "Content">
}

export default function TrackingProductivityCard(content: TrackingProductivityCardContent ) {

    function Header({ Icon, title, iconSize, color }: { Icon: IconType, title: string, iconSize: string | number, color: string }) {
        return (
            <div className="flex justify-between">
                <Icon color={color} size={iconSize} />
                <p className="md:text-xs lg:text-sm md:pt-1 lg:pt-2 font-medium">{title}</p>
            </div>
        )
    }

    function BodyContent({ left, right }: BodyContent) {
        return (
            <div className="flex justify-between mt-1">
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
                        if(i === 0 && item.left.style === undefined) {
                            item.left.style = "text-xl font-bold";
                        }
                        return <BodyContent {...item} key={i} />
                    })
                }
            </div>
        )
    }

    function cardContent() {

        return (
            <>
                <Header Icon={content.Icon} title={content.title} iconSize={content.iconSize} color={content.iconColor} />
                <Body content={content.body} />
                <Footer Content={content.footer}></Footer>
            </>

        )
    }

    return (
        <>
            <Card {...content.cardProps} Content={cardContent}></Card>
        </>

    );
}