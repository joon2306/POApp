import styles from "../../styles/Form/Input/style.module.css";
import { InputType } from "../../types/FormTypes";
const Input = ({ title, value, onChange, error, errorMessage, type, disabled, icon }: InputType) => {
    disabled = !!disabled;

    const Icon = icon?.Icon;

    return (
        <div className="relative">
            <input
                type={type || "text"}
                name={value as string}
                value={value}
                placeholder={title}
                onChange={onChange}
                className={styles.input}
                disabled={disabled}
                style={{
                    border: `1px solid ${error ? '#ef4444' : '#ccc'}`
                }}
            >

            </input>
            {icon && Icon &&
                <div className="absolute top-[35%] right-[4%]">
                    <Icon />
                </div>
            }
            {error && (
                <p className={styles.error}>
                    {errorMessage}
                </p>
            )}
        </div>
    )

}

export default Input;