export default interface EmailGeneratorResponse {
    error: boolean;
    result: string | EmailGeneratorContent
}

export interface EmailGeneratorContent {
    content: string;
    subject: string;
}