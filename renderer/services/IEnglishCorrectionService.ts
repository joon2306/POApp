import EnglishGeneratorResponse from "../types/English/English";

export default interface IEnglishCorrectionService {
    correctText(text: string): Promise<EnglishGeneratorResponse>;
}