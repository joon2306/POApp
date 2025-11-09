import styles from "../styles/card/style.module.css";


type Size = `${number}${'px' | 'vh' | '%'}` | "auto";

export type VariableSize = {
    medium: Size;
    large: Size
}
export type CardType<T> = {
    width: VariableSize;
    height: VariableSize;
    Content: React.ComponentType;
    bgColor?: string;
    customClasses?: string;
    contentProps?: T;
    onClick?: () => void;
    customStyles?: {}
}

const noop = () => { };

export default function Card<T>({ width, height, Content, bgColor, customClasses, contentProps, onClick, customStyles }: CardType<T>) {
    return (
        <>
            <div onClick={onClick ? onClick : noop} className={`bg-white rounded-xl shadow-md border border-gray-300 p-5 ${styles.card} ${customClasses ? customClasses : ""}`} style={{
                "--card-w-md": width.medium,
                "--card-w-lg": width.large,
                "--card-h-md": height.medium,
                "--card-h-lg": height.large,
                ...(bgColor && { backgroundColor: bgColor }),
                ...(customStyles ?? {}),
            } as React.CSSProperties}>
                <Content {...contentProps}></Content>
            </div>
        </>
    )
}