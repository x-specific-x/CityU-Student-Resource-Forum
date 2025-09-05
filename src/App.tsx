import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { HomeModule } from "./components/modules/HomeModule";
import { AcademicResourcesModule } from "./components/modules/AcademicResourcesModule";
import { RecruitmentModule } from "./components/modules/RecruitmentModule";
import { TeamCenterModule } from "./components/modules/TeamCenterModule";
import { LifeSharingModule } from "./components/modules/LifeSharingModule";
import { ChatModule } from "./components/modules/ChatModule";

export default function App() {
  const [activeModule, setActiveModule] = useState("home");

  const renderActiveModule = () => {
    switch (activeModule) {
      case "home":
        return <HomeModule />;
      case "academic-resources":
        return <AcademicResourcesModule />;
      case "recruitment":
        return <RecruitmentModule />;
      case "team-center":
        return <TeamCenterModule />;
      case "life-sharing":
        return <LifeSharingModule />;
      case "chat":
        return <ChatModule />;
      default:
        return <HomeModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        <main className="flex-1 p-6 ml-64">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}