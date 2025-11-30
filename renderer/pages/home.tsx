import React, { useEffect, useState } from 'react';
import Dashboard, { DashboardContent } from "../components/Dashboard";
import Kanban from '../components/Kanban';
import FeatureGenerator from '../components/FeatureGenerator/FeatureGenerator';
import EmailGenerator from '../components/EmailGenerator/EmailGenerator';
import JiraGenerator from '../components/JiraGenerator/JiraGenerator';
import English from '../components/English/English';
import ProductivityComponent from '../components/Productivity/Productivity';
import VaultComponent from '../components/Vault/VaultComponent';
import { LuListTodo } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaHeartPulse } from "react-icons/fa6";
import PulseRouter from '../components/PulseBoard/PulseRouter';
import PlannedPulseWrapper from '../components/PulseBoard/PlannedPulseWrapper';
import Plan from '../components/Plan/Plan';
import { MainRouter, useRoute } from '../context/RouteContext';

const dashboardContent: DashboardContent = {
  Productivity: {
    title: "Productivity",
    content: ProductivityComponent
  },
  Todo: {
    title: "Todo",
    content: Kanban,
    props: { type: "TODO" },
    icon: LuListTodo
  },
  PulseBoard: {
    title: "Pulse Board",
    content: PulseRouter,
    icon: FaHeartPulse
  },
  PlannedPulse: {
    title: "Planned pulse",
    content: PlannedPulseWrapper,
    icon: FaHeartPulse
  },
  Vault: {
    title: "Vault",
    content: VaultComponent,
    icon: RiLockPasswordLine
  }
}


export default function HomePage() {

  return (
    <MainRouter>
      <HomeComponent />
    </MainRouter>
  )
}


function HomeComponent() {

  const { mainRoute } = useRoute();

  const getActiveDashboard = () => {
    const defaultActive = dashboardContent.Productivity.title;
    if (!mainRoute.params || mainRoute.params.length === 0) {
      return defaultActive;
    }

    const param = mainRoute.params[0];
    console.log("param: ", param);
    const hasContent = Object.keys(dashboardContent).some(title => title === param);
    console.log("hasContent: ", hasContent);
    return hasContent ? dashboardContent[param as string].title : defaultActive;
  }

  return (
    <>
      {mainRoute.route === "DASHBOARD" &&
        <Dashboard dashboardContent={dashboardContent} activeDashboardBtn={getActiveDashboard()} />
      }
      {
        mainRoute.route === "PLANNED"
        && <Plan />
      }
    </>
  )
}

function FeatureGeneratorMenu() {
  return <>
    <div className='flex justify-center items-center'><FeatureGenerator /></div>
  </>
}

function EmailGeneratorMenu() {
  return <>
    <div className='flex justify-center items-center'><EmailGenerator /></div>
  </>
}

function JiraGeneratorMenu() {
  return <>
    <div className='flex justify-center items-center'><JiraGenerator /></div>
  </>
}

function EnglishMenu() {
  return <>
    <div className='flex justify-center items-center'><English /></div>
  </>
}