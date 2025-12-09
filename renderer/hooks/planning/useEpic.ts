import { useEffect, useRef, useState } from "react";
import { Epic } from "../../components/Plan/types/types";
import IEpicService from "../../services/IEpicService";
import EpicHelper from "../../helpers/EpicHelper";

export default function useEpic(epicService: IEpicService) {

    const [epics, setEpics] = useState<Epic[]>([
    ]);

    const epicHelperRef = useRef(new EpicHelper(epics));

    useEffect(() => {
        const loadEpics = async () => {
            const loadedEpics = await epicService.getEpics();
            setEpics(loadedEpics);
            epicHelperRef.current = new EpicHelper(loadedEpics);
        }

        loadEpics();

    }, [])


    const retrieveUpdatedEpic = (epics: Epic[]): Epic => {
        const epicHelper = epicHelperRef.current;
        const updatedEpicResult = epicHelper.retrieveUpdatedEpic(epics);
        const updatedEpic = updatedEpicResult.match({
            ok: (epic) => epic,
            err: (error) => {
                console.error("Error retrieving updated epic: ", error);
                throw error;
            }
        });
        return updatedEpic as Epic;
    }


    const addEpic = (epic: Epic[]) => {
        epicHelperRef.current = new EpicHelper(epic);
        setEpics(epic);
    }

    const modifyEpic = (epic: Epic[]) => {
        const updatedEpic = retrieveUpdatedEpic(epic);
        setEpics(epic);
        epicService.modifyEpic(updatedEpic);
    }

    const removeEpic = (epic: Epic[]) => {
        const updatedEpic = retrieveUpdatedEpic(epic);
        setEpics(epic);
        epicService.removeEpic(updatedEpic);
    }

    return { epics, addEpic, modifyEpic, removeEpic };
}


