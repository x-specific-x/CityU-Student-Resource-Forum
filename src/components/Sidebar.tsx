import { Home, BookOpen, Briefcase, Users2, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navigationItems = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'academic-resources', label: '学术资源', icon: BookOpen },
  { id: 'recruitment', label: '社团招募', icon: Briefcase },
  { id: 'team-center', label: '组队中心', icon: Users2 },
  { id: 'chat', label: '消息中心', icon: MessageCircle },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2 mt-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => {
    // 设置导航来源标记
    try {
      sessionStorage.setItem('navigationSource', 'sidebar');
    } catch (error) {
      console.error('Failed to set navigationSource in sessionStorage:', error);
    }

    // 调用原始的模块变更函数
    onModuleChange(item.id);
  }}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      

    </aside>
  );
}
