export type InputType = {
    value: string | number,
    title: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    error: boolean,
    errorMessage: string,
    type?: string,
    disabled? : boolean
}

export type SelectType = {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{value: number, label: string }>;
    defaultValue: number;
    customStyles?: Record<string, string>;
}