import { ChangeEvent, useState } from "react";
import Validator from "../utils/Validator";
import Vault from "../models/Vault/Vault";

type InputData = {
    key: string;
    value: string;
    isMandatory: boolean;
    hasError: boolean;
    errorMsg?: string;
}

type FormConfig = {
    mainInputs: InputData[];
    subInputs: InputData[];
}


export type useVaultFormType = {
    handleChange(key: string, type: "main" | "sub", e: ChangeEvent<HTMLInputElement>): void;
    validateForm(): boolean;
    formConfig: FormConfig;
    error: boolean;
    getTexts(): string[];

}

const DEFAULT_FORM_CONFIG: FormConfig = {
    mainInputs: [
        { hasError: false, isMandatory: true, value: "", key: "Title", errorMsg: "Title required" }
    ],
    subInputs: [
        { hasError: false, isMandatory: true, value: "", key: "Text1", errorMsg: "Text1 required" },
        { hasError: false, isMandatory: false, value: "", key: "Text2" },
        { hasError: false, isMandatory: false, value: "", key: "Text3" }
    ]
}

export default function useVaultForm(vault: Vault): useVaultFormType {

    console.log("vault: ", vault);

    const initFormConfig = (): FormConfig => {
        const clone = structuredClone(DEFAULT_FORM_CONFIG);
        if (!vault) {
            return clone;
        }

        clone.mainInputs[0].value = vault.title;
        for (let i = 0; i < vault.texts.length; i++) {
            const text = vault.texts[i];
            if (Validator.string(text).isBlank().validate()) {
                break;
            }
            clone.subInputs[i].value = text;
        }

        return clone;
    }

    const [formConfig, setFormConfig] = useState<FormConfig>(structuredClone(initFormConfig()));
    const [error, setError] = useState<boolean>(false);

    const handleChange = (key: string, type: "main" | "sub", e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setFormConfig(prev => ({
            ...prev,
            [`${type}Inputs`]: prev[`${type}Inputs`].map(input =>
                input.key === key ? { ...input, value } : input
            ),
        }));
    };


    const validateForm = () => {

        const validateInputs = (inputs: InputData[]) => {
            return inputs.map(input => {
                input.hasError = input.isMandatory && Validator.string(input.value).isBlank().validate()
                return input;
            });
        }

        const mainInputs = validateInputs(formConfig.mainInputs);
        const subInputs = validateInputs(formConfig.subInputs);

        if (mainInputs.some(input => input.hasError) || subInputs.some(input => input.hasError)) {
            setFormConfig({ mainInputs, subInputs });
            setError(true);
            return true;
        }

        setError(false);
        return false;
    }


    const getTexts = (): string[] => {
        return [...formConfig.mainInputs.filter(item => item.value && item.value.trim()).map(item => item.value),
        ...formConfig.subInputs.filter(item => item.value && item.value.trim()).map(item => item.value)]
    }
    return { formConfig, handleChange, validateForm, error, getTexts };
}