
import styles from "../styles/kanban/style.module.css";

const kanbanHeaderColors = {
    pending: "bg-pending-kanban",
    inProgress: "bg-inprogress-kanban",
    onHold: "bg-onhold-kanban",
    finished: "bg-finished-kanban"
}

export default function Kanban() {
    return <>
        <div className="flex justify-around mt-10">

            <div className="flex flex-col h-screen">

                <KanbanHeader title="Pending" color="pending" />

                <KanbanCard title="title of the task" description="description of the task" priority={3} />

            </div>


            <KanbanHeader title="In Progress" color="inProgress" />

            <KanbanHeader title="On Hold" color="onHold" />

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


function KanbanCard({ title, description, priority }: { title: string, description: string, priority: number }) {
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

    return (
        <div className="w-[175px] lg:w-[200px] mt-3 text-[10px] cursor-pointer" onDoubleClick={() => console.log("Arjoon")}>
            <div className="border border-blue-300 rounded-lg p-6 max-w-sm  
                  hover:border-blue-500 hover:ring-4 hover:ring-blue-500/50 
                  transition duration-300 ease-in-out">
                <div className="grid grid-cols-2 gap-y-2">
                    <p className="text-left">Title</p>
                    <p className="text-left">
                        {title}
                    </p>
                    <p className="text-left">Description</p>
                    <p className="text-left">{description}</p>

                    <p className="text-left">Priority</p>
                    <div className={`text-center ${priorityColor} rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[5px] ${priorityTextColor} font-bold`}>
                        {priorityText}
                    </div>
                </div>


            </div>

        </div>
    )
}