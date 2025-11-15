import { ChangeEvent, useMemo, useState } from "react";
import { usePulse } from "../../hooks/usePulse";
import PulseService from "../../services/impl/PulseService";
import { Pulse, State, StateColors } from "../../types/Pulse/Pulse";
import { PulseUtils, Sprint } from "../../utils/PulseUtils";
import Card from "../Card";
import ProgressBar from "../ProgressBar/ProgressBar";
import Tag from "../Tag/Tag";
import ProgressUtils from "../../utils/ProgressUtils";
import PiService from "../../services/impl/PiService";
import Button from "../Button";
import Form from "../Form";
import Input from "../Form/Input";
import DatePicker from "../Form/DatePicker";
import { IoAddOutline } from "react-icons/io5";
import Select from "../Form/Select";
import usePulseForm, { PulseFormData, usePulseForm as usePulseFormType } from "../../hooks/usePulseForm";
import CommsService from "../../services/impl/CommsService";
import { IoTrashBinOutline } from "react-icons/io5";

type Row = {
    title: string;
    value: string;
}

type Body = {
    pulses: Pulse[];
    piTitle: string;
    deletePi: () => void;
    savePulse: (formData: PulseFormData) => void;
}

type Header = {
    piTitle: string;
    activeSprint: Sprint;
}

const SPRINT_OPTIONS = [
    { value: 1, label: "Sprint 1" },
    { value: 2, label: "Sprint 2" },
    { value: 3, label: "Sprint 3" },
    { value: 4, label: "Sprint 4" },
    { value: 5, label: "Sprint 5" },
    { value: 6, label: "Sprint IP" }
]

export default function PulseBoard() {

    let commsService = useMemo<CommsService>(() => new CommsService(), []);
    let piService = useMemo<PiService>(() => new PiService(commsService), []);
    let pulseService = useMemo<PulseService>(() => new PulseService(commsService), []);

    const DeleteConfirmation = <>Are you sure you want to delete the PI?</>

    const { pulses, piTitle, activeSprint, deletePi, savePulse }: usePulse = usePulse(pulseService, piService, DeleteConfirmation);

    return (
        <div className={`${piTitle ? "m-5" : "flex items-center justify-center w-full h-full"}`}>
            <Header piTitle={piTitle} activeSprint={activeSprint} />
            {piTitle && <div className="border my-5"></div>}
            <Body pulses={pulses} savePulse={savePulse} piTitle={piTitle} deletePi={deletePi}/>
        </div>
    )
}


function Header({ piTitle, activeSprint }: Header) {
    return (
        <div>
            {piTitle && activeSprint &&
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#000000]">Pulse Board</h1>
                        <p>Track your features progress for this PI</p>
                    </div>

                    <div>
                        <p>{piTitle}</p>
                        <h1 className="text-xl font-semibold text-[#000000]">{activeSprint}</h1>
                    </div>

                </div>
            }
        </div>


    )
}

function Body({ pulses, piTitle, deletePi, savePulse }: Body) {
    const pulseForm = usePulseForm(savePulse);
    const { handleSubmit, formError } = pulseForm;


    return (
        <div>
            {
                piTitle &&
                <Button label="Delete PI" onClick={deletePi} variant="danger" icon={{ Icon: IoTrashBinOutline }} />
            }
            {!piTitle &&
                <div>
                    <Form error={formError} formProps={pulseForm} Content={PulseFormContent} handleSubmit={handleSubmit}
                        submitOnEnter={true} />
                </div>
            }


            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 mt-10">
                {
                    pulses && pulses.map((pulse, i) => {
                        return <PulseCard  {...pulse} key={i} />
                    })
                }
            </div>
        </div>
    )
}

function PulseCard(pulse: Pulse) {

    const [isHovered, setIsHovered] = useState<boolean>(false);

    const state = StateColors[pulse.state];

    const customStyles = isHovered ? {
        cursor: "pointer",
        borderColor: state.borderHoverColor,
        transitionProperty: "all",
        transitionDuration: ".2s",
        borderWidth: "2px",
        boxShadow: state.boxShadow,
        backgroundImage: state.bgImage ?? "none"
    } : {
        backgroundImage: state.bgImage ?? "none"
    }


    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Card height={{ large: "150px", medium: "150px" }}
                width={{ large: "auto", medium: "auto" }} Content={Content} contentProps={pulse} bgColor={state.bgColor} customStyles={customStyles} />
        </div>
    )
}

function Content(pulse: Pulse) {
    return (
        <>
            <div>
                <p className="text-sm font-bold text-[#000000]">{pulse.featureKey}</p>
            </div>

            <Row title="TITLE" value={pulse.title} />
            <Row title="TARGET" value={PulseUtils.getSprintTarget(pulse.target)} />

            <div className="mt-5">
                <ProgressBar color={StateColors[pulse.state].progressColor}
                    progress={ProgressUtils.getProgress(pulse.userStories.length + pulse.completedStories.length, pulse.completedStories.length)} />
            </div>

            <Footer tags={pulse.tags} />
        </>

    )
}


function Row({ title, value }: Row) {
    return (

        <div className="grid grid-cols-2 mt-3 font-semibold">

            <p className="text-xs">{title}: </p>
            <p className="text-xs">{value}</p>

        </div>

    )

}


function Footer({ tags }: { tags: Array<State> }) {
    return (
        <div className="flex flex-wrap gap-2 items-center text-xs mt-3">
            {tags && tags.map((tag, i) => <Tag text={tag} key={i} />)}
        </div>
    )
}


function PulseFormContent({ formProps }: { formProps: usePulseFormType }) {
    return (
        <div className="mt-3">

            <Card Content={PulseFormCardContent} height={{ large: "auto", medium: "auto" }} width={{ large: "auto", medium: "auto" }} contentProps={formProps} />

        </div>
    )
}

function PulseFormCardContent({ formData, handleChange }: usePulseFormType) {

    return (
        <>
            <h1 className="text-2xl font-bold mb-5">Add Your PI Details</h1>
            <Input error={formData.piTitle.error} errorMessage={formData.piTitle.errorMessage} onChange={(e) => handleChange(e, "piTitle")} title="Program Increment" value={formData.piTitle.value} />
            <div className="my-3">
                <DatePicker error={formData.piDate.error} errorMessage={formData.piDate.errorMessage} label="Select PI Start Date" onChange={(e) => handleChange(e, "piDate")} value={formData.piDate.value.toString()} />
            </div>

            <h1 className="text-2xl font-bold my-5">Add Your First Feature</h1>
            <div className="my-3 grid grid-cols-3 gap-5">
                <Input error={formData.featureKey.error} errorMessage={formData.featureKey.errorMessage} onChange={(e) => handleChange(e, "featureKey")} title="Jira Key" value={formData.featureKey.value} />
                <Input error={formData.featureTitle.error} errorMessage={formData.featureTitle.errorMessage} onChange={(e) => handleChange(e, "featureTitle")} title="Title" value={formData.featureTitle.value} />
                <Select name="Sprint Target" options={SPRINT_OPTIONS} onChange={(e) => handleChange(e, "featureTarget")} defaultValue={+formData.featureTarget.value} customStyles={{ maxHeight: "42px" }} />
            </div>

            <div className="mt-5">
                <Button label="Add" variant="success" icon={{ Icon: IoAddOutline }} type="submit" />
            </div>

        </>
    )
}