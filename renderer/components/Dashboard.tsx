import React, { useState } from 'react';
import Image from 'next/image';
import { MdOutlineViewKanban } from "react-icons/md";

interface DashboardItem {
    title: string;
    content: React.ComponentType;
}

export interface DashboardContent {
    [key: string]: DashboardItem;
}

export default function Dashboard({ dashboardContent, activeDashboardBtn }: { dashboardContent: DashboardContent; activeDashboardBtn: string }) {
    const [activeDashboard, setActiveDashboard] = useState(activeDashboardBtn);

    const handleClick = (title: string) => {
        setActiveDashboard(title);
    }

    function renderDashboardContent() {
        const getActiveContent = () => {
            return dashboardContent[activeDashboard]?.content ?? dashboardContent.kanban.content
        };

        const ActiveContent = getActiveContent();
        return (
            <>
                {<ActiveContent />}
            </>
        )
    }

    const renderDashboardBtnList = () => {
        return (
            <ul>
                {Object.entries(dashboardContent).map(([key]) => (
                    <li key={key}>
                        <DashboardButton
                            icon={MdOutlineViewKanban}
                            title={key}
                            active={key === activeDashboard}
                            handleClick={() => handleClick(key)}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <div className="flex">
                <div className="bg-purple-dashboard w-[25%] lg:w-[20%] rounded-tr-[40px] rounded-br-[40px]">
                    <div className="flex flex-col items-center w-full min-h-screen pt-5 pb-2.5">
                        <Image src="/images/productOwnerLogo.png" width="150" height="150" alt="anything" />
                        <div className='flex-1 flex'>
                            <div className='text-white'>
                                {renderDashboardBtnList()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] overflow-y-auto">
                    {renderDashboardContent()}
                </div>
            </div>
        </>
    )
}


function DashboardButton({ title, icon: Icon, active, handleClick }) {



    return (
        <div className={`flex p-3 mt-5 mb-5 ${active ? 'bg-white' : ''} ${active ? 'rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] rounded-br-[10px]' : ''} cursor-pointer w-[200px] md:2-[225px] lg:w-[250px]`}
            onClick={handleClick}>
            <div className={`flex flex-col justify-center pl-2`}>
                <Icon className={`${active ? 'text-purple-dashboard font-bold' : ''}`} />
            </div>
            <div className={`flex flex-col justify-center`}>
                <div className={`pl-10 ${active ? 'text-purple-dashboard font-bold' : ''} pr-5`}> {title} </div>
            </div>
        </div>
    );
}

