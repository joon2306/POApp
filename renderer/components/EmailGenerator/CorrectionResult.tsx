'use client';

import Button from "../Button";

interface CorrectionResultProps {
  correctedText: string;
  suggestedSubject: string;
}

export default function CorrectionResult({ correctedText, suggestedSubject }: CorrectionResultProps) {
  const openInOutlook = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(suggestedSubject)}&body=${encodeURIComponent(correctedText)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Corrected Email</h2>
      <div>
        <h3 className="font-medium">Subject:</h3>
        <p className="mt-1 p-2 bg-gray-50 rounded">{suggestedSubject}</p>
      </div>
      <div>
        <h3 className="font-medium">Body:</h3>
        <p className="mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{correctedText}</p>
      </div>
      <Button onClick={openInOutlook} variant="primary" label="Open in Outlook" />
    </div>
  );
}