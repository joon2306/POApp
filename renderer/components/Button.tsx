import { ButtonProps, SubmitButtonProps, variant } from "../types/ButtonTypes";
import styles from "../styles/button/style.module.css";

export type ButtonColors = {
    [key in variant]: {
        color: string;
        hover: string;
    };
};

export const buttonColors: ButtonColors = {
    primary: {
        color: "#007bff",
        hover: "#0056b3"
    },
    secondary: {
        color: "#6c757d",
        hover: "#545b62"
    },
    warning: {
        color: "#ffc107",
        hover: "#e0a800"
    },
    success: {
        color: "#28a745",
        hover: "#1e7e34"
    },
    danger: {
        color: "#dc3545",
        hover: "#bd2130"
    },


} as const;

const Button = ({ onClick, variant, label, icon, customStyles }: ButtonProps) => {
    const Icon = icon?.Icon;
    return (
        <button
            style={{
                backgroundColor: buttonColors[variant].color
            }}
            className={`${styles.btn} ${customStyles ?? ''}`}
            onClick={onClick}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonColors[variant].hover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonColors[variant].color}
        >
            <div className="flex flex-wrap gap-2 items-center justify-center">
                {icon && <Icon color={icon.color} />} {label}
            </div>
        </button>
    )


}


const SubmitButton = ({ variant, label, isDisabled }: SubmitButtonProps


) => {
    return (
        <button
            style={{
                backgroundColor: buttonColors[variant].color
            }}
            className={styles.btn}
            type="submit"
            disabled={isDisabled}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonColors[variant].hover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonColors[variant].color}
        >
            {label}
        </button>

    )


}


export default Button;

export { SubmitButton };