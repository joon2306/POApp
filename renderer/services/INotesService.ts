export default interface INotesService {

    loadNotes(featureId: string): Promise<string>;

    saveNotes(featureId: string, notes: string): Promise<void>;

}