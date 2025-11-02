import { FormEvent, FormEventHandler } from "react";

export type FormProps<T> = {
    formProps: T;
    Content: React.ComponentType<{formProps: T}>;
    error: boolean;
    handleSubmit: FormEventHandler;
    submitOnEnter: boolean
}

export default function Form<T>({Content, error, handleSubmit, submitOnEnter, formProps}: FormProps<T>) {
    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
    } 
    return (
        <form
            onSubmit={onSubmit}
            className={error ? 'shake' : ''}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
            <Content formProps={formProps}/>
            {submitOnEnter && <button type="submit" style={{ display: 'none' }} />}
        </form>
    )
    
}