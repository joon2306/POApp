import { ChangeEvent, useState } from "react";
import Validator from "../utils/Validator";
import { InputType } from "../types/FormTypes";


type Input = Pick<InputType, "value" | "error" | "errorMessage">;
export type PulseFormData = {
    piTitle: Input;
    piDate: Input;
    featureKey: Input;
    featureTitle: Input;
    featureTarget: Input;
}

export type usePulseForm = {
    formData: PulseFormData;
    handleChange(e: ChangeEvent<HTMLInputElement> | string | ChangeEvent<HTMLSelectElement>, id: string): void;
    handleSubmit: () => void;
}

export default function usePulseForm(): usePulseForm {

    const [formData, setFormData] = useState<PulseFormData>(
        {
            featureKey: {
                value: "",
                error: false,
                errorMessage: "Invalid Feature Key"
            },
            featureTarget: {
                value: 1,
                error: false,
                errorMessage: ""
            },
            featureTitle: {
                value: "",
                error: false,
                errorMessage: "Invalid Feature Title"
            },
            piDate: {
                value: "",
                error: false,
                errorMessage: "Invalid date"

            },
            piTitle: {
                value: "",
                error: false,
                errorMessage: "Invalid PI title"
            }
        }
    );

    const setValue = (e: ChangeEvent<HTMLInputElement> | string | ChangeEvent<HTMLSelectElement>, id: string) => {
        setFormData((prev) => {
            return {
                ...prev, [id]: { ...prev[id], value: (typeof e === "string" ? e : e.target.value) }
            };
        });
    }

    const setError = (error: boolean, id: string, formData: PulseFormData) => {
        formData[id] = { ...formData[id], error };

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement> | string | ChangeEvent<HTMLSelectElement>, id: string) => {
        if (!Object.keys(formData).find(k => k === id)) {
            console.error("invalid input for change");
            return;
        }

        setValue(e, id);

    }

    const validateFormData = () => {
        const stringFields = ["piTitle", "featureKey", "featureTitle", "piDate"];
        const formDataClone = structuredClone<PulseFormData>(formData);
        stringFields.forEach(stringId => setError(Validator.string(formDataClone[stringId].value.toString()).isBlank().validate(), stringId, formDataClone));
        if (!formDataClone.piDate.error && (formDataClone.piDate.value as string) !== "") {
            setError(Validator.date(formData.piDate.value as string).isBefore(new Date()).validate(), "piDate", formDataClone);
        }
        setFormData(formDataClone);

    }

    const handleSubmit = () => {
        validateFormData();
        console.log("formData: ", formData);
    }


    return { formData, handleChange, handleSubmit }

}