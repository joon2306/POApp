import React from 'react';
import Dashboard, { DashboardContent } from "../components/Dashboard";
import Kanban from '../components/Kanban';
import FeatureGenerator from '../components/FeatureGenerator/FeatureGenerator';
import EmailGenerator from '../components/EmailGenerator/EmailGenerator';
import JiraGenerator from '../components/JiraGenerator/JiraGenerator';

export default function HomePage() {

  const dashboardContent: DashboardContent = {
    Kanban: {
      title: "Kanban",
      content: Kanban
    },
    Feature: {
      title: "feature generator",
      content: FeatureGeneratorMenu
    },
    Email: {
      title: "email generator",
      content: EmailGeneratorMenu
    },
    Jira: {
      title: "jira generator",
      content: JiraGeneratorMenu
    }
  }

  return (
    <>
      <Dashboard dashboardContent={dashboardContent} activeDashboardBtn={dashboardContent.Kanban.title} />
    </>
  )
}

function FeatureGeneratorMenu() {
  return <>
    <div className='flex justify-center items-center'><FeatureGenerator/></div>
  </>
}

function EmailGeneratorMenu() {
  return <>
    <div className='flex justify-center items-center'><EmailGenerator/></div>
  </>
}

function JiraGeneratorMenu() {
  return <>
    <div className='flex justify-center items-center'><JiraGenerator/></div>
  </>
}