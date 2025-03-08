import { JiraSelectType } from "../../types/JiraGenerator/JiraTypes";
import styles from "../../styles/Form/Select/style.module.css";

const JiraSelect = ({ name, onChange, options, value }: JiraSelectType) => {
    return (
        <select
            name={name}
            onChange={onChange}
            className={styles.select}
            value={value}
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default JiraSelect;