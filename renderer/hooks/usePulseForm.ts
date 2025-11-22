import { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import Validator from "../utils/Validator";
import { InputType } from "../types/FormTypes";


type Input = Pick<InputType, "value" | "error" | "errorMessage">;
export type PulseFormData = {
    piTitle: Input;
    piDate: Input;
    featureKey: Input;
    featureTitle: Input;
}

export type usePulseForm = {
    formData: PulseFormData;
    handleChange(e: ChangeEvent<HTMLInputElement> | string | ChangeEvent<HTMLSelectElement>, id: string): void;
    handleSubmit: FormEventHandler;
    formError: boolean;
    piTitle: string;
    piDate: Date;
    reset: () => void;

}

const defaultFormData: PulseFormData = {
    featureKey: {
        value: "",
        error: false,
        errorMessage: "Invalid Feature Key"
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

export default function usePulseForm(savePulse: (formData: PulseFormData) => void, piTitle: string, piDate: Date): usePulseForm {

    const [formData, setFormData] = useState<PulseFormData>(structuredClone(defaultFormData));
    const [formError, setFormError] = useState<boolean>(false);

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
        stringFields.forEach(stringId => setError(
            Validator.string(formDataClone[stringId].value.toString()).isBlank().validate()
            , stringId, formDataClone));

        if (!formDataClone.piTitle.error) {
            const hasError = Validator.string(formDataClone.piTitle.value.toString()).custom(str => !str.toLowerCase().startsWith("sl")).validate();
            if (hasError) {
                setError(
                    hasError,
                    "piTitle",
                    formDataClone
                );
                formDataClone.piTitle.errorMessage = "Pi Title needs to start with SL";
            }
        }

        setFormData(formDataClone);

        let hasError = false;

        Object.entries(formDataClone).forEach(([k, v]) => {
            if (stringFields.indexOf(k as unknown as string) !== -1) {
                if (v.error) {
                    hasError = true;
                }
            }
        });
        setFormError(hasError);
        return hasError;

    }



    const handleSubmit = (e) => {
        if (!e || validateFormData()) {
            return;
        }

        savePulse(formData);
        reset();
    }

    const reset = () => {
        setFormData(structuredClone(defaultFormData));
    }

    useEffect(() => {
        if (piTitle) {
            setFormData(prev => ({
                ...prev,
                piTitle: { ...prev.piTitle, value: piTitle as string },
                piDate: { ...prev.piDate, value: piDate as unknown as string }
            }));
        }
    }, [piTitle, piDate, formData.featureKey]);


    return { formData, handleChange, handleSubmit, formError, piTitle, piDate, reset }

}