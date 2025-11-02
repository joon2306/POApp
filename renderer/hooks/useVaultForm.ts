import { useState } from "react";

export type useVaultFormType = {
    title: string;
    text1: string;
    text2: string;
    text3: string;
    titleError: boolean;
    text1Error: boolean;
    setTitle(val: string): void;
    setText1(val: string): void;
    setText2(val: string): void;
    setText3(val: string): void;
    setTitleError(val: boolean): void;
    setText1Error(val: boolean): void;

}

export default function useVaultForm(): useVaultFormType {
    const [title, setTitle] = useState<string>("");
    const [text1, setText1] = useState<string>("");
    const [text2, setText2] = useState<string>("");
    const [text3, setText3] = useState<string>("");
    const [titleError, setTitleError] = useState<boolean>(false);
    const [text1Error, setText1Error] = useState<boolean>(false);
    return { title, text1, text2, text3, titleError, text1Error, setTitle, setText1, setText2, setText3, setTitleError, setText1Error };
}