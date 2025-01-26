import styles from "../styles/kanban/style.module.css";

type KanbanCard = {
    title: string,
    description: string,
    priority: number,
    status?: number
}
type HeaderSwimLane = {
    headerTitle: string,
    headerColor: keyof typeof kanbanHeaderColors,
    status: number,
    cards: KanbanCard[]
}

const kanbanHeaderColors = {
    pending: "bg-pending-kanban",
    inProgress: "bg-inprogress-kanban",
    onHold: "bg-onhold-kanban",
    finished: "bg-finished-kanban"
}

const kanbanPendingCards: KanbanCard[] = [
    {
        title: "first title",
        description: "description of the first title",
        priority: 1
    }
]

const kanbanInProgressCards: KanbanCard[] = [
    {
        title: "first title",
        description: "description of the first title",
        priority: 1
    },
    {
        title: "second title",
        description: "description of the second title",
        priority: 2
    },
    {
        title: "first title",
        description: "description of the first title",
        priority: 1
    },
    {
        title: "second title",
        description: "description of the second title",
        priority: 2
    }
]

const kanbanOnHoldCards: KanbanCard[] = [
    {
        title: "first title",
        description: "description of the first title",
        priority: 1
    }
]

export default function Kanban() {
    return <>
        <div className={`flex justify-around my-10`}>

            <KanbanSwimLane headerTitle="Pending" headerColor="pending" status={1} cards={kanbanPendingCards} />

            <KanbanSwimLane headerTitle="In Progress" headerColor="inProgress" status={2} cards={kanbanInProgressCards} />

            <KanbanSwimLane headerTitle="On Hold" headerColor="onHold" status={3} cards={kanbanOnHoldCards} />

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


function KanbanCard({ title, description, priority, status }: KanbanCard) {
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
        <div className="w-[175px] lg:w-[200px] mt-3 text-[10px] cursor-pointer" onDoubleClick={() => console.log("Arjoon")}>
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


function KanbanSwimLane({ headerTitle, headerColor, status, cards }: HeaderSwimLane) {
    return (
        <div className="flex flex-col">

            <KanbanHeader title={headerTitle} color={headerColor} />

            {
                cards.map((card) => (
                    <KanbanCard key={card.title} description={card.description} priority={card.priority} title={card.title} status={status} />
                ))
            }

        </div>
    );
}