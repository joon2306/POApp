export interface ICsvReader {
  readCsv(filePath: string): Promise<string[][]>;
  insertRow(filePath: string, row: string[], firstRow: string[]): Promise<void>;
  deleteRow(filePath: string, id: string, firstRow: string[]): Promise<void>;
  modifyRow(filePath: string, id: string, updatedRow: string[], firstRow: string[]): Promise<void>;
}