import styles from "../styles/card/style.module.css";


type Size = `${number}${'px'|'vh'|'%'}`;

type VariableSize = {
    medium: Size;
    large: Size
}
type Card = {
    width: VariableSize;
    height: VariableSize;
    Content: React.ComponentType;
}

export default function Card({ width, height, Content }: Card) {
    return (
        <>
            <div className={`bg-white rounded-xl shadow-sm border p-5 ${styles.card}`} style={{
                "--card-w-md": width.medium,
                "--card-w-lg": width.large,
                "--card-h-md": height.medium,
                "--card-h-lg": height.large
            } as React.CSSProperties}>
                <Content></Content>
            </div>
        </>
    )
}