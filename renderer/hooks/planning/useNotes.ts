import { useEffect, useMemo, useRef, useState } from "react";
import Validator from "../../utils/Validator";
import { debounce } from "../../helpers/debounce";
import INotesService from "../../services/INotesService";

export default function useNotes(featureId: string, notesService: INotesService) {
    const [notes, setNotes] = useState("");
    const initialNotes = useRef("");

    const load = async () => {
        const loadedNotes = await notesService.loadNotes(featureId);
        initialNotes.current = loadedNotes;
        return loadedNotes;
    }

    const save = (notes) => {
        return notesService.saveNotes(featureId, notes);
    }

    const debouncedSave = useMemo(() => debounce(save, 1000), []);


    useEffect(() => {
        const loadNotes = async () => {
            const notesFromDb = await load();
            if (!Validator.string(notesFromDb).isBlank().validate()) {
                setNotes(notesFromDb);
            }
        }

        loadNotes();

    }, [featureId]);


    useEffect(() => {
        if (notes !== initialNotes.current) {
            debouncedSave(notes);
        }

    }, [notes])

    return { notes, setNotes }

}