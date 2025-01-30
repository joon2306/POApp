export interface ButtonProps {
    onClick: () => void;
    variant: variant;
    label: string;
}

export type variant = "primary" | "secondary" | "warning" | "danger" | "success";