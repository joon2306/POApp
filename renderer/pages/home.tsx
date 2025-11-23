import React from 'react';
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
import PulseBoard from '../components/PulseBoard/PulseBoard';
import PulseRouter from '../components/PulseBoard/PulseRouter';
import PiService from '../services/impl/PiService';
import CommsService from '../services/impl/CommsService';
import PlannedPiService from '../services/impl/PlannedPiService';
import PlannedPulseWrapper from '../components/PulseBoard/PlannedPulseWrapper';

export default function HomePage() {

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

  return (
    <>
      <Dashboard dashboardContent={dashboardContent} activeDashboardBtn={dashboardContent.Productivity.title} />
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