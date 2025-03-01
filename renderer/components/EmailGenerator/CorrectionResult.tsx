'use client';

import { useState } from 'react';
import Button from '../Button';
import LabeledTextarea from '../LabeledTextarea';

interface CorrectionResultProps {
  correctedText: string;
  suggestedSubject: string;
}

export default function CorrectionResult({ correctedText, suggestedSubject }: CorrectionResultProps) {
  const [subject, setSubject] = useState(suggestedSubject);
  const [body, setBody] = useState(correctedText);

  const openInOutlook = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
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
      <Button onClick={openInOutlook} variant="primary" label="Open in Outlook" />
    </div>
  );
}