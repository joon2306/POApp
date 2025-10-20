export default interface GenericDbResponse<T> {
    error: boolean;
    data: T;
}