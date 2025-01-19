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
            <div className="flex h-screen">
                <div className="bg-purple-dashboard w-1/3 rounded-tr-[40px] rounded-br-[40px]">
                    <div className="flex flex-col items-center w-full h-screen mt-5 pb-2.5 ml-[-10%] lg:ml-[-20%]">
                        <Image src="/images/productOwnerLogo.png" width="150" height="150" alt="anything" />
                        <div className='flex-1 flex'>
                            <div className='text-white'>
                                {
                                    renderDashboardBtnList()
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] ml-[-8%] lg:ml-[-15%]">
                    {/* Content for the right side */}
                    {
                        renderDashboardContent()
                    }
                </div>
            </div>
        </>
    )
}


function DashboardButton({ title, icon: Icon, active, handleClick }) {



    return (
        <div className={`flex p-3 mt-5 mb-5 ${active ? 'bg-white' : ''} ${active ? 'rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] rounded-br-[10px]' : ''} cursor-pointer`}
            onClick={handleClick}>
            <div className={`flex flex-col justify-center pl-2`}>
                <Icon className={`${active ? 'text-purple-dashboard' : ''}`} />
            </div>
            <div className={`flex flex-col justify-center`}>
                <div className={`pl-10 ${active ? 'text-purple-dashboard' : ''} pr-5`}> {title} </div>
            </div>
        </div>
    );
}

