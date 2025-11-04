export default interface IUniqueVaultService {

    subscribe(id: string, callback: () => void, args?: unknown): void;

    unsubscribe(id: string): void;

    execute(id: string): Promise<void>;

}