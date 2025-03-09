import { useState } from 'react';
import LabeledTextarea from '../LabeledTextarea';
import CorrectionResult from './CorrectionResult';
import EnglishCorrectionService from '../../services/impl/EnglishCorrectionService';
import IEnglishCorrectionService from '../../services/IEnglishCorrectionService';
import { EnglishGeneratorContent } from '../../types/English/English';

export default function English() {
    const [correctedText, setCorrectedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState('');

    const englishCorrectionService: IEnglishCorrectionService = new EnglishCorrectionService();

    const handleReset = () => {
        setCorrectedText('');
        setText('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error, result } = await englishCorrectionService.correctText(text);
            if (error) {
                throw new Error('Error correcting text');
            }
            setCorrectedText((result as EnglishGeneratorContent).content);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to correct text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center" style={{color: 'black'}}>
                English Correction
            </h1>
            <div className="grid gap-8">
                <div className="border rounded-lg p-6 space-y-4 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <LabeledTextarea
                            id="textBody"
                            name="textBody"
                            label="Text to correct*"
                            rows={10}
                            value={text}
                            placeholder="Enter your text here..."
                            onChange={(e) => setText(e.target.value)}
                            required={true}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Correcting...' : 'Correct Text'}
                            </button>
                        </div>
                    </form>
                </div>
                {correctedText && (
                    <div className="space-y-4">
                        <CorrectionResult
                            correctedText={correctedText}
                            onReset={handleReset}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}