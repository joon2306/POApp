import { variant } from "../../types/ButtonTypes";
import Button, { buttonColors } from "../Button";
import { BsFloppy } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import Input from "../Form/Input";
import Card from "../Card";
import { useState } from "react";
import Vault from "../../models/Vault/Vault";
import useVault from "../../hooks/useVault";
import Form from "../Form";
import useVaultForm, { useVaultFormType } from "../../hooks/useVaultForm";

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
    const { formConfig, handleChange } = formProps;

    return (
        <>
            {
                formConfig.mainInputs && formConfig.mainInputs.length > 0 && (
                    formConfig.mainInputs.map((input, index) => {
                        return <Input key={index} title={input.key} onChange={(e) => handleChange(input.key, "main", e)} value={input.value} error={input.hasError} errorMessage={input.errorMsg ?? ""} />
                    })
                )
            }
            <div className="grid grid-cols-3 mt-5 gap-3">
                {
                    formConfig.subInputs && formConfig.subInputs.length > 0 && (
                        formConfig.subInputs.map((input, index) => {
                            return <Input key={index} title={input.key} onChange={(e) => handleChange(input.key, "sub", e)} value={input.value} error={input.hasError} errorMessage={input.errorMsg ?? ""} />
                        })
                    )
                }
            </div>
        </>
    );
}

function StoredForm() {
    const formState = useVaultForm();

    const { validateForm, error, reset } = formState;

    const handleSubmit = () => {
        const hasError = validateForm();
        if (hasError) {
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
                    error={error}
                    handleSubmit={handleSubmit}
                    submitOnEnter={true}
                    formProps={formState}
                />
                <div className="mt-5">
                    <Button label="Save New Item" onClick={handleSubmit} variant="success" icon={{ Icon: BsFloppy }} />
                </div>
            </div>
        </div>
    );
}