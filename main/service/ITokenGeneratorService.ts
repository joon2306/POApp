export default interface ITokenGeneratorService {
    generateToken(): Promise<void>;
}