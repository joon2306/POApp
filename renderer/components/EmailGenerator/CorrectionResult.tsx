'use client';

import { useState } from 'react';
import Button from '../Button';
import LabeledTextarea from '../LabeledTextarea';

interface CorrectionResultProps {
  correctedText: string;
  suggestedSubject: string;
  onReset: () => void;
}

export default function CorrectionResult({ correctedText, suggestedSubject, onReset }: CorrectionResultProps) {
  const [subject, setSubject] = useState(suggestedSubject);
  const [body, setBody] = useState(correctedText);

  const openInOutlook = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="container mx-auto">
      <div className="border rounded-lg p-6 space-y-4 shadow-lg w-full">
        <h2 className="text-xl font-semibold">Corrected Email</h2>
        <div>
          <LabeledTextarea
            id="subject"
            name="subject"
            label="Subject:"
            rows={1}
            value={subject}
            placeholder="Enter subject here..."
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <LabeledTextarea
            id="body"
            name="body"
            label="Body:"
            rows={10}
            value={body}
            placeholder="Enter body here..."
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={onReset} variant="secondary" label="Reset" />
          <Button onClick={openInOutlook} variant="primary" label="Open in Outlook" />
        </div>
      </div>
    </div>
  );
}