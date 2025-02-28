import React from 'react';
import { GeneratedOutputProps } from '../../types/FeatureGenerator/FinalReport';


const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ content, iteration }) => {
  const { userStories, acceptanceCriteria, estimates, questions } = content;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Generated Requirements</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Iteration {iteration}
        </span>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium mb-3">User Stories</h3>
          <div className="space-y-4">
            {userStories.map((story) => (
              <div key={story.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-500 mb-1">{story.id}</p>
                <p className="mb-2">{story.story}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Estimate:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      estimates[story.id] === 'XS' ? 'bg-green-100 text-green-800' :
                      estimates[story.id] === 'S' ? 'bg-blue-100 text-blue-800' :
                      estimates[story.id] === 'M' ? 'bg-yellow-100 text-yellow-800' :
                      estimates[story.id] === 'L' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {estimates[story.id]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
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
        </section>

        <section>
          <h3 className="text-lg font-medium mb-3">Questions</h3>
          <div className="space-y-4">
            {questions?.map((question, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium mb-2">{question}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeneratedOutput;