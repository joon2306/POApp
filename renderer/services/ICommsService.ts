export default interface ICommsService {
    sendRequest<R>(event: string, ...args: any[]): Promise<R>
}