'use client';

import { useState } from 'react';
import EmailForm from './EmailForm';
import CorrectionResult from './CorrectionResult';

export default function EmailGenerator() {
  const [correctedText, setCorrectedText] = useState<string>('');
  const [suggestedSubject, setSuggestedSubject] = useState<string>('');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{color: 'black'}}>Email Generator</h1>
      <div className="grid gap-8">
        <div className="border rounded-lg p-6 space-y-4 shadow-lg">
          <EmailForm 
            onCorrectionReceived={(text: string, subject: string) => {
              setCorrectedText(text);
              setSuggestedSubject(subject);
            }}
          />
        </div>
        {correctedText && (
          <CorrectionResult
            correctedText={correctedText} 
            suggestedSubject={suggestedSubject}
          />
        )}
      </div>
    </main>
  );
}