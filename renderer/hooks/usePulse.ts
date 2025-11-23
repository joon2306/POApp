import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import IPulseService from "../services/IPulseService";
import { PlannedPulse, Pulse } from "../types/Pulse/Pulse";
import IPiService from "../services/IPiService";
import { PulseUtils, Sprint } from "../utils/PulseUtils";
import { useModalService } from "../services/impl/ModalService";
import { ModalType } from "../types/ModalTypes";
import { PulseFormData } from "./usePulseForm";
import { PiTitle } from "../types/Feature/Pi";
import { JiraKey } from "../types/Feature/Feature";


export type usePulse = {
    pulses: Array<Pulse> | Array<PlannedPulse>;
    activeSprint: Sprint;
    piTitle: string;
    piDate: Date;
    deletePi: () => void;
    savePulse: (formData: PulseFormData) => void;
    deletePulse: (pulse: Pulse | PlannedPulse) => void;
    search: string;
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function usePulse(pulseService: IPulseService, piService: IPiService, DeleteElement: ReactNode): usePulse {

    const [pulses, setPulses] = useState<Array<Pulse>>([]);
    const [activeSprint, setActiveSprint] = useState<Sprint>("Inactive");
    const [piTitle, setPiTitle] = useState<string>("");
    const [piDate, setPiDate] = useState<Date>(null);
    const [count, setCount] = useState<number>(0);
    const [search, setSearch] = useState<string>("");

    let cancelled = false;

    const { openModal, closeModal } = useModalService();

    const trigger = () => {
        setCount((prev) => ++prev);
    }

    const deleteModal: (callback) => ModalType = (callback) => {
        return {
            title: "Confirmation",
            closeOnBackdrop: true,
            buttons: [
                {
                    label: "confirm",
                    variant: "primary",
                    onClick: () => {
                        callback();
                        closeModal();
                        trigger();
                    }
                }
            ],
            content: DeleteElement
        };
    }

    const deletePi = () => {
        openModal(deleteModal(piService.removeCurrent));
    }

    const savePulse = (formData: PulseFormData) => {
        if (!piTitle) {
            piService.setCurrent(formData.piTitle.value as PiTitle, new Date(formData.piDate.value).getTime());
        }
        piTitle ? modifyPulse(formData) : pulseService.saveFeature(formData)
        trigger();
    }

    const modifyPulse = (formData: PulseFormData) => {
        pulseService.modifyFeature(formData);
    }

    const deletePulse = (pulse: Pulse | PlannedPulse) => {
        openModal(deleteModal(() => pulseService.deleteJira((pulse as PlannedPulse).type === "PLANNED" ? pulse.title as JiraKey : (pulse as Pulse).featureKey)));
    }

    const compareStr = (str1: string, str2: string) => {
        return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
    }

    const filterPulses = (pulses: Pulse[], filterValue: string) => {
        return pulses.filter(pulse => compareStr(pulse.featureKey, filterValue)
            || compareStr(pulse.title, filterValue) || compareStr(PulseUtils.getSprintTarget(pulse.target), filterValue));
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        if (val.trim() !== "") {
            pulseService.getAll(activeSprint, piTitle as PiTitle)
                .then(pulses => {
                    pulses = filterPulses(pulses, val);
                    setPulses(pulses);
                });
        }
    }

    useEffect(() => {
        if (!cancelled) {
            piService.getCurrent().then(pi => {
                if (pi === null) {
                    setPiTitle("");
                    return ["Inactive"];
                }
                setPiTitle(pi.title);
                setPiDate(new Date(pi.sprintTimestamp.first))
                const activeSprint: Sprint = PulseUtils.getActiveSprint(pi);
                setActiveSprint(activeSprint);
                return [activeSprint, pi.title];
            })
                .then(([activeSprint, piTitle]: [Sprint | "Inactive", PiTitle]) => {
                    if (activeSprint === "Inactive" && pulseService.constructor.name !== "PlannedPulseService") {
                        return [];
                    }
                    return pulseService.getAll(activeSprint, piTitle)
                })
                .then(response => {
                    if (search !== "") {
                        response = filterPulses(response, search);
                    }
                    setPulses(response);
                })
        }

        return () => {
            cancelled = true;
        }

    }, [count]);



    return { pulses, activeSprint, piTitle, piDate, deletePi, savePulse, deletePulse, search, handleSearch };

}