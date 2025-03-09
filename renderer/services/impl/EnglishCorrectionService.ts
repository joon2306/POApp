import CommunicationEvents from '../../types/CommunicationEvent';
import EnglishGeneratorResponse from '../../types/English/English';
import ICommsService from '../ICommsService';
import IEnglishCorrectionService from '../IEnglishCorrectionService';
import CommsService from './CommsService';

let englishCorrectionService = null
export default class EnglishCorrectionService implements IEnglishCorrectionService {
    private commsService: ICommsService = null;
    constructor() {
        if (englishCorrectionService == null) {
            this.commsService = new CommsService();
            englishCorrectionService = this;
        }
        return englishCorrectionService;
    }
    async correctText(text: string): Promise<EnglishGeneratorResponse> {
        return await this.commsService.sendRequest(CommunicationEvents.improveEnglish, text);
    }
}