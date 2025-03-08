import { JiraFormData } from '../../types/JiraGenerator/JiraTypes';
import JiraInputForm from './JiraInputForm';

export default function JiraGenerator() {
  const handleSubmit = (data: JiraFormData) => {
    // Handle the form submission here
    console.log('Jira ticket data:', data);
  };

  return (
    <div className="container mx-auto px-4">
      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "black" }}>Jira Ticket Generator</h1>
        <JiraInputForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}