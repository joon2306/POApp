import styles from "../styles/kanban/style.module.css";

import React, { useState } from "react";

type KanbanCard = {
    id?: string,
    title: string,
    description: string,
    priority: number,
    status?: number,
    setActiveCard?: (index: string) => void
    index?: string
}
type HeaderSwimLane = {
    headerTitle: string,
    headerColor: keyof typeof kanbanHeaderColors,
    status: number,
    cards: KanbanCard[],
    setActiveCard: (index: string) => void,
    onDrop: (status: number) => void
}

const kanbanHeaderColors = {
    pending: "bg-pending-kanban",
    inProgress: "bg-inprogress-kanban",
    onHold: "bg-onhold-kanban",
    finished: "bg-finished-kanban"
}

const kanbanPendingCards: KanbanCard[] = [
    {
        title: "Meeting with Rohan",
        description: "discuss backend",
        priority: 1
    },
    {
        title: "Meeting with kisshan",
        description: "prepare questions",
        priority: 2
    },
    {
        title: "Meeting with Christine",
        description: "discuss issue ADTCUST-356",
        priority: 3
    },
    {
        title: "do feature estimation",
        description: "break into content backend and front",
        priority: 4
    },
    {
        title: "Inform Hiresh about modification to be done to spike",
        description: "discuss spike",
        priority: 1
    }
]

const kanbanInProgressCards: KanbanCard[] = [
    
]

const kanbanOnHoldCards: KanbanCard[] = [
    
]

const sortKanbanCards = (cards: KanbanCard[]) => {
    return cards.sort((a, b) => b.priority - a.priority);
}

const buildKanbanCards = (prefix: string, kanbanCards: KanbanCard[]) => {
    const assignIds = (prefix: string, cards: KanbanCard[]) => {
        let index = 0;
        cards.map(card => {
            card.id = `${prefix}_${++index}`;
        })
    }

    assignIds(prefix, kanbanCards);
    sortKanbanCards(kanbanCards);
    return kanbanCards;
}

export default function Kanban() {

    const [activeCard, setActiveCard] = useState(null);
    const [pendingCards, setPendingCards] = useState(buildKanbanCards("pending", kanbanPendingCards));
    const [inProgressCards, setInProgressCards] = useState(buildKanbanCards("inProgress", kanbanInProgressCards));
    const [onHoldCards, setOnHoldCards] = useState(buildKanbanCards("onHold", kanbanOnHoldCards));

    const onDrop = (status: number) => {
        if (!activeCard) {
            return;
        }

        const [cardStatus, cardId] = activeCard.split("-");
        if (cardStatus === status) {
            return;
        }

        const cards = {
            pending: pendingCards,
            inProgress: inProgressCards,
            onHold: onHoldCards
        }

        const statusObj = {
            1: "pending",
            2: "inProgress",
            3: "onHold"
        }

        const newStatusColumn = statusObj[status];
        const statusColumn = statusObj[cardStatus];

        const selectedCard = cards[statusColumn].find((card: { id: number }) => {
            return card.id === cardId;
        });
        if (!selectedCard) {
            return;
        }

        cards[newStatusColumn].push(selectedCard);
        const statusColumnCards = cards[statusColumn].filter(card => card.id !== cardId);
        cards[statusColumn] = statusColumnCards;


        setPendingCards(sortKanbanCards(cards.pending));
        setInProgressCards(sortKanbanCards(cards.inProgress));
        setOnHoldCards(sortKanbanCards(cards.onHold));

    };

    return <>
        <div className={`flex justify-around my-10`}>

            <KanbanSwimLane headerTitle="Pending" headerColor="pending" status={1} cards={pendingCards} setActiveCard={setActiveCard} onDrop={onDrop} />

            <KanbanSwimLane headerTitle="In Progress" headerColor="inProgress" status={2} cards={inProgressCards} setActiveCard={setActiveCard} onDrop={onDrop} />

            <KanbanSwimLane headerTitle="On Hold" headerColor="onHold" status={3} cards={onHoldCards} setActiveCard={setActiveCard} onDrop={onDrop} />

        </div>
    </>
}


function KanbanHeader({ title, color }: { title: string, color: keyof typeof kanbanHeaderColors }) {
    const bgColor = kanbanHeaderColors[color];
    return (
        <>
            <div className={`${bgColor} py-2 px-10 text-white font-bold rounded-tl-[7px] rounded-tr-[7px] rounded-bl-[7px] rounded-br-[7px] w-[175px] lg:w-[200px] text-center h-[40px]`}>
                {title}
            </div>
        </>
    )
}


function KanbanCard({ title, description, priority, status, setActiveCard, index, id }: KanbanCard) {
    const priorityObj = {
        1: {
            color: "bg-low-priority",
            text: "Low",
            textColor: "text-text-low-priority"
        },
        2: {
            color: "bg-medium-priority",
            text: "Medium",
            textColor: "text-text-medium-priority"
        },
        3: {
            color: "bg-high-priority",
            text: "High",
            textColor: "text-text-high-priority"
        },
        4: {
            color: "bg-critical-priority",
            text: "Critical",
            textColor: "text-text-critical-priority"
        }
    }

    const priorityColor = priorityObj[priority].color || "bg-low-priority";
    const priorityText = priorityObj[priority].text || "Low";
    const priorityTextColor = priorityObj[priority].textColor || "text-text-low-priority";
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
                    <div className={`text-center ${priorityColor} rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[5px] ${priorityTextColor} font-bold`}>
                        {priorityText}
                    </div>
                </div>


            </div>

        </div>
    )
}


function KanbanSwimLane({ headerTitle, headerColor, status, cards, setActiveCard, onDrop }: HeaderSwimLane) {

    return (
        <div className="flex flex-col">

            <KanbanHeader title={headerTitle} color={headerColor} />
            <Droppable onDrop={() => onDrop(status)} />

            {
                cards.map((card, index) => (
                    <React.Fragment key={`${index}_${status}`}>
                        <KanbanCard description={card.description} priority={card.priority} title={card.title} status={status} setActiveCard={setActiveCard} index={`${card.id}_${status}`} id={card.id} />
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