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
import useInsert from "../../hooks/useInsert";
import useDelete from "../../hooks/useDelete";

type Row = {
    title: string;
    value: string;
}

type Body = {
    pulses: Pulse[];
    piTitle: string;
    piDate: Date;
    deletePi: () => void;
    savePulse: (formData: PulseFormData) => void;
    deletePulse: (pulse: Pulse) => void;
}

type Header = {
    piTitle: string;
    activeSprint: Sprint;
}

type PulseCardType = Pulse & {
    handleChange: usePulseFormType["handleChange"];
    piTitle: string;
    setShow: (show: boolean) => void;
    deletePulse: (pulse: Pulse) => void;
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

    const DeleteConfirmation = <>Are you sure you want to delete?</>

    const { pulses, piTitle, activeSprint, deletePi, savePulse, piDate, deletePulse }: usePulse = usePulse(pulseService, piService, DeleteConfirmation);

    return (
        <div className={`${piTitle ? "m-5" : "flex items-center justify-center w-full h-full"}`}>
            <Header piTitle={piTitle} activeSprint={activeSprint} />
            {piTitle && <div className="border my-5"></div>}
            <Body pulses={pulses} savePulse={savePulse} piTitle={piTitle} deletePi={deletePi} piDate={piDate} deletePulse={deletePulse} />
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

function Body(props: Body) {

    const { pulses, piTitle, deletePi, savePulse, piDate, deletePulse } = props;

    const [show, setShow] = useState<boolean>(false);

    const pulseForm = usePulseForm(savePulse, piTitle, piDate);

    const addFeature = () => {
        pulseForm.reset();
        setShow(!show);
    }


    return (
        <div>
            {
                piTitle &&
                (
                    <div className="flex gap-5">

                        <Button label="Add Feature" onClick={addFeature} variant="success" icon={{ Icon: IoAddOutline }} />
                        <Button label="Delete PI" onClick={deletePi} variant="danger" icon={{ Icon: IoTrashBinOutline }} />
                    </div>
                )
            }
            {(!piTitle || show) &&
                <div className={`${show ? 'mt-3' : ''}`}>
                    <PulseForm {...pulseForm} />
                </div>
            }


            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 mt-10">
                {
                    pulses && pulses.map((pulse, i) => {
                        return <PulseCard  {...{ ...pulse, handleChange: pulseForm.handleChange, piTitle, setShow, deletePulse }} key={i} />
                    })
                }
            </div>
        </div>
    )
}

function PulseCard({ handleChange, piTitle, setShow, deletePulse, ...pulse }: PulseCardType) {

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const insertCallback = () => {
        if (!piTitle) {
            console.error("cannot modify when there is no active PI");
            return;
        }
        handleChange(pulse.featureKey, "featureKey");
        handleChange(pulse.title, "featureTitle");
        handleChange(pulse.target.toString(), "featureTarget");
        setShow(true);
    }

    const deleteCallback = () => {

        deletePulse(pulse);
    }

    useInsert({ isHovered, callback: insertCallback, args: [] });
    useDelete({ isHovered, callback: deleteCallback, arg: null })

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

function PulseForm(pulseForm: usePulseFormType) {

    const { handleSubmit, formError } = pulseForm;

    return (

        <Form error={formError} formProps={pulseForm} Content={PulseFormContent} handleSubmit={handleSubmit}
            submitOnEnter={true} />
    )
}


function PulseFormContent({ formProps }: { formProps: usePulseFormType }) {
    return (
        <div className="mt-3">

            <Card Content={PulseFormCardContent} height={{ large: "auto", medium: "auto" }} width={{ large: "auto", medium: "auto" }} contentProps={formProps} />

        </div>
    )
}

function PulseFormCardContent({ formData, handleChange, piTitle }: usePulseFormType) {

    const isDisabled = !!piTitle;

    return (
        <>
            <h1 className="text-2xl font-bold mb-5">{!piTitle ? "Add " : ""}Your PI Details</h1>
            <Input error={formData.piTitle.error} errorMessage={formData.piTitle.errorMessage} onChange={(e) => handleChange(e, "piTitle")} title="Program Increment" value={formData.piTitle.value} disabled={isDisabled} />
            <div className="my-3">
                <DatePicker error={formData.piDate.error} errorMessage={formData.piDate.errorMessage} label="Select PI Start Date" onChange={(e) => handleChange(e, "piDate")} value={formData.piDate.value.toString()} disabled={isDisabled} />
            </div>

            <h1 className="text-2xl font-bold my-5">Add Your First Feature</h1>
            <div className="my-3 grid grid-cols-3 gap-5">
                <Input error={formData.featureKey.error} errorMessage={formData.featureKey.errorMessage} onChange={(e) => handleChange(e, "featureKey")} title="Jira Key" value={formData.featureKey.value} disabled={isDisabled} />
                <Input error={formData.featureTitle.error} errorMessage={formData.featureTitle.errorMessage} onChange={(e) => handleChange(e, "featureTitle")} title="Title" value={formData.featureTitle.value} />
                <Select name="Sprint Target" options={SPRINT_OPTIONS} onChange={(e) => handleChange(e, "featureTarget")} defaultValue={+formData.featureTarget.value} customStyles={{ maxHeight: "42px" }} />
            </div>

            <div className="mt-5">
                <Button label="Add" variant="success" icon={{ Icon: IoAddOutline }} type="submit" />
            </div>

        </>
    )
}