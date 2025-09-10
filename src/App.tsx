import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { HomeModule } from "./components/modules/HomeModule";
import { AcademicResourcesModule } from "./components/modules/AcademicResourcesModule";
import { RecruitmentModule } from "./components/modules/RecruitmentModule";
import { TeamCenterModule } from "./components/modules/TeamCenterModule";
import { ChatModule } from "./components/modules/ChatModule";

export default function App() {
  const [activeModule, setActiveModule] = useState("home");

  // 初始化时从localStorage加载保存的模块状态
  useEffect(() => {
    const savedModule = localStorage.getItem('activeModule');
    if (savedModule) {
      setActiveModule(savedModule);
    }
  }, []);

  // 当模块变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('activeModule', activeModule);
  }, [activeModule]);

  // 监听来自HomeModule的模块切换事件
  useEffect(() => {
    const handleModuleChange = (event: CustomEvent) => {
      if (event.detail && event.detail.moduleId) {
        setActiveModule(event.detail.moduleId);
      }
    };

    window.addEventListener('moduleChange', handleModuleChange as EventListener);

    return () => {
      window.removeEventListener('moduleChange', handleModuleChange as EventListener);
    };
  }, []);

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
