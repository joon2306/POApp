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

  const buttonStyles = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    backgroundColor: isApproved ? '#16a34a' : '#2563eb',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const buttonHoverStyles = {
    backgroundColor: isApproved ? '#15803d' : '#1d4ed8',
  };

  return (
    <div style={{ backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'black' }}>Provide Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
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
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Explain what you like, what needs improvement, and any specific changes needed.
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              style={{ height: '1rem', width: '1rem', color: '#2563eb', borderColor: '#d1d5db', borderRadius: '0.25rem' }}
              checked={isApproved}
              onChange={handleApprovalChange}
            />
            <span style={{ marginLeft: '0.5rem', color: '#374151' }}>I approve these requirements (finalize)</span>
          </label>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={buttonStyles}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor)}
          >
            {isApproved ? 'Finalize Requirements' : 'Submit Feedback for Refinement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;