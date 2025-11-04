export default interface IExeService {

    execute<T>(exeName: string, args: string[]): Promise<T>;
}