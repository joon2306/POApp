import { useState, ChangeEvent, FormEvent } from 'react';
import FeatureInputType from '../../types/FeatureGenerator/FeatureInput';
import LabeledTextarea from '../LabeledTextarea';

interface FeatureInputProps {
  onSubmit: (formData: FeatureInputType) => void;
}

const FeatureInput: React.FC<FeatureInputProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    description: '',
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
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4" style={{color: "black"}}>Feature Description</h2>
      <form onSubmit={handleSubmit}>
        <LabeledTextarea
          id="description"
          name="description"
          label="Feature Description*"
          rows={4}
          value={formData.description}
          placeholder="Describe the feature you want to build..."
          required
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