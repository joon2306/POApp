import EmailGeneratorResponse from "../types/EmailGenerator/EmailGenerator";
export default interface IEmailGeneratorService {
    generateEmail: (email: string) => Promise<EmailGeneratorResponse>;
}