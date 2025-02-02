export class KanbanCard {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public priority: number,
        public status: number
    ) { }

    static fromCsvRow(row: string[]): KanbanCard {
        if (row.length < 5) {
            throw new Error('Invalid CSV row format for Kanban card');
        }
        return new KanbanCard(
            row[0],
            row[1],
            row[2],
            parseInt(row[3], 10),
            parseInt(row[4], 10)
        );
    }
}