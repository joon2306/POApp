import CommunicationEvents from "../renderer/types/CommunicationEvent";
import { ExportData } from "../renderer/types/FeatureGenerator/FinalReport";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import jsPDF from "jspdf";

export async function exportFeature() {
    const commsService: ICommunicationService = new CommsService(); 

    const generate = async ([{ feature, content, summary, benefitHypothesis }]: ExportData[]) => {
        const doc = new jsPDF();
        const margin = 10;
        const lineHeight = 10;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let y = margin;

        // Helper function to add formatted text
        const addText = (text: string, size = 10, indent = 0) => {
            doc.setFontSize(size);
            const maxWidth = pageWidth - (2 * margin) - indent;
            const lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach(line => {
                if (y + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin + indent, y);
                y += lineHeight;
            });
            y += lineHeight/2; // Add some spacing between sections
        };

        // Helper function to add a section header
        const addSectionHeader = (text: string) => {
            y += lineHeight/2;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(text, margin, y);
            y += lineHeight;
            doc.setFont(undefined, 'normal');
        };

        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Feature Requirements Report', margin, y);
        y += lineHeight * 2;
        doc.setFont(undefined, 'normal');

        // Feature Description
        addSectionHeader('Feature Description');
        addText(feature.description);

        // Feature Context
        if (feature.context) {
            addSectionHeader('Context');
            addText(feature.context);
        }

        // Summary
        addSectionHeader('Summary');
        addText(summary);

        // Benefit Hypothesis
        addSectionHeader('Benefit Hypothesis');
        addText(benefitHypothesis);

        // User Stories
        if (content.userStories && content.userStories.length > 0) {
            addSectionHeader('User Stories');
            content.userStories.forEach((story, index) => {
                const storyText = `${story.id}: ${story.story}`;
                addText(storyText, 10, 5);
                
                // Add acceptance criteria for this story if available
                if (content.acceptanceCriteria && content.acceptanceCriteria[story.id]) {
                    doc.setFont(undefined, 'bold');
                    addText('Acceptance Criteria:', 10, 10);
                    doc.setFont(undefined, 'normal');
                    content.acceptanceCriteria[story.id].forEach((criteria) => {
                        addText(`• ${criteria}`, 10, 15);
                    });
                }

                // Add estimate if available
                if (content.estimates && content.estimates[story.id]) {
                    doc.setFont(undefined, 'bold');
                    addText(`Estimate: ${content.estimates[story.id]}`, 10, 10);
                    doc.setFont(undefined, 'normal');
                }
            });
        }

        // Questions
        if (content.questions && content.questions.length > 0) {
            addSectionHeader('Open Questions');
            content.questions.forEach((question, index) => {
                addText(`${index + 1}. ${question}`, 10, 5);
            });
        }

        const pdf = doc.output('arraybuffer');

        return {
            pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="feature-requirements.pdf"',
            },
        };
    };

    commsService.getRequest(CommunicationEvents.exportFeature, async (featureInput: ExportData[]) => {
        const response = await generate(featureInput);
        return response;
    });
}
