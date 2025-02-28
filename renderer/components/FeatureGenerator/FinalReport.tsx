import React, { useState } from 'react';
import { FinalReportProps } from '../../types/FeatureGenerator/FinalReport';



const FinalReport: React.FC<FinalReportProps> = ({ content, feature, iterations, onReset, featureSummary }) => {
  const { userStories, acceptanceCriteria, estimates, questions } = content;
  const [exportFormat, setExportFormat] = useState('pdf');

  const { summary, benefitHypothesis } = featureSummary;

  const handleExport = async () => {
    const exportData = {
      feature,
      content,
      exportedAt: new Date().toISOString(),
      summary,
      benefitHypothesis
    };

    if (exportFormat === 'pdf') {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feature-requirements-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export PDF');
      }
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
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Requirements finalized after {iterations} {iterations === 1 ? 'iteration' : 'iterations'}!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Final Requirements Report</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Feature Overview</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="mb-2"><span className="font-medium"></span> {summary}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Benefit Hypothesis</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="mb-2"><span className="font-medium"></span> {benefitHypothesis}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">User Stories</h3>
          <div className="space-y-4">
            {userStories.map((story) => (
              <div key={story.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-500 mb-1">{story.id}</p>
                <p className="mb-2">{story.story}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 mr-2">Estimate:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${estimates[story.id] === 'XS' ? 'bg-green-100 text-green-800' :
                      estimates[story.id] === 'S' ? 'bg-blue-100 text-blue-800' :
                        estimates[story.id] === 'M' ? 'bg-yellow-100 text-yellow-800' :
                          estimates[story.id] === 'L' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {estimates[story.id]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Acceptance Criteria</h3>
          <div className="space-y-4">
            {userStories.map((story) => (
              <div key={`ac-${story.id}`} className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium mb-2">{story.id}: {story.story}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {acceptanceCriteria[story.id]?.map((criteria, idx) => (
                    <li key={idx} className="text-gray-700">{criteria}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Questions</h3>
          <div className="space-y-4">
            {questions?.map((question, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium mb-2">{question}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center">
            <label htmlFor="exportFormat" className="block text-gray-700 font-medium mr-3">
              Export Format:
            </label>
            <select
              id="exportFormat"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Export
            </button>
          </div>

          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Start New Feature
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;