import { useState, ChangeEvent, FormEvent } from 'react';
import FeatureInputType from '../../types/FeatureGenerator/FeatureInput';
import LabeledTextarea from '../LabeledTextarea';

interface FeatureInputProps {
  onSubmit: (formData: FeatureInputType) => void;
}

interface ExtendedFormData {
  purpose: string;
  description: string;
  users: string;
  examples: string;
  validation: string;
  technicalDetails: string;
  context: string;
}

export const buildDescription = (formData: ExtendedFormData): FeatureInputType => {
  const sections: string[] = [];
  
  if (formData.purpose) sections.push(`Purpose: ${formData.purpose}`);
  sections.push(`Description: ${formData.description}`);
  if (formData.users) sections.push(`Target Users: ${formData.users}`);
  if (formData.examples) sections.push(`Example Scenarios: ${formData.examples}`);
  if (formData.validation) sections.push(`Validation Requirements: ${formData.validation}`);
  
  const combinedDescription = sections.join('\n\n');
  
  const contextParts: string[] = [];
  if (formData.technicalDetails) contextParts.push(`Technical Details:\n${formData.technicalDetails}`);
  if (formData.context) contextParts.push(formData.context);
  
  return {
    description: combinedDescription,
    context: contextParts.join('\n\n')
  };
};

const FeatureInput: React.FC<FeatureInputProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ExtendedFormData>({
    purpose: '',
    description: '',
    users: '',
    examples: '',
    validation: '',
    technicalDetails: '',
    context: ''
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const processedData = buildDescription(formData);
    onSubmit(processedData);
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4" style={{color: "black"}}>Feature Description</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabeledTextarea
          id="purpose"
          name="purpose"
          label="Purpose of Feature"
          rows={2}
          value={formData.purpose}
          placeholder="What is the main purpose of this feature?"
          onChange={handleChange}
        />
        <LabeledTextarea
          id="description"
          name="description"
          label="Feature Description*"
          rows={3}
          value={formData.description}
          placeholder="Describe the core functionality of the feature..."
          required
          onChange={handleChange}
        />
        <LabeledTextarea
          id="users"
          name="users"
          label="Target Users"
          rows={2}
          value={formData.users}
          placeholder="Who are the target users of this feature?"
          onChange={handleChange}
        />
        <LabeledTextarea
          id="examples"
          name="examples"
          label="Example Scenarios"
          rows={2}
          value={formData.examples}
          placeholder="Provide examples of how this feature might be used..."
          onChange={handleChange}
        />
        <LabeledTextarea
          id="validation"
          name="validation"
          label="Validation Requirements"
          rows={2}
          value={formData.validation}
          placeholder="What validation or business rules should be applied?"
          onChange={handleChange}
        />
        <LabeledTextarea
          id="technicalDetails"
          name="technicalDetails"
          label="Technical Details"
          rows={2}
          value={formData.technicalDetails}
          placeholder="Any technical considerations or implementation details?"
          onChange={handleChange}
        />
        <LabeledTextarea
          id="context"
          name="context"
          label="Additional Context"
          rows={2}
          value={formData.context}
          placeholder="Any other relevant context or information?"
          onChange={handleChange}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate User Stories
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeatureInput;