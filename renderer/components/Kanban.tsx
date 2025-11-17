import styles from "../styles/kanban/style.module.css";

import React, { useEffect, useMemo, useRef } from "react";
import { HeaderSwimLane, KANBAN_SWIM_LANE_CONFIG, KanbanCardProp, KanbanCardType, KanbanFormValue, KanbanStatus, PRIORITY_CONFIG, PriorityLevel } from "../types/KanbanTypes";
import { useKanban } from "../hooks/useKanban";
import { useDroppable } from "../hooks/useDroppable";
import { useKanbanCard } from "../hooks/useKanbanCard";
import KanbanForm from "./Form/KanbanForm";
import { ModalType } from "../types/ModalTypes";
import { sortKanbanCards, getTagColors } from "../utils/KanbanUtils";
import MediatorEvents from "../constants/MediatorEvents";
import Mediator from "../services/impl/Mediator";
import { IModalService, useModalService } from "../services/impl/ModalService";
import { KanbanFactory, KanbanType } from "../factory/KanbanFactory";
import { SelectedFeature } from "./PulseBoard/PulseRouter";
import CommsService from "../services/impl/CommsService";
import { Feature, SPRINT_OPTIONS } from "../types/Feature/Feature";

export const COLOR_CONFIG: Record<string, {color: string, textColor: string}> = {
    low: {
        color: styles.bgLowPriority,
        textColor: styles.lowPriorityColor
    },
    medium: {
        color: styles.bgMediumPriority,
        textColor: styles.mediumPriorityColor
    },
    high: {
        color: styles.bgHighPriority,
        textColor: styles.highPriorityColor
    },
    critical: {
        color: styles.bgCriticalPriority,
        textColor: styles.criticalPriorityColor
    }
} as const;


const getKanbanForm = (isModify, handleSave, kanbanFormValue, modalService, type): ModalType => {
    return {
        title: isModify ? "Modify Kanban" : "Create Kanban",
        content: <KanbanForm onValidSubmit={handleSave} kanbanFormValue={kanbanFormValue} type={type} isModify={isModify}/>,
        buttons: [
            {
                label: "Cancel",
                onClick: modalService.closeModal,
                variant: "secondary"
            },
            {
                label: "Save",
                onClick: () => {
                    // Programmatically submit the form
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                },
                variant: "primary"
            }
        ],
        closeOnBackdrop: false
    };
}


const showErrorModal = (errorMessage: string, modalService: IModalService): ModalType => {

    return {
        title: "Error",
        content: <div className="text-red-500">{errorMessage}</div>,
        buttons: [
            {
                label: "Okay",
                onClick: () => modalService.closeModal(),
                variant: "primary"
            }
        ]
    }

}


export default function Kanban({ calculateHeight, type, selectedFeature }: {
    calculateHeight: () => number; type: KanbanType,
    selectedFeature?: SelectedFeature
}) {
    const kanbanService = KanbanFactory.of(type).setComms(new CommsService()).setSelectedFeature(selectedFeature).build();

    const { handleDragStart, handleDrop, kanbanCards, updateHeight, deleteCard, saveCard, modifyCard, loadData } = useKanban(kanbanService, type);
    const modalService = useModalService();
    const mediator = useMemo(() => new Mediator(), []);

    useEffect(() => {
        const unsubscribe = mediator.subscribe(MediatorEvents.GENERIC_KANBAN_ERROR, (errorMessage: string) => {
            const errorModal = showErrorModal(errorMessage, modalService);
            modalService.openModal(errorModal);
        });

        const updateCardsUnsubscribe = mediator.subscribe(MediatorEvents.KANBAN_CARD_UPDATE, async () => {
            await loadData();
        });
        return () => {
            if (unsubscribe instanceof Object) {
                unsubscribe.unsubscribe();
            }
            if (updateCardsUnsubscribe instanceof Object) {
                updateCardsUnsubscribe.unsubscribe();
            }
        }
    }, [mediator, modalService])

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
                        setActiveCard={handleDragStart}
                        onDrop={handleDrop}
                        updateHeight={updateHeight}
                        calculateHeight={calculateHeight}
                        deleteCard={deleteCard}
                        saveCard={saveCard}
                        modifyCard={modifyCard}
                        modalService={modalService}
                        type={type}
                        selectedFeature={selectedFeature}
                    />
                ))
            }
        </div>
    </>
}


function


    KanbanHeader({ title, status, saveCard, modalService, type }: { title: string, status: KanbanStatus, saveCard: (arg: KanbanFormValue) => void, modalService: IModalService, type: KanbanType }) {
    status = +status as unknown as KanbanStatus;
    const color =
        status === 1
            ? styles.bgPendingKanban
            : status === 2
                ? styles.bgInProgressKanban
                : styles.bgOnHoldKanban;

    const handleSubmit = ({ title, description, priority, id, time, target }: KanbanFormValue) => {
        saveCard({ title, description, priority, id, time, target });
        modalService.closeModal();
    }

    const modal = getKanbanForm(false, handleSubmit, undefined, modalService, type);

    const handleClick = () => {
        if (+status === 1) {
            modalService.openModal(modal);
        }
    }

    return (
        <>
            <div className={`${color} py-2 px-10 text-white font-bold rounded-tl-[7px] rounded-tr-[7px] rounded-bl-[7px] rounded-br-[7px] w-[175px] lg:w-[200px] text-center h-[40px]`}
                style={{ cursor: +status === 1 ? "pointer" : null }} onClick={handleClick}>
                {title}
            </div>
        </>
    )
}


function KanbanCard({ title, description, priority, status, setActiveCard, id, deleteCard, modifyCard, modalService, time, type, target, selectedFeature }: KanbanCardProp) {
    status = +status as unknown as KanbanStatus;
    priority = +priority as unknown as PriorityLevel;
    
    const isTodo = type === "TODO";

    const getTagText = () => {
        if (isTodo) {
            return PRIORITY_CONFIG[priority].text || "Low";
        }

        return SPRINT_OPTIONS[target - 1].label;
    }

    const tagColor = getTagColors(type, priority, target as Feature["target"], selectedFeature?.activeSprint);

    const borderColor = status === 1 ? "border-pending-kanban" : status === 2 ? "border-inprogress-kanban" : "border-onhold-kanban";

    const {color, textColor} = COLOR_CONFIG[tagColor];



    const { setIsHovered } = useKanbanCard(deleteCard, id);

    const handleSave = ({ description, title, priority, time, target }: KanbanFormValue) => {
        modifyCard({ description, title, priority, id, time, target });
        modalService.closeModal();
    }

    const kanbanFormValue: KanbanFormValue = {
        description,
        title,
        priority,
        id,
        time,
        target
    }

    const modal = getKanbanForm(true, handleSave, kanbanFormValue, modalService, type);


    return (
        <div className="w-[175px] lg:w-[200px] mb-3 text-[10px] cursor-pointer" onDoubleClick={() => modalService.openModal(modal)} draggable="true"
            onDragStart={() => setActiveCard(`${status}-${id}`)} onDragEnd={() => setActiveCard(null)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
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

                    <p className="text-left text-grey-text">{`${isTodo ? "Priority" : "Target"}`}</p>
                    <div className={`text-center ${color} rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[5px] ${textColor} font-bold p-[3px]`}>
                        {getTagText()}
                    </div>
                </div>


            </div>

        </div>
    )
}


function KanbanSwimLane({ headerTitle, status, cards, setActiveCard, onDrop, updateHeight, calculateHeight, deleteCard, saveCard, modifyCard, modalService, type, selectedFeature }: HeaderSwimLane) {

    const applicableCards = sortKanbanCards(cards.filter(card => +card.status === +status));
    const divRef = useRef();

    return (
        <div className="flex flex-col">

            <KanbanHeader title={headerTitle} status={status} saveCard={saveCard} modalService={modalService} type={type} />
            <Droppable onDrop={() => onDrop(status)} isBottom={false} calculateHeight={calculateHeight} divRef={divRef} updateHeight={updateHeight} />
            <div ref={divRef}>

                {
                    applicableCards.map((card, index) => (
                        <div key={card.id}>
                            <KanbanCard description={card.description} priority={card.priority} title={card.title} status={status} setActiveCard={setActiveCard} id={card.id}
                                deleteCard={deleteCard} modifyCard={modifyCard} modalService={modalService} time={card.time} type={type} target={card.target} selectedFeature={selectedFeature} />
                        </div>
                    ))
                }
            </div>
            <Droppable onDrop={() => onDrop(status)} isBottom={true} calculateHeight={calculateHeight} divRef={divRef} updateHeight={updateHeight} />

        </div>
    );
}



function Droppable({ onDrop, isBottom, calculateHeight, updateHeight, divRef }) {

    const { getHeight, show, handleDragEnter, handleDragOver, handleDrop, handleDragLeave } = useDroppable(divRef, updateHeight,
        calculateHeight, isBottom, onDrop);

    const showDroppableClassNames = `w-[200px] h-[130px] bg-white border-2 border-dotted border-gray-300 
            rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 
            transition-all duration-200 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            my-2 px-4 py-3 opacity-100`;
    const hideDroppableClassNames = `w-[200px] h-[30]px bg-gray-950 opacity-0`;

    return (
        <div
            style={{ height: getHeight() }}
            className={show ? showDroppableClassNames : hideDroppableClassNames}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {
                show && <section className="flex justify-center items-center h-[100%]">Drop here</section>
            }
        </div>
    );
}