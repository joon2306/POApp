export default interface ICopyService {
    copy(input: string[]): Promise<void>;
}