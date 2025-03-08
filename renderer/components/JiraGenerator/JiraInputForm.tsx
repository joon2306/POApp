import LabeledTextarea from '../LabeledTextarea';
import { SubmitButton } from '../Button';
import { useJiraForm } from '../../hooks/useJiraForm';
import { JiraFormProps, JiraType, Priority } from '../../types/JiraGenerator/JiraTypes';
import JiraSelect from './JiraSelect';

export default function JiraInputForm({ onSubmit }: JiraFormProps) {
    const {
        formData,
        typeOptions,
        priorityOptions,
        handleSubmit,
        handleReset,
        updateField
    } = useJiraForm(onSubmit);

    return (
        <div className="bg-white shadow-2xl rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "black" }}>Ticket Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Ticket Type</label>
                        <JiraSelect
                            name="type"
                            options={typeOptions}
                            onChange={(e) => updateField('type', e.target.value as JiraType)}
                            value={formData.type}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Priority</label>
                        <JiraSelect
                            name="priority"
                            options={priorityOptions}
                            onChange={(e) => updateField('priority', e.target.value as Priority)}
                            value={formData.priority}
                        />
                    </div>
                </div>

                <LabeledTextarea
                    id="description"
                    name="description"
                    label="Ticket Description*"
                    rows={4}
                    value={formData.description}
                    placeholder="Describe the ticket..."
                    required
                    onChange={(e) => updateField('description', e.target.value)}
                />

                {formData.type === 'bug' && (
                    <>
                        <LabeledTextarea
                            id="stepsToReproduce"
                            name="stepsToReproduce"
                            label="Steps to Reproduce*"
                            rows={3}
                            value={formData.stepsToReproduce || ''}
                            placeholder="List the steps to reproduce the bug..."
                            required
                            onChange={(e) => updateField('stepsToReproduce', e.target.value)}
                        />
                        <LabeledTextarea
                            id="expectedResult"
                            name="expectedResult"
                            label="Expected Result*"
                            rows={2}
                            value={formData.expectedResult || ''}
                            placeholder="What was expected to happen?"
                            required
                            onChange={(e) => updateField('expectedResult', e.target.value)}
                        />
                        <LabeledTextarea
                            id="actualResult"
                            name="actualResult"
                            label="Actual Result*"
                            rows={2}
                            value={formData.actualResult || ''}
                            placeholder="What actually happened?"
                            required
                            onChange={(e) => updateField('actualResult', e.target.value)}
                        />
                    </>
                )}

                {(formData.type === 'epic' || formData.type === 'task') && (
                    <LabeledTextarea
                        id="acceptanceCriteria"
                        name="acceptanceCriteria"
                        label="Acceptance Criteria*"
                        rows={4}
                        value={formData.acceptanceCriteria || ''}
                        placeholder="List the acceptance criteria..."
                        required
                        onChange={(e) => updateField('acceptanceCriteria', e.target.value)}
                    />
                )}

                {formData.type === 'user-story' && (
                    <>
                        <LabeledTextarea
                            id="epicDescription"
                            name="epicDescription"
                            label="Epic Description*"
                            rows={3}
                            value={formData.epicDescription || ''}
                            placeholder="Describe the epic this user story belongs to..."
                            required
                            onChange={(e) => updateField('epicDescription', e.target.value)}
                        />
                        <LabeledTextarea
                            id="acceptanceCriteria"
                            name="acceptanceCriteria"
                            label="Acceptance Criteria*"
                            rows={4}
                            value={formData.acceptanceCriteria || ''}
                            placeholder="List the acceptance criteria..."
                            required
                            onChange={(e) => updateField('acceptanceCriteria', e.target.value)}
                        />
                    </>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                    <SubmitButton
                        variant="primary"
                        label="Generate Ticket"
                        isDisabled={false}
                    />

                </div>
            </form>
        </div>
    );
}