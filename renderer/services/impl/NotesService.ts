import INotesService from "../INotesService";

let instance: NotesService | null = null;

export default class NotesService implements INotesService {

    private notesStorage: string;

    constructor() {
        if (instance === null) {
            this.notesStorage = "";
            instance = this;
        }
        return instance;

    }

    async loadNotes(featureId: string): Promise<string> {
        console.log("loaded: ", this.notesStorage);
        return Promise.resolve(this.notesStorage);
    }

    async saveNotes(featureId: string, notes: string): Promise<void> {
        
        console.log("Saving notes: ", notes);
        this.notesStorage = notes;
        return Promise.resolve();
    }




}