import React from 'react';
import Dashboard, { DashboardContent } from "../components/Dashboard";
import Kanban from '../components/Kanban';
import FeatureGenerator from '../components/FeatureGenerator/FeatureGenerator';
import EmailGenerator from '../components/EmailGenerator/EmailGenerator';
import JiraGenerator from '../components/JiraGenerator/JiraGenerator';
import English from '../components/English/English';
import ProductivityComponent from '../components/Productivity/Productivity';
import VaultComponent from '../components/Vault/VaultComponent';

export default function HomePage() {

  const dashboardContent: DashboardContent = {
    Productivity: {
      title: "Productivity",
      content: ProductivityComponent
    },
    Kanban: {
      title: "Kanban",
      content: Kanban,
      props: { type: "TODO" }
    },
    Vault: {
      title: "Vault", 
      content: VaultComponent
    }
  }

  return (
    <>
      <Dashboard dashboardContent={dashboardContent} activeDashboardBtn={dashboardContent.Productivity.title} />
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

function EnglishMenu() {
  return <>
    <div className='flex justify-center items-center'><English/></div>
  </>
}