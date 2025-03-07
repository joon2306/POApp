import CommunicationEvents from "../renderer/types/CommunicationEvent";
import { ExportData } from "../renderer/types/FeatureGenerator/FinalReport";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import jsPDF from "jspdf";
export async function exportFeature() {
    
    const commsService: ICommunicationService = new CommsService(); 

    const generate = async ([{ feature, content, summary, benefitHypothesis }]: ExportData[]) => {
        console.log("Hello World");
        const doc = new jsPDF();
        const margin = 10;
        const lineHeight = 10;
        const pageHeight = doc.internal.pageSize.height;
        let y = margin;

        const addText = (text, size = 10) => {
            doc.setFontSize(size);
            const lines = doc.splitTextToSize(text, 180);
            lines.forEach(line => {
                if (y + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += lineHeight;
            });
        };

        doc.setFontSize(16);
        doc.text('Feature Requirements Report', margin, y);
        y += lineHeight;

        doc.setFontSize(12);
        doc.text('Feature:', margin, y);
        y += lineHeight;
        addText(JSON.stringify(feature, null, 2));

        doc.setFontSize(12);
        doc.text('Summary:', margin, y);
        y += lineHeight;
        addText(summary);

        doc.setFontSize(12);
        doc.text('Benefit Hypothesis:', margin, y);
        y += lineHeight;
        addText(benefitHypothesis);

        doc.setFontSize(12);
        doc.text('Content:', margin, y);
        y += lineHeight;
        addText(JSON.stringify(content, null, 2));

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
