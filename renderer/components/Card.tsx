import styles from "../styles/card/style.module.css";


type Size = `${number}${'px' | 'vh' | '%'}` | "auto";

export type VariableSize = {
    medium: Size;
    large: Size
}
export type CardType = {
    width: VariableSize;
    height: VariableSize;
    Content: React.ComponentType;
    bgColor?: string;
}

export default function Card({ width, height, Content, bgColor }: CardType) {
    return (
        <>
            <div className={`bg-white rounded-xl shadow-md border border-gray-300 p-5 ${styles.card}`} style={{
                "--card-w-md": width.medium,
                "--card-w-lg": width.large,
                "--card-h-md": height.medium,
                "--card-h-lg": height.large,
                ...(bgColor && { backgroundColor: bgColor }),
            } as React.CSSProperties}>
                <Content></Content>
            </div>
        </>
    )
}