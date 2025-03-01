export interface ButtonProps {
    onClick: () => void;
    variant: variant;
    label: string;
}

export interface SubmitButtonProps {
    variant: variant
    label: string;
    isDisabled: boolean;
}

export type variant = "primary" | "secondary" | "warning" | "danger" | "success";