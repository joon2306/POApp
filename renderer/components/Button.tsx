import { ButtonProps, SubmitButtonProps, variant } from "../types/ButtonTypes";
import styles from "../styles/button/style.module.css";
import { useEffect, useState } from "react";

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

const Button = ({ onClick, variant, label, icon, customStyles, isLoading, type }: ButtonProps) => {
    const Icon = icon?.Icon;
    isLoading = !!isLoading;

    const handleClick = () => {
        if (type === "submit" || !onClick) {
            return;
        }
        if (isLoading) {
            return;
        }
        onClick();
    }
    return (

        <button
            style={{
                backgroundColor: buttonColors[variant].color
            }}
            className={`${styles.btn} ${customStyles ?? ''}`}
            onClick={handleClick}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonColors[variant].hover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonColors[variant].color}
            type={type ? type : "button"}
        >
            <div className="flex flex-wrap gap-2 items-center justify-center">
                {!isLoading && icon && <Icon color={icon.color} />} {!isLoading ? label : <LoadingText />}
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

const LoadingText = () => {
    const [dots, setDots] = useState<number>(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev % 3) + 1);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return <span>Processing{'.'.repeat(dots)}</span>;
};


export default Button;

export { SubmitButton };