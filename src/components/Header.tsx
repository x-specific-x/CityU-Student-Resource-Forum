import { User, LogOut, Bell, MessageCircle, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';

export function Header() {
  const [unread, setUnread] = useState<number>(0);

  // 跟 ChatModule 同步总未读数
  useEffect(() => {
    const handler = (e: any) => setUnread(e.detail ?? 0);
    window.addEventListener('unread-total', handler);
    // 初次同步（若 ChatModule 已经写过 window.__unreadTotal）
    setUnread((window as any).__unreadTotal ?? 0);
    return () => window.removeEventListener('unread-total', handler);
  }, []);

  return (
    <header className="bg-background border-b border-border px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl">CityU学生资源论坛</h1>
            <p className="text-sm text-muted-foreground">City University Student Resource Forum</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索讨论、资源、项目..."
              className="pl-10 w-80"
            />
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <MessageCircle className="h-5 w-5" />
            {/* 未读角标（保留你原来小点视觉；有数字就显示数字） */}
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-500 text-[10px] leading-4 text-white text-center">
              {unread > 0 ? unread : ''}
            </span>
          </Button>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full text-xs"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-blue-100 text-blue-700">张三</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm">张三</p>
                  <p className="text-xs text-muted-foreground">计算机科学专业</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
