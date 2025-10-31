import { variant } from "../../types/ButtonTypes";
import Button, { buttonColors } from "../Button";
import { BsFloppy } from 'react-icons/bs';
import Input from "../Form/Input";
import Card from "../Card";

export default function VaultComponent() {
    return (
        <div className="m-5">
            <Header />
            <div className="border my-5"></div>
            <Body />
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

function Body(): React.ReactElement<void> {

    const labels = ["hello", "world", "test", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10"];

    return (
        <>
            <Button label="Add New Secret" onClick={() => console.log("button clicked")} variant="primary" icon={{ Icon: BsFloppy }} />

            <div>
                <h1 className="text-2xl font-bold text-[black] mt-5">Your Stored Items</h1>

                <div className="mt-5">
                    <Card Content={StoredForm} height={{ large: "auto", medium: "auto" }} width={{ large: "auto", medium: "auto" }}/>
                </div>


                <div className="mt-10 grid md:grid-cols-4 lg:grid-cols-6 gap-10">
                    {
                        labels && labels.map((label, index) => (
                            <>
                                <StoredBtn label={label} key={index} index={index} />
                            </>
                        ))
                    }
                </div>

            </div>

        </>
    )
}


function StoredBtn({ label, index }: { label: string, index: number }): React.ReactElement<{ label: string, index: number }> {

    const getBtnColor = (index: number): variant => {
        index = index > 4 ? index % 5 : index;
        return (Object.keys(buttonColors)[index]) as variant;
    }

    return (

        <>
            <div className="flex justify-center">
                <Button onClick={() => console.log("button clicked")} label={label} variant={getBtnColor(index)} key={index} customStyles="w-[150px] h-[100px]" />
            </div>

        </>
    );
}

function StoredForm() {
    return (
        <div className="mb-5">
            <h1 className="text-2xl font-bold">Add new Stored Item</h1>
            <div className="mt-5">
                <Input title="Title" onChange={() => console.log("a change")} error={false} errorMessage="Title required" value={""} />
                <div className="grid grid-cols-3 mt-5 gap-3">
                    <Input title="Text 1" onChange={() => console.log("a change")} error={false} errorMessage="Text required" value={""} />
                    <Input title="Text 2" onChange={() => console.log("a change")} error={false} errorMessage="" value={""} />
                    <Input title="Text 3" onChange={() => console.log("a change")} error={false} errorMessage="" value={""} />
                </div>
                <div className="mt-5">
                    <Button label="Save New Item" onClick={() => console.log("save")} variant="success" icon={{Icon: BsFloppy}}/>
                </div>
            </div>


        </div>
    )
}