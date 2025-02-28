import React from 'react';
import { GeneratedOutputProps } from '../../types/FeatureGenerator/FinalReport';

const getEstimateStyles = (estimate: string) => {
  switch (estimate) {
    case 'XS':
      return { backgroundColor: '#d1fae5', color: '#065f46' };
    case 'S':
      return { backgroundColor: '#bfdbfe', color: '#1e3a8a' };
    case 'M':
      return { backgroundColor: '#fef3c7', color: '#92400e' };
    case 'L':
      return { backgroundColor: '#fed7aa', color: '#9a3412' };
    default:
      return { backgroundColor: '#fecaca', color: '#7f1d1d' };
  }
};

const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ content, iteration }) => {
  const { userStories, acceptanceCriteria, estimates, questions } = content;

  return (
    <div style={{ backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'black' }}>Generated Requirements</h2>
        <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#bfdbfe', color: '#1e3a8a', borderRadius: '9999px', fontSize: '0.875rem' }}>
          Iteration {iteration}
        </span>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <section>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' , color:'black' }}>User Stories</h3>
          <div style={{ marginBottom: '1rem' }}>
            {userStories.map((story) => {
              const { backgroundColor, color } = getEstimateStyles(estimates[story.id]);
              return (
                <div key={story.id} style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>{story.id}</p>
                  <p style={{ marginBottom: '0.5rem' , color:'black' }}>{story.story}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '0.5rem' }}>Estimate:</span>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor, color }}>
                        {estimates[story.id]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem', color: 'black' }}>Acceptance Criteria</h3>
          <div style={{ marginBottom: '1rem' }}>
            {userStories.map((story) => (
              <div key={`ac-${story.id}`} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem', color: 'black' }}>{story.id}: {story.story}</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginBottom: '0.25rem' }}>
                  {acceptanceCriteria[story.id]?.map((criteria, idx) => (
                    <li key={idx} style={{ color: '#374151' }}>{criteria}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem', color:'black' }}>Questions</h3>
          <div style={{ marginBottom: '1rem' }}>
            {questions?.map((question, index) => (
              <div key={index} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{question}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeneratedOutput;