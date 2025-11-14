import { SelectType } from "../../types/FormTypes";
import styles from "../../styles/Form/Select/style.module.css";

const Select = ({ name, onChange, options, defaultValue, customStyles }: SelectType) => {

    return (
        <select
            name={name}
            onChange={onChange}
            className={styles.select}
            value={defaultValue}
            style={customStyles ? customStyles : {}}
        >

            {
                options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))
            }
        </select>
    )

}

export default Select;