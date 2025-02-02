import React from 'react';
import Dashboard, { DashboardContent } from "../components/Dashboard";
import Kanban from '../components/Kanban';

export default function HomePage() {

  const dashboardContent: DashboardContent = {
    Kanban: {
      title: "Kanban",
      content: Kanban
    },
    Feature: {
      title: "feature tracking",
      content: Kanban2
    }
  }

  return (
    <>
      <Dashboard dashboardContent={dashboardContent} activeDashboardBtn={dashboardContent.Kanban.title} />
    </>
  )
}

function Kanban2() {
  return <>
    <div className='flex justify-center items-center h-screen'>Feature not yet available</div>
  </>
}