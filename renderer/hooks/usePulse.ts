import { ReactNode, useEffect, useState } from "react";
import IPulseService from "../services/IPulseService";
import { Pulse } from "../types/Pulse/Pulse";
import IPiService from "../services/IPiService";
import { PulseUtils, Sprint } from "../utils/PulseUtils";
import { useModalService } from "../services/impl/ModalService";
import { ModalType } from "../types/ModalTypes";
import { PulseFormData } from "./usePulseForm";
import { PiTitle } from "../types/Feature/Pi";


export type usePulse = {
    pulses: Array<Pulse>;
    activeSprint: Sprint;
    piTitle: string;
    deletePi: () => void;
    savePulse: (formData: PulseFormData) => void;
}

export function usePulse(pulseService: IPulseService, piService: IPiService, DeletePi: ReactNode): usePulse {

    const [pulses, setPulses] = useState<Array<Pulse>>([]);
    const [activeSprint, setActiveSprint] = useState<Sprint | "Inactive">("Inactive");
    const [piTitle, setPiTitle] = useState<string>("");
    const [count, setCount] = useState<number>(0);

    let cancelled = false;

    const { openModal, closeModal } = useModalService();

    const trigger = () => {
        setCount((prev) => ++prev);
    }

    const deleteModal: ModalType = {
        title: "Confirmation",
        closeOnBackdrop: true,
        buttons: [
            {
                label: "confirm",
                variant: "primary",
                onClick: () => {
                    piService.removeCurrent();
                    closeModal();
                    trigger();
                }
            }
        ],
        content: DeletePi
    };

    const deletePi = () => {
        openModal(deleteModal);
    }

    const savePulse = (formData: PulseFormData) => {
        piService.setCurrent(formData.piTitle.value as PiTitle, new Date(formData.piDate.value).getTime());
        trigger();
    }

    useEffect(() => {
        if (!cancelled) {
            piService.getCurrent().then(pi => {
                if (pi === null) {
                    setPiTitle("");
                    return "Inactive";
                }
                setPiTitle(pi.title);
                const activeSprint = PulseUtils.getActiveSprint(pi);
                setActiveSprint(activeSprint);
                return activeSprint;
            })
                .then((activeSprint) => {
                    if (activeSprint === "Inactive") {
                        return [];
                    }
                    return pulseService.getAll(activeSprint)
                })
                .then(response => setPulses(response))
        }

        return () => {
            cancelled = true;
        }

    }, [count]);



    return { pulses, activeSprint, piTitle, deletePi, savePulse };

}