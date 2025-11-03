import { variant } from "../../types/ButtonTypes";
import Button, { buttonColors } from "../Button";
import { BsFloppy } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import Input from "../Form/Input";
import Card from "../Card";
import { useEffect, useState } from "react";
import Vault from "../../models/Vault/Vault";
import useVault from "../../hooks/useVault";
import Form from "../Form";
import useVaultForm, { useVaultFormType } from "../../hooks/useVaultForm";
import useDelete from "../../hooks/useDelete";
import useInsert from "../../hooks/useInsert";


type BodyType = {
    vaults: Vault[];
    copy: (input: string[]) => Promise<void>;
    add: (texts: string[]) => void;
    deleteVault: (title: string) => void;
    activeVault: Vault;
    setActiveVault: (vault: Vault) => void;
}

type StoreBtnType = {
    vault: Vault;
    index: number;
    copy: (input: string[]) => Promise<void>;
    deleteVault: (title: string) => void;
    setActiveVault: (vault: Vault) => void;
    doToggle: () => void;
    toggle: boolean;
}

type StoreFormType = {
    add: (texts: string[]) => void;
    activeVault: Vault;
    setActiveVault: (vault: Vault) => void;
}

export default function VaultComponent() {
    const { vaults, copy, add, deleteVault, activeVault, setActiveVault } = useVault();

    return (
        <div className="m-5">
            <Header />
            <div className="border my-5"></div>
            <Body vaults={vaults} copy={copy} add={add} deleteVault={deleteVault} activeVault={activeVault} setActiveVault={setActiveVault} />
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


function EmptyContent(): React.ReactElement {
    return (
        <>
            <h1 className="text-xl font-bold"> There are no stored items </h1>
        </>
    )
}

function Body({ vaults, copy, add, deleteVault, activeVault, setActiveVault }: BodyType): React.ReactElement {

    const [toggle, setToggle] = useState<boolean>(false);

    const doToggle = () => {
        setToggle(!toggle);
    }

    const handleAdd = (texts: string[]) => {
        add(texts);
        if (vaults.length === 1) {
            return;
        }
        doToggle();
    }

    return (
        <>

            {vaults && vaults.length > 0 && !toggle && <Button label="Add New Secret" onClick={doToggle} variant="primary" icon={{ Icon: BsFloppy }} />}
            {vaults && vaults.length > 0 && toggle && <Button label="Cancel" onClick={doToggle} variant="danger" icon={{ Icon: MdOutlineCancel }} />}

            <div>
                {(toggle || vaults && vaults.length === 0) &&
                    <div className="mt-5">
                        <Card Content={StoredForm} height={{ large: "auto", medium: "auto" }} width={{ large: "auto", medium: "auto" }} contentProps={{ add: handleAdd, activeVault, setActiveVault }} />
                    </div>
                }
                <h1 className="text-2xl font-bold mt-5 text-[black]">Your Stored Items</h1>

                {vaults && vaults.length > 0 &&
                    <div className="mt-10 grid md:grid-cols-4 lg:grid-cols-6 gap-10">
                        {
                            vaults.map((vault, index) => (

                                <StoredBtn vault={vault} key={index} index={index} copy={copy} deleteVault={deleteVault} setActiveVault={setActiveVault} doToggle={doToggle} toggle={toggle} />

                            ))
                        }
                    </div>
                }
                {
                    !vaults || vaults.length === 0 && (
                        <div className="mt-5">
                            <Card height={{ large: "75px", medium: "75px" }} width={{ large: "auto", medium: "auto" }} Content={EmptyContent} />
                        </div>

                    )
                }

            </div>

        </>
    )
}


function StoredBtn({ vault, index, copy, deleteVault, setActiveVault, doToggle, toggle }: StoreBtnType): React.ReactElement {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const getBtnColor = (index: number): variant => {
        index = index > 4 ? index % 5 : index;
        return (Object.keys(buttonColors)[index]) as variant;
    }

    const handleMouseEnter = () => {
        setIsHovered(true);

    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    const handleClick = () => {
        setLoading(true);
        copy(vault.texts)
            .then(() => setLoading(false));
    }

    const handleInsert = () => {
        if (!toggle) {
            setActiveVault(vault);
            doToggle();
        }
    }

    useDelete({ isHovered, callback: deleteVault, arg: vault.title });
    useInsert({ isHovered, callback: handleInsert, arg: null });

    return (

        <>
            <div className="flex justify-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

function StoredForm({ add, activeVault, setActiveVault }: StoreFormType) {
    const formState = useVaultForm(activeVault);

    const { validateForm, error, getTexts } = formState;

    const handleSubmit = () => {
        const hasError = validateForm();
        if (hasError) {
            return;
        }
        add(getTexts());
    };

    useEffect(() => {
        return () => {
            setActiveVault(null);
        }
    }, []);

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