import * as fs from 'fs';
import csvParser from 'csv-parser';
import { ICsvReader } from "../ICsvReader";

let csvReaderService: CsvReaderService = null;
export class CsvReaderService implements ICsvReader {

    constructor() {
        if (csvReaderService == null) {
            csvReaderService = this;
        }
        return csvReaderService;
    }
    public async readCsv(filePath: string): Promise<string[][]> {
        return new Promise((resolve, reject) => {
            const results: string[][] = [];
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row: Record<string, string>) => {
                    results.push(Object.values(row));
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error: Error) => {
                    reject(error);
                });
        });
    }

    public async insertRow(filePath: string, row: string[], firstRow: string[]): Promise<void> {
        const data = await this.readCsv(filePath);
        const newData = [firstRow, ...data, row]
        await this.writeCsv(filePath, newData);
    }

    public async deleteRow(filePath: string, id: string, firstRow: string[]): Promise<void> {
        const data = await this.readCsv(filePath);
        const filteredData = data.filter((row) => row[0] !== id); 
        await this.writeCsv(filePath, [firstRow, ...filteredData]);
    }

    public async modifyRow(filePath: string, id: string, updatedRow: string[], firstRow: string[]): Promise<void> {
        const data = await this.readCsv(filePath);
        const modifiedData = data.map((row) =>
            row[0] === id ? updatedRow : row
        );
        await this.writeCsv(filePath, [firstRow, ...modifiedData]);
    }

    private async writeCsv(filePath: string, data: string[][]): Promise<void> {
        return new Promise((resolve, reject) => {
            const csvContent = data.map((row) => row.join(',')).join('\n');
            fs.writeFile(filePath, csvContent, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}