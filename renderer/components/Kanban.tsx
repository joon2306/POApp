import styles from "../styles/kanban/style.module.css";

import React, { useState } from "react";

type KanbanCard = {
    id: number,
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
        id: 1,
        title: "first title",
        description: "description of the first title",
        priority: 1
    }
]

const kanbanInProgressCards: KanbanCard[] = [
    {
        id: 1,
        title: "first title",
        description: "description of the first title",
        priority: 1
    },
    {
        id: 2,
        title: "second title",
        description: "description of the second title",
        priority: 2
    },
    {
        id: 3,
        title: "first title",
        description: "description of the first title",
        priority: 1
    },
    {
        id: 4,
        title: "second title",
        description: "description of the second title",
        priority: 2
    }
]

const kanbanOnHoldCards: KanbanCard[] = [
    {
        id: 1,
        title: "first title",
        description: "description of the first title",
        priority: 1
    }
]

export default function Kanban() {

    const [activeCard, setActiveCard] = useState(null);
    const [pendingCards, setPendingCards] = useState(kanbanPendingCards);
    const [inProgressCards, setInProgressCards] = useState(kanbanInProgressCards);
    const [onHoldCards, setOnHoldCards] = useState(kanbanOnHoldCards);

    const onDrop = (status: number) => {
        if (!activeCard) {
            return;
        }

        const [cardId, cardStatus] = activeCard.split("_");
        if (cardStatus === status) {
            return;
        }

        const cards = {
            pending: kanbanPendingCards,
            inProgress: kanbanInProgressCards,
            onHold: kanbanOnHoldCards
        }

        const statusObj = {
            1: "pending",
            2: "inProgress",
            3: "onHold"
        }

        const newStatusColumn = statusObj[status];
        const statusColumn = statusObj[cardStatus];

        const selectedCard = cards[statusColumn].find((card: { id: number }) => {
            console.log(card.id === +cardId);
            return card.id === +cardId;
        });
        console.log("selectedCard: ", selectedCard);
        if (!selectedCard) {
            return;
        }

        cards[newStatusColumn].push(selectedCard);
        cards[statusColumn].pop(selectedCard);
        setPendingCards(cards.pending);
        setInProgressCards(cards.inProgress);
        setOnHoldCards(cards.onHold);

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
            <div className={`${bgColor} py-2 px-10 text-white font-bold rounded-tl-[7px] rounded-tr-[7px] rounded-bl-[7px] rounded-br-[7px] w-[175px] lg:w-[200px] text-center h-[40px] mb-4`}>
                {title}
            </div>
        </>
    )
}


function KanbanCard({ title, description, priority, status, setActiveCard, index }: KanbanCard) {
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
        <div className="w-[175px] lg:w-[200px] my-3 text-[10px] cursor-pointer" onDoubleClick={() => console.log("Arjoon")} draggable="true"
            onDragStart={() => setActiveCard(index)} onDragEnd={() => setActiveCard(null)}>
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
    const hideDroppableClassNames = "w-[200px] h-[20px] bg-gray-950 opacity-0";

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