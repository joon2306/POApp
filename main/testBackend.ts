import { ipcMain } from 'electron'

export function hello() {
    ipcMain.on("insert-data", () => console.log("Ärjoon king3"));
}
