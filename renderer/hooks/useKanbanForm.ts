import { useState } from "react";
import { KanbanFormType } from "../types/KanbanTypes";
import { KanbanType } from "../factory/KanbanFactory";

export const useKanbanForm = ({ onValidSubmit, kanbanFormValue }: Omit<KanbanFormType, "type">, type: KanbanType) => {
    let defaultTitle = kanbanFormValue ? kanbanFormValue.title : "";
    let defaultDescription = kanbanFormValue ? kanbanFormValue.description : "";
    let defaultPriority = kanbanFormValue ? kanbanFormValue.priority : 1;
    let defaultTarget = kanbanFormValue ? kanbanFormValue.target ?? 1 : 1;
    let defaultTime = kanbanFormValue ? kanbanFormValue.time : 30;
    const id: string = kanbanFormValue ? kanbanFormValue.id: "";

    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState(defaultDescription);
    const [time, setTime] = useState(defaultTime);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const [priority, setPriority] = useState(defaultPriority);
    const [target, setTarget] = useState(defaultTarget);

    const isTodo = type === "TODO";
    

    const validateForm = () => {
        let isValid = true;

        // Validate title
        if (title.trim() === '') {
            setTitleError(true);
            isValid = false;
        }

        // Validate description
        if (description.trim() === '') {
            setDescriptionError(true);
            isValid = false;
        }

        if(isTodo && (time <= 0  || isNaN(time) || !Number.isInteger(time))) {
            setTimeError(true);
            isValid = false;
        }

        if (!isValid) {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 400);
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            return onValidSubmit({title, description, priority, id, time, target});
        }
        return null;
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setTitleError(false); // Clear title error when typing
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setDescriptionError(false); // Clear description error when typing
    }

    const handlePriorityChange = (e) => {
        setPriority(parseInt(e.target.value));
    }

    const handleTimeChange = (e) => {
        setTime(parseInt(e.target.value));
        setTimeError(false);
    }

     const handleTargetChange = (e) => {
        setTarget(parseInt(e.target.value));
    }


    return {
        handleSubmit, handleTitleChange, handleDescriptionChange, handlePriorityChange, handleTimeChange, handleTargetChange,
        title, description, titleError, descriptionError, shouldShake, priority, time, timeError, target
    }
}