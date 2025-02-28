import CommsService from './service/impl/CommsService';
import ICommunicationService from './service/ICommunicationService';
import { ICsvReader } from './service/ICsvReader';
import { CsvReaderService } from './service/impl/CsvReaderService';
import { KanbanCard } from './model/KanbanCard';
import CommunicationEvents from '../renderer/types/CommunicationEvent';
import { MdFilter7 } from 'react-icons/md';

const filePath = 'E:\\PO_APP\\kanbanTodo.csv';


const firstRow = ["id", "title", "description", "priority", "status"];

export async function getKanbanCards() {
    const commsService: ICommunicationService = new CommsService();
    const csvReaderService: ICsvReader = new CsvReaderService();
    const csvData = await csvReaderService.readCsv(filePath);
    const kanbanCards = csvData.slice(0).map((row) => KanbanCard.fromCsvRow(row));
    commsService.getRequest(CommunicationEvents.getKanbanCards, () => kanbanCards);
}
export async function saveKanbanCard() {
    const commsService: ICommunicationService = new CommsService();
    const csvReaderService: ICsvReader = new CsvReaderService();
    const save = async ([{ id, title, description, priority, status }]: KanbanCard[]) => {
        await csvReaderService.insertRow(filePath, [id, title, description, priority.toString(), status.toString()], firstRow)
    }
    commsService.getRequest(CommunicationEvents.saveKanbanCard, (kanbanCard: KanbanCard[]) => save(kanbanCard));
}


export async function deleteCard() {
    const commsService: ICommunicationService = new CommsService();
    const csvReaderService: ICsvReader = new CsvReaderService();
    const deleteCard = async ([id]: Array<string>) => {
        await csvReaderService.deleteRow(filePath, id, firstRow)
    }
    commsService.getRequest(CommunicationEvents.deleteKanbanCard, (id: Array<string>) => deleteCard(id));
}

export async function modifyCard() {
    const commsService: ICommunicationService = new CommsService();
    const csvReaderService: ICsvReader = new CsvReaderService();
    const modifyCard = async ([{ id, title, description, priority, status }]: KanbanCard[]) => {
        await csvReaderService.modifyRow(filePath, id, [id, title, description, priority.toString(), status.toString()], firstRow)
    }
    commsService.getRequest(CommunicationEvents.modifyKanbanCard, (kanbanCard: KanbanCard[]) => modifyCard(kanbanCard));
}