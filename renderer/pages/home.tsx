import React, { useState } from 'react';
import Image from 'next/image';
import { MdOutlineViewKanban } from "react-icons/md";

export default function HomePage() {

  const [kanbanActive, setKanbanActive] = useState(true);
  const [kanban2Active, setKanban2Active] = useState(false);

  const dashboardContent = {
    kanban: {
      title: "kanban",
      active: kanbanActive,
      content: Kanban
    },
    kanban2: {
      title: "kanban2",
      active: kanban2Active,
      content: Kanban2
    }
  }

  const setInactive = () => {
    setKanbanActive(false);
    setKanban2Active(false);
  }

  const handleClick = (title: string) => {
    setInactive();
    switch (title) {
      case dashboardContent.kanban.title:
        return setKanbanActive(true);

      case dashboardContent.kanban2.title:
        return setKanban2Active(true);
      default:
        setKanbanActive(true)
    }
  }

  function renderDashboardContent() {
    const getActiveContent = () => {
    // Find the first active content in the dashboardContent object
    const activeKey = Object.keys(dashboardContent).find(key => dashboardContent[key].active);
    // Return the content of the first active item, or default to 'kanban' content
    return activeKey ? dashboardContent[activeKey].content : dashboardContent.kanban.content;
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
        {Object.entries(dashboardContent).map(([key, item]) => (
          <li key={key}>
            <DashboardButton
              icon={MdOutlineViewKanban}
              title={item.title}
              active={item.active}
              handleClick={() => handleClick(item.title)}
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

function Kanban() {
  return <>
    <div>Kanban</div>
  </>
}


function Kanban2() {
  return <>
    <div>Kanban2</div>
  </>
}