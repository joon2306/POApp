'use client';

import { useState } from 'react';
import LabeledTextarea from '../LabeledTextarea';
import IEmailGeneratorService from '../../services/IEmailGeneratorSevice';
import EmailGeneratorService from '../../services/impl/EmailGeneratorService';
import { EmailGeneratorContent } from '../../types/EmailGenerator/EmailGenerator';

interface EmailFormProps {
    onCorrectionReceived: (text: string, subject: string) => void;
}

export default function EmailForm({ onCorrectionReceived }: EmailFormProps) {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const emailGeneratorService: IEmailGeneratorService = new EmailGeneratorService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const { error, result } = await emailGeneratorService.generateEmail(text);
            if (error) {
                throw new Error('Error generating email');
            }
            const { subject, content } = result as EmailGeneratorContent;
            onCorrectionReceived(content, subject);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <LabeledTextarea
                id="emailBody"
                name="emailBody"
                label="Email*"
                rows={10}
                value={text}
                placeholder="Enter your email text here..."
                onChange={(e) => setText(e.target.value)}
                required={true}
            />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? 'Correcting...' : 'Correct Email'}
                </button>
            </div>
        </form>
    );
}