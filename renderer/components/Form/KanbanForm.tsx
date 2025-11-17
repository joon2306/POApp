import Input from "./Input";
import Select from "./Select";
import { useKanbanForm } from "../../hooks/useKanbanForm";
import { KanbanFormType } from "../../types/KanbanTypes";
import { SPRINT_OPTIONS } from "../../types/Feature/Feature";

const KanbanForm = ({ onValidSubmit, kanbanFormValue, type }: KanbanFormType) => {
    const { handleSubmit, handleTitleChange, handleDescriptionChange, handlePriorityChange, handleTimeChange, handleTargetChange,
        title, description, titleError, descriptionError, shouldShake, priority, time, timeError, target } = useKanbanForm({ onValidSubmit, kanbanFormValue }, type);

    const priorityOptions = [
        { value: 1, label: "Low" },
        { value: 2, label: "Medium" },
        { value: 3, label: "High" },
        { value: 4, label: "Critical" }
    ]

    const isTodo = type === "TODO";

    return (
        <form
            onSubmit={handleSubmit}
            className={shouldShake ? 'shake' : ''}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
            <Input title={`${isTodo ? "Title": "Jira Key"}`} value={title} error={titleError} errorMessage={`${isTodo ? "Title should not be empty": "Jira Key should not be empty"}`}
            onChange={handleTitleChange} />

            <Input title={`${isTodo ? "Description": "Jira title"}`} value={description} error={descriptionError} errorMessage={`${isTodo ? "Description should not be empty": "Jira Title should not be empty"}`} 
            onChange={handleDescriptionChange} />

            {isTodo&& <Input title="Time" value={time} type="number" error={timeError} errorMessage="Input valid time" onChange={handleTimeChange} />}

            {isTodo && <Select name="Priority" options={priorityOptions} onChange={handlePriorityChange} defaultValue={priority} />}

            {!isTodo && <Select name="Target" options={SPRINT_OPTIONS} onChange={handleTargetChange} defaultValue={target} />}

            {/* Hidden submit button for Enter key support */}
            <button type="submit" style={{ display: 'none' }} />
        </form>
    );
};

export default KanbanForm;