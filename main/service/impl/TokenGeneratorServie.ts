import ICopyService from "../ICopyService";
import IExeService from "../IExeService";
import ITokenGeneratorService from "../ITokenGeneratorService";

let instance : TokenGeneratorService = null;
type TokenReponse = {
    error: boolean;
    message: string;
}
export default class TokenGeneratorService implements ITokenGeneratorService {

    #exeServie: IExeService;
    #copyService: ICopyService;
    constructor(exeService: IExeService, copyService: ICopyService) {
        if(instance === null) {
            this.#exeServie = exeService;
            this.#copyService = copyService;
            this.generateToken = this.generateToken.bind(this);
            instance = this;
        }
        return instance;
    }

    generateToken(): Promise<void> {
        return this.#exeServie.execute<string>("token_generator", [])
        .then((output: string) => {
            this.#copyService.copy([JSON.parse(output).message]);
        });
    }

    
}