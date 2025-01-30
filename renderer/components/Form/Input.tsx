import styles from "../../styles/Form/Input/style.module.css";
import { InputType } from "../../types/FormTypes";
const Input = ({ title, value, onChange, error, errorMessage }: InputType) => {

    return (
        <div>
            <input
                type="text"
                name={value}
                value={value}
                placeholder={title}
                onChange={onChange}
                className={styles.input}
                style={{
                    border: `1px solid ${error ? '#ef4444' : '#ccc'}`
                }}
            />
            {error && (
                <p className={styles.error}>
                    {errorMessage}
                </p>
            )}
        </div>
    )

}

export default Input;