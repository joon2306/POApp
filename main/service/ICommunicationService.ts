export default interface ICommunicationService {
    getRequest(event: string, callback: (arg: unknown) => unknown): void;
}