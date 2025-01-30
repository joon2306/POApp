export type InputType = {
    value: string,
    title: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    error: boolean,
    errorMessage: string
}

export type SelectType = {
    name: string, 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    options: Array<{value: number, label: string }>
    defaultValue: number
}