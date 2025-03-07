import { exportFeature } from '../export';
import CommunicationEvents from '../../renderer/types/CommunicationEvent';
import fs from 'fs';
import path from 'path';
import { testFeatureData } from './test-data/feature-export.data';

// Define testOutputDir at the top level
const testOutputDir = path.join(__dirname, 'test-output');

// Store callback for testing
let registeredCallback: Function;

// Mock CommsService
jest.mock('../service/impl/CommsService', () => {
    return jest.fn().mockImplementation(() => ({
        getRequest: (event: string, callback: Function) => {
            registeredCallback = callback;
        }
    }));
});

describe('Export Feature Tests', () => {
    beforeAll(() => {
        // Create test output directory if it doesn't exist
        if (!fs.existsSync(testOutputDir)) {
            fs.mkdirSync(testOutputDir, { recursive: true });
        }
    });

    test('should generate a PDF file with feature requirements', async () => {
        // Set up the export feature handler
        await exportFeature();
        
        // Call the registered callback with our test data
        const result = await registeredCallback(testFeatureData);

        // Write the PDF to file
        const pdfPath = path.join(testOutputDir, 'test-export.pdf');
        fs.writeFileSync(pdfPath, Buffer.from(result.pdf));

        // Verify PDF was created and has content
        expect(fs.existsSync(pdfPath)).toBeTruthy();
        const stats = fs.statSync(pdfPath);
        expect(stats.size).toBeGreaterThan(0);

        // Verify the response format
        expect(result).toHaveProperty('pdf');
        expect(result).toHaveProperty('headers');
        expect(result.headers['Content-Type']).toBe('application/pdf');
        expect(result.headers['Content-Disposition']).toBe('attachment; filename="feature-requirements.pdf"');
    });

    afterAll(() => {
        // Optional: Clean up test output directory
        // fs.rmSync(testOutputDir, { recursive: true, force: true });
    });
});