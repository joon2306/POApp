import styles from "../styles/kanban/style.module.css";

import React, { useEffect, useState } from "react";
import { KANBAN_SWIM_LANE_CONFIG, KanbanCardProp, KanbanCardType, KanbanStatus, PRIORITY_CONFIG } from "../types/KanbanTypes";
import { KanbanService } from "../services/impl/KanbanService";
import { sortKanbanCards } from "../utils/KanbanUtils";


type HeaderSwimLane = {
    headerTitle: string,
    headerColor: string,
    status: KanbanStatus,
    cards: KanbanCardType[],
    setActiveCard: (index: string) => void,
    onDrop: (status: number) => void
}

export default function Kanban() {

    const [activeCard, setActiveCard] = useState(null);
    const [kanbanCards, setKanbanCards] = useState<KanbanCardType[]>([]);
    const kanbanService = new KanbanService();

    useEffect(() => {
        const loadData = async () => {
            const cards = await kanbanService.getKanbanCards();
            setKanbanCards(sortKanbanCards(cards));
        };
        loadData();
    }, [kanbanService]);


    const onDrop = (status: number) => {
        if (!activeCard) {
            return;
        }

        const [cardStatus, cardId] = activeCard.split("-");
        if (cardStatus === status) {
            return;
        }
        const selectedCard = kanbanCards.find(card => card.id === cardId);
        if (!selectedCard) {
            return;
        }
        selectedCard.status = +status as unknown as KanbanStatus;
    };


    return <>
        <div className={`flex justify-around my-10`}>
            {
                Object.entries(KANBAN_SWIM_LANE_CONFIG).map(([k, { title, color }]) => (
                    <KanbanSwimLane
                        key={k}
                        headerTitle={title}
                        headerColor={color}
                        status={k as unknown as KanbanStatus}
                        cards={kanbanCards}
                        setActiveCard={setActiveCard}
                        onDrop={onDrop}
                    />
                ))
            }
        </div>
    </>
}


function KanbanHeader({ title, status }: { title: string, status: KanbanStatus }) {
    const color =
        +status === 1
            ? styles.bgPendingKanban
            : +status === 2
                ? styles.bgInProgressKanban
                : styles.bgOnHoldKanban;

    return (
        <>
            <div className={`${color} py-2 px-10 text-white font-bold rounded-tl-[7px] rounded-tr-[7px] rounded-bl-[7px] rounded-br-[7px] w-[175px] lg:w-[200px] text-center h-[40px]`}>
                {title}
            </div>
        </>
    )
}


function KanbanCard({ title, description, priority, status, setActiveCard, id }: KanbanCardProp) {
    status = +status as unknown as KanbanStatus;
    const priorityColor = PRIORITY_CONFIG[priority].color || "bg-low-priority";
    const priorityText = PRIORITY_CONFIG[priority].text || "Low";
    const priorityTextColor = PRIORITY_CONFIG[priority].textColor || "text-text-low-priority";
    const borderColor = status === 1 ? "border-pending-kanban" : status === 2 ? "border-inprogress-kanban" : "border-onhold-kanban";

    return (
        <div className="w-[175px] lg:w-[200px] mb-3 text-[10px] cursor-pointer" onDoubleClick={() => console.log("Arjoon")} draggable="true"
            onDragStart={() => setActiveCard(`${status}-${id}`)} onDragEnd={() => setActiveCard(null)}>
            <div className={`border ${borderColor} rounded-lg p-6 max-w-sm  
                  hover:border-blue-500 hover:ring-4 hover:ring-blue-500/50 
                  transition duration-300 ease-in-out`}>
                <div className="grid grid-cols-2 gap-y-2">
                    <p className="text-left text-grey-text">Title</p>
                    <p className="text-left text-title-text font-bold">
                        {title}
                    </p>
                    <p className="text-left text-grey-text">Description</p>
                    <p className="text-left">{description}</p>

                    <p className="text-left text-grey-text">Priority</p>
                    <div className={`text-center ${priorityColor} rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[5px] ${priorityTextColor} font-bold p-[3px]`}>
                        {priorityText}
                    </div>
                </div>


            </div>

        </div>
    )
}


function KanbanSwimLane({ headerTitle, status, cards, setActiveCard, onDrop }: HeaderSwimLane) {

    const applicableCards = cards.filter(card => +card.status === +status);

    return (
        <div className="flex flex-col">

            <KanbanHeader title={headerTitle} status={status} />
            <Droppable onDrop={() => onDrop(status)} />

            {
                applicableCards.map((card, index) => (
                    <React.Fragment key={card.id}>
                        <KanbanCard description={card.description} priority={card.priority} title={card.title} status={status} setActiveCard={setActiveCard} id={card.id} />
                    </React.Fragment>
                ))
            }

        </div>
    );
}



function Droppable({ onDrop }) {
    const [show, setShow] = useState(false);

    const showDroppableClassNames = `w-[200px] h-[130px] bg-white border-2 border-dotted border-gray-300 
            rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 
            transition-all duration-200 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            my-2 px-4 py-3 opacity-100`;
    const hideDroppableClassNames = "w-[200px] h-[30px] bg-gray-950 opacity-0";

    return (
        <div
            className={show ? showDroppableClassNames : hideDroppableClassNames}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
                onDrop();
                setShow(false);
            }}
            onDragEnter={() => {
                setShow(true)
            }}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setShow(false);
                }
            }}
        >
            {
                show && <section className="flex justify-center items-center h-[100%]">Drop here</section>
            }
        </div>
    );
}