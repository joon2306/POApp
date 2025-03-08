import { useState } from 'react';
import { AiJiraResponse, JiraFormData } from '../../types/JiraGenerator/JiraTypes';
import JiraInputForm from './JiraInputForm';
import JiraReport, { JiraReportData } from './JiraReport';
import Loading from '../Loading';
import JiraGeneratorService from '../../services/impl/JiraService';

;
export default function JiraGenerator() {
    const [showReport, setShowReport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const jiraService = new JiraGeneratorService();
    const [jiraReportData, setJiraReportData] = useState<AiJiraResponse>({
        error: true,
        result: null
    });

    const handleSubmit = async (data: JiraFormData) => {
        setIsLoading(true);
        const aiResponse = await jiraService.generateJira(data);
        setIsLoading(false);
        if (aiResponse.error) {
            console.error('Error generating Jira ticket:', aiResponse.error);
            alert('Failed to generate Jira ticket. Please try again.');
            return;
        }
        setJiraReportData(aiResponse);
        setShowReport(true);
    };

    const handleReset = () => {
        setShowReport(false);
    };

    return (
        <div className="container mx-auto px-4">
            <main className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "black" }}>Jira Ticket Generator</h1>
                {
                    isLoading && <Loading />
                }
                {showReport ? (
                    <JiraReport data={jiraReportData?.result} onReset={handleReset} />
                ) : (
                    <JiraInputForm onSubmit={handleSubmit} />
                )}
            </main>
        </div>
    );
}