import React from 'react';
import Dashboard, { DashboardContent } from "../components/Dashboard";
import Kanban from '../components/Kanban';

export default function HomePage() {

  const dashboardContent: DashboardContent = {
    kanban: {
      title: "kanban",
      content: Kanban
    },
    kanban2: {
      title: "kanban2",
      content: Kanban2
    }
  }

  return (
    <>
      <Dashboard dashboardContent={dashboardContent} activeDashboardBtn={dashboardContent.kanban.title} />
    </>
  )
}

function Kanban2() {
  return <>
    <div>Kanban2</div>
  </>
}