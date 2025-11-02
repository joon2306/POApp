import { variant } from "../../types/ButtonTypes";
import Button, { buttonColors } from "../Button";
import { BsFloppy } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import Input from "../Form/Input";
import Card from "../Card";
import { ChangeEvent, FormEvent, SyntheticEvent, useMemo, useState } from "react";
import Vault from "../../models/Vault/Vault";
import useVault from "../../hooks/useVault";
import Form from "../Form";
import useVaultForm, { useVaultFormType } from "../../hooks/useVaultForm";
import { StringValidator } from "../../utils/StringValidator";

export default function VaultComponent() {
    const { vaults, copy } = useVault();

    return (
        <div className="m-5">
            <Header />
            <div className="border my-5"></div>
            <Body vaults={vaults} copy={copy} />
        </div>
    )
}

function Header(): React.ReactElement<void> {
    return (
        <>
            <h1 className="text-2xl font-bold text-[black]">Secret Store Vault</h1>
            <p>Securely Store your commands, credentials and so on</p>
        </>
    )
}

function Body({ vaults, copy }: { vaults: Vault[], copy: (input: string[]) => Promise<void> }): React.ReactElement<{ vaults: Vault[], copy: (input: string[]) => Promise<void> }> {

    const [toggle, setToggle] = useState<boolean>(false);

    const doToggle = () => {
        setToggle(!toggle);
    }

    return (
        <>
            {!toggle && <Button label="Add New Secret" onClick={doToggle} variant="primary" icon={{ Icon: BsFloppy }} />}
            {toggle && <Button label="Cancel" onClick={doToggle} variant="danger" icon={{ Icon: MdOutlineCancel }} />}

            <div>
                {toggle &&
                    <div className="mt-5">
                        <Card Content={StoredForm} height={{ large: "auto", medium: "auto" }} width={{ large: "auto", medium: "auto" }} />
                    </div>
                }
                <h1 className="text-2xl font-bold text-[black] mt-5">Your Stored Items</h1>

                <div className="mt-10 grid md:grid-cols-4 lg:grid-cols-6 gap-10">
                    {
                        vaults && vaults.map((vault, index) => (

                            <StoredBtn vault={vault} key={index} index={index} copy={copy} />

                        ))
                    }
                </div>

            </div>

        </>
    )
}


function StoredBtn({ vault, index, copy }: { vault: Vault, index: number, copy: (input: string[]) => Promise<void> }): React.ReactElement<{ vault: Vault, index: number }> {

    const [isLoading, setLoading] = useState<boolean>(false);

    const getBtnColor = (index: number): variant => {
        index = index > 4 ? index % 5 : index;
        return (Object.keys(buttonColors)[index]) as variant;
    }

    const handleClick = () => {
        setLoading(true);
        copy(vault.texts)
            .then(() => setLoading(false));
    }

    return (

        <>
            <div className="flex justify-center">
                <Button onClick={handleClick} label={vault.title} variant={getBtnColor(index)} key={index} customStyles="w-[150px] h-[100px]" isLoading={isLoading} />
            </div>

        </>
    );
}

function FormContent({ formProps }: { formProps: useVaultFormType }) {
    const { title, text1, text2, text3, titleError, text1Error, setTitle, setText1, setText2, setText3, setTitleError, setText1Error } = formProps;

    const callbackMap = {
        Title: setTitle,
        Text1: setText1,
        Text2: setText2,
        Text3: setText3
    } as const;

    type Key = keyof typeof callbackMap;

    const handleChange = (key: Key, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value; // do not trim
        callbackMap[key](value);
    };

    return (
        <>
            <Input title="Title" onChange={(e) => handleChange("Title", e)} value={title} error={titleError} errorMessage="Title required" />
            <div className="grid grid-cols-3 mt-5 gap-3">
                <Input title="Text 1" onChange={(e) => handleChange("Text1", e)} value={text1} error={text1Error} errorMessage="Text required" />
                <Input title="Text 2" onChange={(e) => handleChange("Text2", e)} value={text2} error={false} errorMessage="" />
                <Input title="Text 3" onChange={(e) => handleChange("Text3", e)} value={text3} error={false} errorMessage="" />
            </div>
        </>
    );
}

function StoredForm() {
    const formState = useVaultForm(); // hook at top level

    const { title, text1, text2, text3, titleError, setTitleError, text1Error, setText1Error } = formState;

    const validateForm = () => {
        const titleError = StringValidator.validate(title).blank().hasError();
        const text1Error = StringValidator.validate(text1).blank().hasError();
        setTitleError(titleError);
        setText1Error(text1Error);
        return titleError || text1Error;
    }

    const handleSubmit = () => {
        const hasError = validateForm();
        if(hasError) {
            console.log("form invalid");
            return;
        }

        console.log("form has been submitted");
    };

    return (
        <div className="mb-5">
            <h1 className="text-2xl font-bold">Add new Stored Item</h1>
            <div className="mt-5">
                <Form
                    Content={FormContent}
                    error={false}
                    handleSubmit={handleSubmit}
                    submitOnEnter={true}
                    formProps={formState}
                />
                <div className="mt-5">
                    <Button label="Save New Item" onClick={() => console.log("save")} variant="success" icon={{ Icon: BsFloppy }} />
                </div>
            </div>
        </div>
    );
}