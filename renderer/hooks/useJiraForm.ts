import { useState, FormEvent } from 'react';
import { JiraFormData, defaultJiraFormData } from '../types/JiraGenerator/JiraTypes';

interface UseJiraForm {
    formData: JiraFormData;
    typeOptions: Array<{ value: string; label: string }>;
    priorityOptions: Array<{ value: string; label: string }>;
    handleSubmit: (e: FormEvent) => void;
    handleReset: () => void;
    updateField: <K extends keyof JiraFormData>(field: K, value: JiraFormData[K]) => void;
}

export const useJiraForm = (onSubmitCallback?: (data: JiraFormData) => void): UseJiraForm => {
    const [formData, setFormData] = useState<JiraFormData>(defaultJiraFormData);

    const typeOptions = [
        { value: 'bug', label: 'Bug' },
        { value: 'epic', label: 'Epic' },
        { value: 'user-story', label: 'User Story' },
        { value: 'task', label: 'Task' }
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmitCallback?.(formData);
    };

    const handleReset = () => {
        setFormData(defaultJiraFormData);
    };

    const updateField = <K extends keyof JiraFormData>(field: K, value: JiraFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        formData,
        typeOptions,
        priorityOptions,
        handleSubmit,
        handleReset,
        updateField
    };
};