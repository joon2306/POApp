
export default interface ITimeTrackerDbService {

    track(): void;

    hasTracked(): boolean;
}