export type InputType = {
    value: string | number,
    title: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    error: boolean,
    errorMessage: string,
    type?: string
}

export type SelectType = {
    name: string, 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    options: Array<{value: number, label: string }>
    defaultValue: number
}