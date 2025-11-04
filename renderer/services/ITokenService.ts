export default interface ITokenService {
    generateToken(): Promise<void>;
}