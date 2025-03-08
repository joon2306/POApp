import React from 'react';

export interface JiraReportData {
    title: string;
    description: string;
    priority: string;
    type: string;
}

interface JiraReportProps {
  data: JiraReportData;
  onReset: () => void;
}

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'low':
      return { backgroundColor: '#BAFFD6', color: '#106633' };
    case 'medium':
      return { backgroundColor: '#A2F5F0', color: '#2B6662' };
    case 'high':
      return { backgroundColor: '#FBE2FF', color: '#CC00B8' };
    case 'critical':
      return { backgroundColor: '#FFD5D8', color: '#CC0000' };
    default:
      return { backgroundColor: '#A2F5F0', color: '#2B6662' };
  }
};

const JiraReport: React.FC<JiraReportProps> = ({ data, onReset }) => {
  const { priority, type, description, title } = data;
  const priorityStyle = getPriorityStyles(priority);

  return (
    <div className="bg-white shadow-2xl rounded-lg p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "black" }}>{title}</h2>
          <div className="flex space-x-2 mt-2">
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              backgroundColor: '#e5e7eb', 
              color: '#374151', 
              borderRadius: '9999px', 
              fontSize: '0.875rem' 
            }}>
              {type}
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              ...priorityStyle,
              borderRadius: '9999px', 
              fontSize: '0.875rem' 
            }}>
              {priority}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium mb-2" style={{ color: "black" }}>Description</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        </section>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Create New Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default JiraReport;