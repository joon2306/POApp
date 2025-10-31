import { IconType } from "react-icons";

export interface ButtonProps {
    onClick: () => void;
    variant: variant;
    label: string;
    icon?: {
        Icon: IconType;
        color?: string;
    },
    customStyles?: string
}

export interface SubmitButtonProps {
    variant: variant
    label: string;
    isDisabled: boolean;
}

export type variant = "primary" | "secondary" | "warning" | "danger" | "success";