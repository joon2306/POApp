import { useState, FormEvent, ChangeEvent } from 'react';
import FeedbackFormProps from '../../types/FeatureGenerator/FeedbackForm';
import LabeledTextarea from '../LabeledTextarea';


const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, previousFeedback }) => {
  const [feedback, setFeedback] = useState<string>(previousFeedback || '');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ feedback, isApproved });
  };
  
  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleApprovalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsApproved(e.target.checked);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Provide Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <LabeledTextarea
          id="feedback"
          name="feedback"
          label="Your Feedback*"
          rows={4}
          value={feedback}
          placeholder="Describe the feature you want to build..."
          required={!isApproved}
          onChange={handleFeedbackChange}
        />
          <p className="text-sm text-gray-500 mt-1">
            Explain what you like, what needs improvement, and any specific changes needed.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={isApproved}
              onChange={handleApprovalChange}
            />
            <span className="ml-2 text-gray-700">I approve these requirements (finalize)</span>
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isApproved 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isApproved ? 'Finalize Requirements' : 'Submit Feedback for Refinement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;