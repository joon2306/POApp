import CommsService from './service/impl/CommsService';
import ICommunicationService from './service/ICommunicationService';
import { ICsvReader } from './service/ICsvReader';
import { CsvReaderService } from './service/impl/CsvReaderService';
import { KanbanCard } from './model/KanbanCard';
import CommunicationEvents from '../renderer/types/CommunicationEvent';
import KanbanDbService from './service/impl/KanbanDbService';
import IKanbanDbService from './service/IKanbanDbService';
import { KanbanDbItem } from './model/KanbanItem';

const filePath = 'E:\\PO_APP\\kanbanTodo.csv';


const firstRow = ["id", "title", "description", "priority", "status"];

export async function getKanbanCards() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const kanbanCards = kanbanDbService.getAllKanbanCards();
    commsService.getRequest(CommunicationEvents.getKanbanCards, () => kanbanCards);
}
export async function saveKanbanCard() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const save = ([{ title, description, priority, status, time }]: KanbanDbItem[]) => {
        kanbanDbService.saveKanbanCard({ title, description, priority, status, time });
    }
    commsService.getRequest(CommunicationEvents.saveKanbanCard, (kanbanCard: KanbanDbItem[]) => save(kanbanCard));
}


export async function deleteCard() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const deleteCard = ([{id}]: Array<{id: number}>) => {
        kanbanDbService.deleteKanbanCard(id)
    }
    commsService.getRequest(CommunicationEvents.deleteKanbanCard, ([{id}]: Array<{id: number}>) => {
        deleteCard([{id}])
});
}

export async function modifyCard() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const modifyCard =  ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
        kanbanDbService.modifyKanbanCard({ id, title, description, priority, status, time });
    }
    commsService.getRequest(CommunicationEvents.modifyKanbanCard, (kanbanCard: KanbanDbItem[]) => modifyCard(kanbanCard));
}

