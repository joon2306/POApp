import React, { useState } from 'react';
import { FinalReportProps } from '../../types/FeatureGenerator/FinalReport';
import { IFeatureGeneratorService } from '../../services/IFeatureGeneratorService';
import { FeatureGeneratorService } from '../../services/impl/FeatureGeneratorService';

const FinalReport: React.FC<FinalReportProps> = ({ content, feature, iterations, onReset, featureSummary }) => {
  const { userStories, acceptanceCriteria, estimates, questions } = content;
  const [exportFormat, setExportFormat] = useState('pdf');

  const { summary, benefitHypothesis } = featureSummary;

  const featureGeneratorService: IFeatureGeneratorService = new FeatureGeneratorService();

  const handleExport = async () => {
    const exportData = {
      feature,
      content,
      exportedAt: new Date().toISOString(),
      summary,
      benefitHypothesis
    };

    if (exportFormat === 'pdf') {
      const response = await featureGeneratorService.exportFeature(exportData);

      const blob = new Blob([response.pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feature-requirements-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (exportFormat === 'docx') {
      // Add DOCX export logic here
    } else if (exportFormat === 'jira') {
      // Add JIRA export logic here
    } else {
      // JSON export logic
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feature-requirements-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ flexShrink: 0 }}>
            <svg style={{ height: '1.25rem', width: '1.25rem', color: '#10b981' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div style={{ marginLeft: '0.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#047857' }}>
              Requirements finalized after {iterations} {iterations === 1 ? 'iteration' : 'iterations'}!
            </p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'black' }}>Final Requirements Report</h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem', color: 'black' }}>Feature Overview</h3>
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
            <p style={{ marginBottom: '0.5rem' }}><span style={{ fontWeight: '500' }}></span> {summary}</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem', color: 'black' }}>Benefit Hypothesis</h3>
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
            <p style={{ marginBottom: '0.5rem' }}><span style={{ fontWeight: '500' }}></span> {benefitHypothesis}</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem', color: 'black' }}>User Stories</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {userStories.map((story) => (
              <div key={story.id} style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>{story.id}</p>
                <p style={{ marginBottom: '0.5rem' }}>{story.story}</p>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '0.5rem' }}>Estimate:</span>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '500',
                    backgroundColor: estimates[story.id] === 'XS' ? '#d1fae5' :
                      estimates[story.id] === 'S' ? '#bfdbfe' :
                        estimates[story.id] === 'M' ? '#fef3c7' :
                          estimates[story.id] === 'L' ? '#fed7aa' :
                            '#fecaca',
                    color: estimates[story.id] === 'XS' ? '#065f46' :
                      estimates[story.id] === 'S' ? '#1e3a8a' :
                        estimates[story.id] === 'M' ? '#92400e' :
                          estimates[story.id] === 'L' ? '#9a3412' :
                            '#991b1b'
                  }}>
                    {estimates[story.id]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem', color: 'black' }}>Acceptance Criteria</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {userStories.map((story) => (
              <div key={`ac-${story.id}`} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{story.id}: {story.story}</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', display: 'grid', gap: '0.25rem' }}>
                  {acceptanceCriteria[story.id]?.map((criteria, idx) => (
                    <li key={idx} style={{ color: '#374151' }}>{criteria}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem', color: 'black' }}>Questions</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {questions?.map((question, index) => (
              <div key={index} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{question}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="exportFormat" style={{ display: 'block', color: '#374151', fontWeight: '500', marginRight: '0.75rem' }}>
              Export Format:
            </label>
            <select
              id="exportFormat"
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' }}
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="docx">Word (DOCX)</option>
              <option value="json">JSON</option>
              <option value="jira">JIRA Import</option>
            </select>
            <button
              onClick={handleExport}
              style={{ marginLeft: '0.75rem', padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '0.375rem', outline: 'none', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)', cursor: 'pointer' }}
            >
              Export
            </button>
          </div>

          <button
            onClick={onReset}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#e5e7eb', color: '#374151', borderRadius: '0.375rem', outline: 'none', boxShadow: '0 0 0 2px rgba(107, 114, 128, 0.5)', cursor: 'pointer' }}
          >
            Start New Feature
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;