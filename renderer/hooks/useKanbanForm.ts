import { useState } from "react";
import { KanbanFormType } from "../types/KanbanTypes";

export const useKanbanForm = ({ onValidSubmit, kanbanFormValue }: KanbanFormType) => {
    let defaultTitle = kanbanFormValue ? kanbanFormValue.title : "";
    let defaultDescription = kanbanFormValue ? kanbanFormValue.description : "";
    let defaultPriority = kanbanFormValue ? kanbanFormValue.priority : 1;

    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState(defaultDescription);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const [priority, setPriority] = useState(defaultPriority);

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

        if (!isValid) {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 400);
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(title);
            console.log(description);
            console.log(priority)
            return onValidSubmit();
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

    return {
        handleSubmit, handleTitleChange, handleDescriptionChange, handlePriorityChange,
        title, description, titleError, descriptionError, shouldShake, priority
    }
}