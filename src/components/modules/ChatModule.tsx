import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  MessageCircle,
  Plus,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Image,
  Mic,
  Settings,
  UserPlus,
  Bell,
  BellOff,
  CheckCircle,
  Moon,
  Sun,
  Trash2,
  Ban,
  Pin,
  UserMinus,
} from 'lucide-react';

/** ---------- 类型 ---------- */
interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  showPreview: boolean;
  muteUntil: string | null;
}
interface ChatSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  showReadReceipts: boolean;
  saveHistory: boolean;
  autoDownloadMedia: boolean;
}
interface PerChatSettings {
  notifications: boolean;
  isPinned: boolean;
  isMuted: boolean;
  muteUntil: string | null;
  showAvatar: boolean;
  showTimestamp: boolean;
}
type Relationship = 'none' | 'requested' | 'friends' | 'blocked';

type Chat =
  | {
    id: number;
    type: 'private';
    name: string;
    avatar: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
    online: boolean;
    major: string;
    members?: never;
  }
  | {
    id: number;
    type: 'group';
    name: string;
    avatar: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
    online: boolean;
    members: number;
    major?: never;
  };

interface User {
  id: number;
  name: string;
  avatar: string;
  major?: string;
  online?: boolean;
}

/** 新建聊天对话框选中项 */
type NewTarget =
  | { kind: 'chat'; chatId: number }
  | { kind: 'user'; userId: number }
  | null;

/** ---------- 组件 ---------- */
export function ChatModule() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [imageToSend, setImageToSend] = useState<string | null>(null);

  // 顶部设置弹窗
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [chatSettingsOpen, setChatSettingsOpen] = useState(false);
  // 当前聊天设置弹窗
  const [currentChatSettingsOpen, setCurrentChatSettingsOpen] = useState(false);

  // 全局设置（含 主题模式）
  const [globalNotificationSettings, setGlobalNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    showPreview: true,
    muteUntil: null,
  });

  const [globalChatSettings, setGlobalChatSettings] = useState<ChatSettings>({
    theme: 'system',
    fontSize: 'medium',
    showReadReceipts: true,
    saveHistory: true,
    autoDownloadMedia: true,
  });

  /** ---------- 初始会话数据（放到 state，便于新增） ---------- */
  const initialChats: Chat[] = [
    { id: 1, type: 'private', name: '张三', avatar: '张', lastMessage: '好的，那我们明天下午2点图书馆见面讨论项目', lastTime: '2分钟前', unread: 0, online: true, major: '计算机科学' },
    { id: 2, type: 'group', name: 'CS3104数据结构讨论组', avatar: 'CS', lastMessage: '李四: 大家有没有第5章的课件？', lastTime: '10分钟前', unread: 1, online: false, members: 4 },
    { id: 3, type: 'private', name: '王小红', avatar: '王', lastMessage: '谢谢你推荐的那家餐厅，真的很好吃！', lastTime: '1小时前', unread: 1, online: false, major: '商业管理' },
    { id: 4, type: 'group', name: '前端开发小组', avatar: 'FE', lastMessage: '赵六: 我已经把React组件上传到GitHub了', lastTime: '2小时前', unread: 0, online: false, members: 2 },
    { id: 5, type: 'private', name: '李老师', avatar: '李', lastMessage: '你的作业完成得很好，继续保持', lastTime: '1天前', unread: 0, online: false, major: '教师' },
  ];
  const [chats, setChats] = useState<Chat[]>(initialChats);

  // 消息模板
  const messagesTemplates = [
    { id: 1, chatId: 1, sender: '张三', senderAvatar: '张', content: '你好，关于我们的毕业项目，你有时间讨论一下吗？', time: '14:30', type: 'text', isMe: false, read: true },
    { id: 2, chatId: 1, sender: '我', senderAvatar: '我', content: '当然可以！我明天下午有空', time: '14:32', type: 'text', isMe: true },
    { id: 3, chatId: 1, sender: '张三', senderAvatar: '张', content: '太好了！我们在图书馆讨论区见面怎么样？', time: '14:33', type: 'text', isMe: false, read: true },
    { id: 4, chatId: 1, sender: '我', senderAvatar: '我', content: '好的，那我们明天下午2点图书馆见面讨论项目', time: '14:35', type: 'text', isMe: true },

    { id: 6, chatId: 2, sender: '班长', senderAvatar: '班', content: '提醒一下，下周二进行第5章的测验，请大家提前复习', time: '昨天 09:15', type: 'text', isMe: false, read: true },
    { id: 7, chatId: 2, sender: '王五', senderAvatar: '王', content: '请问测验范围是多少？', time: '昨天 09:18', type: 'text', isMe: false, read: true },
    { id: 8, chatId: 2, sender: '班长', senderAvatar: '班', content: '5.1到5.4节，主要考察二叉树和图的基本概念', time: '昨天 09:20', type: 'text', isMe: false, read: true },
    { id: 9, chatId: 2, sender: '我', senderAvatar: '我', content: '谢谢提醒，我刚好在复习这部分内容', time: '昨天 10:05', type: 'text', isMe: true },
    { id: 10, chatId: 2, sender: '李四', senderAvatar: '李', content: '大家有没有第5章的课件？我的笔记有点不全', time: '今天 08:40', type: 'text', isMe: false, read: false },

    { id: 11, chatId: 3, sender: '王小红', senderAvatar: '王', content: '嗨，周末你去了那家新开的餐厅吗？', time: '昨天 16:20', type: 'text', isMe: false, read: true },
    { id: 12, chatId: 3, sender: '我', senderAvatar: '我', content: '去了，味道还不错，特别是他们的招牌鱼', time: '昨天 16:25', type: 'text', isMe: true },
    { id: 14, chatId: 3, sender: '王小红', senderAvatar: '王', content: '我今天也去了，确实很好吃！谢谢你的推荐', time: '今天 12:30', type: 'text', isMe: false, read: false },
  ];

  /** ---------- 联系人目录（可新建会话的对象） ---------- */
  const allUsers: User[] = [
    { id: 101, name: '张三', avatar: '张', major: '计算机科学', online: true },
    { id: 102, name: '李四', avatar: '李', major: '电子工程', online: true },
    { id: 103, name: '王五', avatar: '王', major: '数学', online: true },
    { id: 104, name: '赵六', avatar: '赵', major: '物理', online: true },
    { id: 105, name: '钱七', avatar: '钱', major: '化学', online: false },
    { id: 106, name: '孙八', avatar: '孙', major: '中文', online: false },
  ];

  /** ---------- 单聊设置：按 chatId 存 ---------- */
  const defaultPerChat = (): PerChatSettings => ({
    notifications: true,
    isPinned: false,
    isMuted: false,
    muteUntil: null,
    showAvatar: true,
    showTimestamp: true,
  });

  const [chatSettingsById, setChatSettingsById] = useState<Record<number, PerChatSettings>>(() => {
    const map: Record<number, PerChatSettings> = {};
    initialChats.forEach((c) => (map[c.id] = { ...defaultPerChat() }));
    return map;
  });

  /** ---------- 好友关系：仅私聊 ---------- */
  const [relationsById, setRelationsById] = useState<Record<number, Relationship>>(() => {
    const map: Record<number, Relationship> = {};
    initialChats.forEach((c) => {
      if (c.type === 'private') map[c.id] = 'none';
    });
    return map;
  });
  const setRelation = (chatId: number, r: Relationship) => setRelationsById((prev) => ({ ...prev, [chatId]: r }));

  /** ---------- 群成员维护 ---------- */
  const [groupMembersById, setGroupMembersById] = useState<Record<number, number[]>>({
    2: [101, 102, 103, 104], // CS3104
    4: [101, 105], // 前端开发小组
  });

  // 邀请成员弹窗状态
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteSelected, setInviteSelected] = useState<number[]>([]);

  const toggleSelectInvitee = (uid: number) =>
    setInviteSelected((prev) => (prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]));

  const handleInviteConfirm = () => {
    if (!currentChat || currentChat.type !== 'group') return;
    setGroupMembersById((prev) => {
      const existed = prev[currentChat.id] ?? [];
      const next = Array.from(new Set([...existed, ...inviteSelected]));
      return { ...prev, [currentChat.id]: next };
    });
    setInviteSelected([]);
    setInviteSearch('');
    setInviteDialogOpen(false);
  };

  /** ---------- 删除群友弹窗 ---------- */
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

  const openRemoveMember = (u: User) => {
    setMemberToRemove(u);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveMember = () => {
    if (!currentChat || currentChat.type !== 'group' || !memberToRemove) return;
    setGroupMembersById((prev) => {
      const list = prev[currentChat.id] ?? [];
      return { ...prev, [currentChat.id]: list.filter((id) => id !== memberToRemove.id) };
    });
    setRemoveDialogOpen(false);
    setMemberToRemove(null);
  };

  /** ---------- 新建聊天弹窗 ---------- */
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [newTarget, setNewTarget] = useState<NewTarget>(null);

  // 搜索联系人（私聊目标）
  const filteredUsers = useMemo(() => {
    const q = newChatSearch.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter((u) => u.name.toLowerCase().includes(q) || (u.major || '').toLowerCase().includes(q));
  }, [newChatSearch]);

  // 最近联系（展示已有会话的前几位）
  const recentChats = chats.slice(0, 5);

  const startNewChat = () => {
    if (!newTarget) return;

    if (newTarget.kind === 'chat') {
      setSelectedChat(newTarget.chatId);
      setIsNewChatDialogOpen(false);
      return;
    }

    // newTarget.kind === 'user'
    const targetUser = allUsers.find((u) => u.id === newTarget.userId);
    if (!targetUser) return;

    // 已有同名私聊则直接进入
    const exist = chats.find((c) => c.type === 'private' && c.name === targetUser.name);
    if (exist) {
      setSelectedChat(exist.id);
      setIsNewChatDialogOpen(false);
      return;
    }

    // 创建新的私聊
    const nextId = (chats.reduce((m, c) => Math.max(m, c.id), 0) || 0) + 1;
    const newChat: Chat = {
      id: nextId,
      type: 'private',
      name: targetUser.name,
      avatar: targetUser.avatar,
      lastMessage: '',
      lastTime: '刚刚',
      unread: 0,
      online: !!targetUser.online,
      major: targetUser.major || '未设置',
    };
    setChats((prev) => [newChat, ...prev]);
    setChatSettingsById((prev) => ({ ...prev, [nextId]: { ...defaultPerChat() } }));
    setRelationsById((prev) => ({ ...prev, [nextId]: 'none' }));
    setSelectedChat(nextId);
    setIsNewChatDialogOpen(false);
    setNewTarget(null);
    setNewChatSearch('');
  };

  /** ---------- 便捷变量与派生 ---------- */
  const currentChat: Chat | null = chats.find((c) => c.id === selectedChat) || null;
  const currentChatSettings: PerChatSettings = currentChat ? chatSettingsById[currentChat.id] ?? defaultPerChat() : defaultPerChat();
  const currentRelation: Relationship =
    currentChat && currentChat.type === 'private' ? relationsById[currentChat.id] ?? 'none' : 'none';

  const updateChatSettings = (chatId: number, patch: Partial<PerChatSettings>) => {
    setChatSettingsById((prev) => ({
      ...prev,
      [chatId]: { ...prev[chatId], ...patch },
    }));
  };

  const handleCurrentChatSettingChange = <K extends keyof PerChatSettings>(key: K, value: PerChatSettings[K]) => {
    if (!currentChat) return;
    updateChatSettings(currentChat.id, { [key]: value } as Partial<PerChatSettings>);
  };

  const setMuteDuration = (duration: string | null) => {
    if (!currentChat) return;
    updateChatSettings(currentChat.id, { isMuted: duration !== null, muteUntil: duration });
  };

  // 全局/单聊提醒状态
  const notificationsGloballyActive = globalNotificationSettings.enabled && !globalNotificationSettings.muteUntil;

  // 置顶排序
  const sortedChats: Chat[] = useMemo(() => {
    const pinned: Chat[] = [];
    const normal: Chat[] = [];
    chats.forEach((c) => (chatSettingsById[c.id]?.isPinned ? pinned : normal).push(c));
    return [...pinned, ...normal];
  }, [chats, chatSettingsById]);

  // 计算群成员 & 候选人
  const getGroupMembers = (groupId: number) => groupMembersById[groupId] ?? [];
  const getGroupMemberCount = (groupId: number) => getGroupMembers(groupId).length;

  const candidatesForGroup = (groupId: number) => {
    const existing = new Set(getGroupMembers(groupId));
    return allUsers.filter((u) => !existing.has(u.id));
  };

  const filteredCandidates =
    currentChat && currentChat.type === 'group'
      ? candidatesForGroup(currentChat.id).filter((u) => u.name.toLowerCase().includes(inviteSearch.trim().toLowerCase()))
      : [];

  /** ---------- 消息收发 ---------- */
  const currentMessages = messagesTemplates.filter((m) => m.chatId === selectedChat);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('发送消息:', newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (selectedChat != null) console.log(`标记聊天 ${selectedChat} 中的消息为已读`);
  }, [selectedChat]);

  const handleGlobalNotificationChange = (key: keyof NotificationSettings, value: any) => {
    setGlobalNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };
  const handleGlobalChatSettingChange = (key: keyof ChatSettings, value: any) => {
    setGlobalChatSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImageToSend(imageUrl);
        console.log('发送图片:', imageUrl);
        (e.target as HTMLInputElement).value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  // 右侧好友按钮动作
  const toggleFriendAction = (chatId: number) => {
    const r = relationsById[chatId] ?? 'none';
    switch (r) {
      case 'none':
        setRelation(chatId, 'requested');
        break;
      case 'requested':
        setRelation(chatId, 'none');
        break;
      case 'friends':
        setRelation(chatId, 'none');
        break;
      case 'blocked':
        setRelation(chatId, 'none');
        break;
    }
  };
  const blockContact = (chatId: number) => setRelation(chatId, 'blocked');


  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as ChatSettings['theme'] | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      setGlobalChatSettings((prev) => ({ ...prev, theme: saved as any }));
    }
  }, []);

  // 根据选择应用到 html，并监听系统主题
  useEffect(() => {
    const apply = () => {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const t = globalChatSettings.theme;
      const shouldDark = t === 'dark' || (t === 'system' && sysDark);
      document.documentElement.classList.toggle('dark', shouldDark);
      localStorage.setItem('app-theme', t);
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (globalChatSettings.theme === 'system') apply();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [globalChatSettings.theme]);
  
  useEffect(() => {
    const saved = localStorage.getItem('app-fontsize') as ChatSettings['fontSize'] | null;
    if (saved && ['small', 'medium', 'large'].includes(saved)) {
      setGlobalChatSettings(prev => ({ ...prev, fontSize: saved as any }));
    }
  }, []);

  // —— 应用字体大小到全局并持久化 —— 
  useEffect(() => {
    const map: Record<ChatSettings['fontSize'], string> = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    const px = map[globalChatSettings.fontSize] ?? '16px';
    // 将字体大小设置存储在CSS变量中，但只在聊天模块内部使用
    document.documentElement.style.setProperty('--chat-font-size', px);
    localStorage.setItem('app-fontsize', globalChatSettings.fontSize);
  }, [globalChatSettings.fontSize]);


  /*计算总未读并同步到 Header*/
  const totalUnread = useMemo(() => {
    if (!notificationsGloballyActive) return 0;
    return chats.reduce((sum, c) => {
      const s = chatSettingsById[c.id] ?? defaultPerChat();
      if (!s.notifications || s.isMuted || s.muteUntil) return sum;
      return sum + (c.unread || 0);
    }, 0);
  }, [chats, chatSettingsById, notificationsGloballyActive]);

  useEffect(() => {
    (window as any).__unreadTotal = totalUnread;
    window.dispatchEvent(new CustomEvent('unread-total', { detail: totalUnread }));
  }, [totalUnread]);

  /** ---------- 渲染 ---------- */
  return (
    <div className="space-y-6" style={{ fontSize: 'var(--chat-font-size, 16px)' }}>
      {/* 顶部操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">消息中心</h1>
          <p className="text-muted-foreground">与同学老师交流，参与群组讨论</p>
        </div>

        <div className="flex space-x-2">
          {/* 全局消息提醒设置 */}
          <Dialog open={notificationSettingsOpen} onOpenChange={setNotificationSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                消息提醒
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>消息提醒设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">启用消息提醒</Label>
                    <p className="text-sm text-muted-foreground mt-1">开启或关闭所有消息提醒</p>
                  </div>
                  <Switch checked={globalNotificationSettings.enabled} onCheckedChange={(v) => handleGlobalNotificationChange('enabled', v)} />
                </div>

                {globalNotificationSettings.enabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">提示音</Label>
                        <p className="text-sm text-muted-foreground mt-1">收到消息时播放提示音</p>
                      </div>
                      <Switch checked={globalNotificationSettings.sound} onCheckedChange={(v) => handleGlobalNotificationChange('sound', v)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">震动提醒</Label>
                        <p className="text-sm text-muted-foreground mt-1">收到消息时震动设备</p>
                      </div>
                      <Switch checked={globalNotificationSettings.vibration} onCheckedChange={(v) => handleGlobalNotificationChange('vibration', v)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">显示消息预览</Label>
                        <p className="text-sm text-muted-foreground mt-1">在通知中显示消息内容</p>
                      </div>
                      <Switch checked={globalNotificationSettings.showPreview} onCheckedChange={(v) => handleGlobalNotificationChange('showPreview', v)} />
                    </div>

                    <div>
                      <Label className="text-base block mb-2">全局静音</Label>
                      <RadioGroup
                        value={globalNotificationSettings.muteUntil || ''}
                        onValueChange={(value: string) => handleGlobalNotificationChange('muteUntil', value || null)}
                        className="flex flex-wrap gap-3"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                          <RadioGroupItem value="" id="mute-none" />
                          <Label htmlFor="mute-none" className="cursor-pointer">不静音</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                          <RadioGroupItem value="1h" id="mute-1h" />
                          <Label htmlFor="mute-1h" className="cursor-pointer">1小时</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                          <RadioGroupItem value="1d" id="mute-1d" />
                          <Label htmlFor="mute-1d" className="cursor-pointer">1天</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                          <RadioGroupItem value="custom" id="mute-custom" />
                          <Label htmlFor="mute-custom" className="cursor-pointer">自定义</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* 全局聊天设置（含主题） */}
          <Dialog open={chatSettingsOpen} onOpenChange={setChatSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                聊天设置
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>聊天设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <Label className="text-base block mb-2">主题模式</Label>
                  <RadioGroup
                    value={globalChatSettings.theme}
                    onValueChange={(v: ChatSettings['theme']) => handleGlobalChatSettingChange('theme', v)}
                    className="flex flex-wrap gap-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="cursor-pointer flex items-center">
                        <Sun className="h-4 w-4 mr-1" /> 浅色
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="cursor-pointer flex items-center">
                        <Moon className="h-4 w-4 mr-1" /> 深色
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="cursor-pointer">跟随系统</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base block mb-2">字体大小</Label>
                  <RadioGroup
                    value={globalChatSettings.fontSize}
                    onValueChange={(v: ChatSettings['fontSize']) => handleGlobalChatSettingChange('fontSize', v)}
                    className="flex flex-wrap gap-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                      <RadioGroupItem value="small" id="font-small" />
                      <Label htmlFor="font-small" className="cursor-pointer text-sm">小</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                      <RadioGroupItem value="medium" id="font-medium" />
                      <Label htmlFor="font-medium" className="cursor-pointer">中</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                      <RadioGroupItem value="large" id="font-large" />
                      <Label htmlFor="font-large" className="cursor-pointer text-lg">大</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">已读回执</Label>
                    <p className="text-sm text-muted-foreground mt-1">向对方显示消息已读状态</p>
                  </div>
                  <Switch checked={globalChatSettings.showReadReceipts} onCheckedChange={(v) => handleGlobalChatSettingChange('showReadReceipts', v)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">保存聊天记录</Label>
                    <p className="text-sm text-muted-foreground mt-1">在设备上保存聊天历史</p>
                  </div>
                  <Switch checked={globalChatSettings.saveHistory} onCheckedChange={(v) => handleGlobalChatSettingChange('saveHistory', v)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">自动下载媒体</Label>
                    <p className="text-sm text-muted-foreground mt-1">自动下载图片和文件</p>
                  </div>
                  <Switch checked={globalChatSettings.autoDownloadMedia} onCheckedChange={(v) => handleGlobalChatSettingChange('autoDownloadMedia', v)} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 新建聊天 */}
          <Dialog open={isNewChatDialogOpen} onOpenChange={(o) => { setIsNewChatDialogOpen(o); if (!o) { setNewTarget(null); setNewChatSearch(''); } }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建聊天
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>开始新对话</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索用户或群组…"
                    className="pl-10"
                    value={newChatSearch}
                    onChange={(e) => setNewChatSearch(e.target.value)}
                  />
                </div>

                {/* 最近联系（已有会话） */}
                <div>
                  <h3 className="text-sm font-medium mb-2">最近联系</h3>
                  <div className="space-y-1">
                    {recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer border ${newTarget?.kind === 'chat' && newTarget.chatId === chat.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-transparent hover:bg-muted'}`}
                        onClick={() => setNewTarget({ kind: 'chat', chatId: chat.id })}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`${chat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} text-xs`}>{chat.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{chat.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {chat.type === 'group' ? `${getGroupMemberCount(chat.id)} 成员` : (chat as any).major}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 联系人（可创建新私聊） */}
                <div>
                  <h3 className="text-sm font-medium mb-2">联系人</h3>
                  <ScrollArea className="h-48 rounded border bg-card p-2">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${newTarget?.kind === 'user' && newTarget.userId === u.id ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-500' : 'hover:bg-muted'}`}
                        onClick={() => setNewTarget({ kind: 'user', userId: u.id })}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{u.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.major || '未设置'}</div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>取消</Button>
                  <Button onClick={startNewChat} disabled={!newTarget}>开始聊天</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex h-[700px] bg-card rounded-lg border overflow-hidden">
        {/* 左侧列表 */}
        <div className="w-96 border-r bg-muted/40 flex flex-col">
          <div className="p-4 border-b bg-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">消息</h2>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索聊天..." className="pl-10 bg-muted/40" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {sortedChats.map((chat) => {
                const s = chatSettingsById[chat.id] ?? defaultPerChat();
                const showBadge = notificationsGloballyActive && s.notifications && !s.isMuted && !s.muteUntil && chat.unread > 0;
                return (
                  <div
                    key={chat.id}
                    className={`relative flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all mb-1 ${selectedChat === chat.id ? 'bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50' : 'hover:bg-card hover:shadow-sm'
                      }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    {s.isPinned && <Pin className="h-3 w-3 text-yellow-500 absolute left-2" />}

                    <div className="relative">
                      <Avatar
                        className="w-12 h-12 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentUser(chat);
                          setUserDetailOpen(true);
                        }}
                      >
                        <AvatarFallback className={`text-sm ${chat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{chat.avatar}</AvatarFallback>
                      </Avatar>
                      {chat.online && chat.type === 'private' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                      {s.isMuted && selectedChat === chat.id && (
                        <BellOff className="absolute -top-1 -right-1 w-4 h-4 bg-card rounded-full text-muted-foreground border" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold truncate">
                          {chat.name}
                          {s.isPinned && <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-yellow-100 text-yellow-700 align-middle">置顶</span>}
                        </h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{chat.lastTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate flex-1 pr-2">{chat.lastMessage || ' '}</p>
                        {showBadge && (
                          <Badge variant="destructive" className="text-xs px-2 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* 中间聊天窗 */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* 头部 */}
              <div className="p-4 border-b bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      className="w-12 h-12 cursor-pointer"
                      onClick={() => {
                        setCurrentUser(currentChat);
                        setUserDetailOpen(true);
                      }}
                    >
                      <AvatarFallback className={`text-sm ${currentChat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{currentChat.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center">
                        {currentChat.name}
                        {currentChatSettings.isPinned && <Pin className="h-4 w-4 ml-2 text-yellow-500" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentChat.type === 'group'
                          ? `${getGroupMemberCount(currentChat.id) || (currentChat as any).members} 成员`
                          : (currentChat as any).online
                            ? (<><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />在线</>)
                            : '离线'}
                        {currentChatSettings.isMuted && (
                          <span className="ml-2 inline-flex items-center text-xs">
                            <BellOff className="h-3 w-3 mr-1" /> 已静音
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentChat.type === 'private' && (
                      <>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <Video className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* 当前聊天设置 */}
                    <Dialog open={currentChatSettingsOpen} onOpenChange={setCurrentChatSettingsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{currentChat.name} 设置</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">消息提醒</Label>
                              <p className="text-sm text-muted-foreground mt-1">接收此聊天的消息提醒</p>
                            </div>
                            <Switch checked={currentChatSettings.notifications} onCheckedChange={(v) => handleCurrentChatSettingChange('notifications', v)} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">置顶聊天</Label>
                              <p className="text-sm text-muted-foreground mt-1">将此聊天置顶显示</p>
                            </div>
                            <Switch checked={currentChatSettings.isPinned} onCheckedChange={(v) => handleCurrentChatSettingChange('isPinned', v)} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">静音聊天</Label>
                              <p className="text-sm text-muted-foreground mt-1">暂时静音此聊天</p>
                            </div>
                            <Switch checked={currentChatSettings.isMuted} onCheckedChange={(v) => setMuteDuration(v ? '1d' : null)} />
                          </div>

                          {currentChatSettings.isMuted && (
                            <div>
                              <Label className="text-base block mb-2">静音时长</Label>
                              <RadioGroup
                                value={currentChatSettings.muteUntil || ''}
                                onValueChange={(value: string) => setMuteDuration(value || null)}
                                className="flex flex-wrap gap-3"
                              >
                                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                                  <RadioGroupItem value="1h" id="chat-mute-1h" />
                                  <Label htmlFor="chat-mute-1h" className="cursor-pointer">1小时</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                                  <RadioGroupItem value="1d" id="chat-mute-1d" />
                                  <Label htmlFor="chat-mute-1d" className="cursor-pointer">1天</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                                  <RadioGroupItem value="1w" id="chat-mute-1w" />
                                  <Label htmlFor="chat-mute-1w" className="cursor-pointer">1周</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer">
                                  <RadioGroupItem value="forever" id="chat-mute-forever" />
                                  <Label htmlFor="chat-mute-forever" className="cursor-pointer">永久</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">显示头像</Label>
                              <p className="text-sm text-muted-foreground mt-1">在聊天中显示对方头像</p>
                            </div>
                            <Switch checked={currentChatSettings.showAvatar} onCheckedChange={(v) => handleCurrentChatSettingChange('showAvatar', v)} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">显示时间戳</Label>
                              <p className="text-sm text-muted-foreground mt-1">在消息旁显示发送时间</p>
                            </div>
                            <Switch checked={currentChatSettings.showTimestamp} onCheckedChange={(v) => handleCurrentChatSettingChange('showTimestamp', v)} />
                          </div>

                          <div className="pt-4 border-t">
                            <Button variant="destructive" className="w-full justify-start">
                              <Trash2 className="h-4 w-4 mr-2" />
                              清空聊天记录
                            </Button>

                            {currentChat.type === 'private' && (
                              <Button variant="outline" className="w-full justify-start mt-2 text-red-600 border-red-200" onClick={() => blockContact(currentChat.id)}>
                                <Ban className="h-4 w-4 mr-2" />
                                屏蔽联系人
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* 消息区域 */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-6">
                    {currentMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end space-x-2 max-w-[75%] ${message.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {!message.isMe && currentChatSettings.showAvatar && (
                            <Avatar
                              className="w-8 h-8 cursor-pointer"
                              onClick={() => {
                                const user = chats.find((c) => c.name === message.sender) || {
                                  name: message.sender,
                                  avatar: message.senderAvatar,
                                  type: 'private',
                                };
                                setCurrentUser(user);
                                setUserDetailOpen(true);
                              }}
                            >
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{message.senderAvatar}</AvatarFallback>
                            </Avatar>
                          )}

                          <div className={`rounded-2xl p-2 shadow-sm ${message.isMe ? 'bg-blue-600 text-white rounded-br-md' : 'bg-card text-foreground border rounded-bl-md'}`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>

                            {currentChatSettings.showTimestamp && (
                              <div className="flex items-center justify-between mt-1">
                                <p className={`text-xs ${message.isMe ? 'text-blue-100' : 'text-muted-foreground'}`}>{message.time}</p>
                                {message.isMe && globalChatSettings.showReadReceipts && (
                                  <CheckCircle className={`h-3 w-3 ${message.read ? 'text-blue-200' : 'text-blue-400'}`} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 输入区域 */}
              <div className="border-t bg-card p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex items-center space-x-1">
                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => document.getElementById('image-upload')?.click()}>
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        placeholder="输入消息..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[44px] pr-12 py-3 rounded-full"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button onClick={sendMessage} size="sm" className="h-9 w-9 p-0 rounded-full" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/40">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">选择一个聊天开始对话</h3>
                <p className="text-muted-foreground">从左侧选择联系人或群组开始聊天</p>
              </div>
            </div>
          )}
        </div>

        {/* 右侧栏 */}
        {currentChat && (
          <div className="w-80 border-l bg-muted/40">
            <div className="p-4">
              {/* 头像 & 名称 */}
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-3 cursor-pointer" onClick={() => { setCurrentUser(currentChat); setUserDetailOpen(true); }}>
                  <AvatarFallback className={`text-2xl ${currentChat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {currentChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{currentChat.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentChat.type === 'group' ? `群组 • ${getGroupMemberCount(currentChat.id) || (currentChat as any).members} 成员` : (currentChat as any).major}
                </p>
              </div>

              {/* 快速操作 */}
              <div className="space-y-3 mb-6">
                {currentChat.type === 'group' ? (
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <UserPlus className="h-4 w-4 mr-2" />
                        邀请成员
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>邀请成员到「{currentChat.name}」</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="搜索姓名…" value={inviteSearch} onChange={(e) => setInviteSearch(e.target.value)} className="pl-10" />
                        </div>

                        {/* 已选择 */}
                        <div className="flex flex-wrap gap-2 min-h-[28px]">
                          {inviteSelected.map((uid) => {
                            const u = allUsers.find((x) => x.id === uid);
                            if (!u) return null;
                            return (
                              <Badge key={uid} variant="secondary" className="cursor-pointer" onClick={() => toggleSelectInvitee(uid)} title="点击移除">
                                {u.name}
                              </Badge>
                            );
                          })}
                          {inviteSelected.length === 0 && <span className="text-xs text-muted-foreground">未选择成员</span>}
                        </div>

                        {/* 候选列表 */}
                        <ScrollArea className="h-60 border rounded-md p-2 bg-card">
                          {filteredCandidates.length === 0 && <div className="text-center text-sm text-muted-foreground py-8">没有可邀请的成员</div>}
                          {filteredCandidates.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{u.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm">{u.name}</div>
                                  <div className="text-xs text-muted-foreground">{u.major || '未设置'}</div>
                                </div>
                              </div>
                              <Button size="sm" variant={inviteSelected.includes(u.id) ? 'secondary' : 'outline'} onClick={() => toggleSelectInvitee(u.id)}>
                                {inviteSelected.includes(u.id) ? '已选择' : '选择'}
                              </Button>
                            </div>
                          ))}
                        </ScrollArea>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => { setInviteDialogOpen(false); setInviteSelected([]); setInviteSearch(''); }}>
                            取消
                          </Button>
                          <Button onClick={handleInviteConfirm} disabled={inviteSelected.length === 0}>
                            邀请{inviteSelected.length > 0 ? `（${inviteSelected.length}）` : ''}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button variant="outline" className="w-full justify-start" onClick={() => toggleFriendAction(currentChat.id)}>
                    {currentRelation === 'none' && (<><UserPlus className="h-4 w-4 mr-2" /> 添加好友</>)}
                    {currentRelation === 'requested' && (<><UserMinus className="h-4 w-4 mr-2" /> 取消请求</>)}
                    {currentRelation === 'friends' && (<><UserMinus className="h-4 w-4 mr-2" /> 删除好友</>)}
                    {currentRelation === 'blocked' && (<><Ban className="h-4 w-4 mr-2" /> 解除拉黑</>)}
                  </Button>
                )}

                {/* 单聊/群聊消息提醒快捷开关 */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleCurrentChatSettingChange('notifications', !currentChatSettings.notifications)}
                >
                  {currentChatSettings.notifications ? (<><Bell className="h-4 w-4 mr-2" /> 关闭消息提醒</>) : (<><BellOff className="h-4 w-4 mr-2" /> 开启消息提醒</>)}
                </Button>

                {/* 打开当前聊天设置 */}
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentChatSettingsOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  聊天设置
                </Button>
              </div>

              {/* 成员列表 + 删除群友 */}
              {currentChat.type === 'group' && (
                <div>
                  <h4 className="font-medium mb-3">在线成员</h4>
                  <div className="space-y-2">
                    {getGroupMembers(currentChat.id).map((uid) => {
                      const u = allUsers.find((x) => x.id === uid);
                      if (!u) return null;
                      return (
                        <div key={uid} className="flex items-center justify-between p-2 hover:bg-card rounded">
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{u.avatar}</AvatarFallback>
                              </Avatar>
                              {u.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-background" />}
                            </div>
                            <span className="text-sm">{u.name}</span>
                          </div>

                          {/* 移除按钮 */}
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-red-600" onClick={() => openRemoveMember(u)} title="移出群聊">
                            <Trash2 className="h-4 w-4 mr-1" />
                            移除
                          </Button>
                        </div>
                      );
                    })}
                    {getGroupMembers(currentChat.id).length === 0 && <div className="text-sm text-muted-foreground">暂无成员</div>}
                  </div>
                </div>
              )}
            </div>

            {/* 删除群友确认弹窗 */}
            <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>移除成员</DialogTitle>
                </DialogHeader>
                <p className="text-sm">确定将 <span className="font-medium">{memberToRemove?.name}</span> 移出「{currentChat?.name}」吗？</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>取消</Button>
                  <Button variant="destructive" onClick={confirmRemoveMember}>移除</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* 用户详情 */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{currentUser?.name} 的资料</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className={`text-2xl ${currentUser?.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {currentUser?.avatar}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground mb-1">{currentUser?.type === 'group' ? '群组' : '个人'}</p>
            <p className="text-sm mb-4">
              {currentUser?.type === 'group'
                ? `${getGroupMemberCount(currentUser?.id) || 0} 名成员`
                : currentUser?.major || '未设置个人信息'}
            </p>
            <div className="flex space-x-2 w-full">
              <Button className="flex-1">发送消息</Button>
              <Button variant="outline" className="flex-1">更多选项</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
