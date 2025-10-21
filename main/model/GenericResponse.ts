export default interface GenericResponse<T> {
    error: boolean;
    data: T;
}