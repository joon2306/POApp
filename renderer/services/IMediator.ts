import IUnsubscribe from "./IUnsubscribe";

export default interface IMediator {

    subscribe<T>(event: string, callback: (arg: T) => void): IUnsubscribe;

    publish<T>(event: string, data?: T): void;
}