import CommsService from './service/impl/CommsService';
import ICommunicationService from './service/ICommunicationService';
import CommunicationEvents from '../renderer/types/CommunicationEvent';
import KanbanDbService from './service/impl/KanbanDbService';
import IKanbanDbService from './service/IKanbanDbService';
import { KanbanDbItem } from './model/KanbanItem';

export async function getKanbanCards() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const getKanbanCards = () => kanbanDbService.getAll();
    commsService.getRequest(CommunicationEvents.getKanbanCards, () => getKanbanCards());
}
export async function saveKanbanCard() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const save = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
        return kanbanDbService.create({ id, title, description, priority, status, time });
    }
    commsService.getRequest(CommunicationEvents.saveKanbanCard, (kanbanCard: KanbanDbItem[]) => save(kanbanCard));
}


export async function deleteCard() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const deleteCard = ([{id}]: Array<{id: number}>) => {
        kanbanDbService.delete(id)
    }
    commsService.getRequest(CommunicationEvents.deleteKanbanCard, ([{id}]: Array<{id: number}>) => {
        deleteCard([{id}])
});
}

export async function modifyCard() {
    const commsService: ICommunicationService = new CommsService();
    const kanbanDbService: IKanbanDbService = new KanbanDbService();
    const modifyCard =  ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
        kanbanDbService.modify({ id, title, description, priority, status, time });
    }
    commsService.getRequest(CommunicationEvents.modifyKanbanCard, (kanbanCard: KanbanDbItem[]) => modifyCard(kanbanCard));
}

