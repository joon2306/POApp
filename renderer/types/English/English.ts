export default interface EnglishGeneratorResponse {
    error: boolean;
    result: string | EnglishGeneratorContent
}

export interface EnglishGeneratorContent {
    content: string;
}