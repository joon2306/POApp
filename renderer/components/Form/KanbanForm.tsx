import Input from "./Input";
import Select from "./Select";
import { useKanbanForm } from "../../hooks/useKanbanForm";
import { KanbanFormType } from "../../types/KanbanTypes";

const KanbanForm = ({ onValidSubmit, kanbanFormValue }: KanbanFormType) => {
    const { handleSubmit, handleTitleChange, handleDescriptionChange, handlePriorityChange, handleTimeChange,
        title, description, titleError, descriptionError, shouldShake, priority, time, timeError } = useKanbanForm({ onValidSubmit, kanbanFormValue });

    const priorityOptions = [
        { value: 1, label: "Low" },
        { value: 2, label: "Medium" },
        { value: 3, label: "High" },
        { value: 4, label: "Critical" }
    ]

    return (
        <form
            onSubmit={handleSubmit}
            className={shouldShake ? 'shake' : ''}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
            <Input title="Title" value={title} error={titleError} errorMessage="Title should not be empty" onChange={handleTitleChange} />

            <Input title="Description" value={description} error={descriptionError} errorMessage="Description should not be empty" onChange={handleDescriptionChange} />

            <Input title="Time" value={time} type="number" error={timeError} errorMessage="Input valid time" onChange={handleTimeChange} />

            <Select name="Priority" options={priorityOptions} onChange={handlePriorityChange} defaultValue={priority}/>

            {/* Hidden submit button for Enter key support */}
            <button type="submit" style={{ display: 'none' }} />
        </form>
    );
};

export default KanbanForm;