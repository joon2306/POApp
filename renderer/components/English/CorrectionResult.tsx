import { useState } from 'react';
import Button from '../Button';
import LabeledTextarea from '../LabeledTextarea';

interface CorrectionResultProps {
    correctedText: string;
    onReset: () => void;
}

export default function CorrectionResult({ correctedText, onReset }: CorrectionResultProps) {
    const [text, setText] = useState(correctedText);

    return (
        <div className="container mx-auto">
            <div className="border rounded-lg p-6 space-y-4 shadow-lg w-full">
                <h2 className="text-xl font-semibold">Corrected Text</h2>
                <div>
                    <LabeledTextarea
                        id="correctedBody"
                        name="correctedBody"
                        label="Corrected version:"
                        rows={10}
                        value={text}
                        placeholder="Corrected text will appear here..."
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="flex justify-start items-center">
                    <Button onClick={onReset} variant="secondary" label="Reset" />
                </div>
            </div>
        </div>
    );
}