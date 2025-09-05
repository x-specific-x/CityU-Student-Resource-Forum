import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { 
  MessageCircle, 
  Users, 
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
  BellOff
} from 'lucide-react';

export function ChatModule() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  
  const chats = [
    {
      id: 1,
      type: 'private',
      name: '张三',
      avatar: '张',
      lastMessage: '好的，那我们明天下午2点图书馆见面讨论项目',
      lastTime: '2分钟前',
      unread: 0,
      online: true,
      major: '计算机科学'
    },
    {
      id: 2,
      type: 'group',
      name: 'CS3104数据结构讨论组',
      avatar: 'CS',
      lastMessage: '李四: 大家有没有第5章的课件？',
      lastTime: '10分钟前',
      unread: 3,
      online: false,
      members: 156
    },
    {
      id: 3,
      type: 'private',
      name: '王小红',
      avatar: '王',
      lastMessage: '谢谢你推荐的那家餐厅，真的很好吃！',
      lastTime: '1小时前',
      unread: 1,
      online: false,
      major: '商业管理'
    },
    {
      id: 4,
      type: 'group',
      name: '前端开发小组',
      avatar: 'FE',
      lastMessage: '赵六: 我已经把React组件上传到GitHub了',
      lastTime: '2小时前',
      unread: 0,
      online: false,
      members: 8
    },
    {
      id: 5,
      type: 'private',
      name: '李老师',
      avatar: '李',
      lastMessage: '你的作业完成得很好，继续保持',
      lastTime: '1天前',
      unread: 0,
      online: false,
      major: '教师'
    }
  ];

  const messages = [
    {
      id: 1,
      chatId: 1,
      sender: '张三',
      senderAvatar: '张',
      content: '你好，关于我们的毕业项目，你有时间讨论一下吗？',
      time: '14:30',
      type: 'text',
      isMe: false
    },
    {
      id: 2,
      chatId: 1,
      sender: '我',
      senderAvatar: '我',
      content: '当然可以！我明天下午有空',
      time: '14:32',
      type: 'text',
      isMe: true
    },
    {
      id: 3,
      chatId: 1,
      sender: '张三',
      senderAvatar: '张',
      content: '太好了！我们在图书馆讨论区见面怎么样？',
      time: '14:33',
      type: 'text',
      isMe: false
    },
    {
      id: 4,
      chatId: 1,
      sender: '我',
      senderAvatar: '我',
      content: '好的，那我们明天下午2点图书馆见面讨论项目',
      time: '14:35',
      type: 'text',
      isMe: true
    }
  ];

  const activeDiscussions = [
    {
      id: 1,
      title: '机器学习算法讨论',
      participants: 12,
      lastActivity: '5分钟前',
      category: '学术讨论'
    },
    {
      id: 2,
      title: '校园美食推荐',
      participants: 28,
      lastActivity: '15分钟前',
      category: '生活分享'
    },
    {
      id: 3,
      title: '前端技术交流',
      participants: 16,
      lastActivity: '30分钟前',
      category: '技术交流'
    }
  ];

  const currentChat = chats.find(chat => chat.id === selectedChat);
  const currentMessages = messages.filter(msg => msg.chatId === selectedChat);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // 这里可以实现发送消息的逻辑
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">消息中心</h1>
          <p className="text-muted-foreground">与同学老师交流，参与群组讨论</p>
        </div>
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新建聊天
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>开始新对话</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索用户或群组..."
                  className="pl-10"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">最近联系</h3>
                {chats.slice(0, 3).map((chat) => (
                  <div key={chat.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{chat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {chat.type === 'group' ? `${chat.members} 成员` : chat.major}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsNewChatDialogOpen(false)}>
                  开始聊天
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex h-[700px] bg-white rounded-lg border overflow-hidden">
        {/* 聊天列表 */}
        <div className="w-80 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">消息</h2>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索聊天..."
                className="pl-10 bg-gray-50"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100%-120px)]">
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all mb-1 ${
                    selectedChat === chat.id 
                      ? 'bg-blue-100 border border-blue-200' 
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`text-sm ${
                        chat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && chat.type === 'private' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{chat.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate flex-1 pr-2">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <Badge variant="destructive" className="text-xs px-2 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 聊天窗口 */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* 聊天头部 */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`${
                        currentChat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {currentChat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{currentChat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentChat.type === 'group' 
                          ? `${currentChat.members} 成员` 
                          : currentChat.online 
                            ? <><div className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></div>在线</> 
                            : '离线'
                        }
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
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 消息区域 */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-6">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-[75%] ${
                          message.isMe ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          {!message.isMe && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {message.senderAvatar}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                            message.isMe 
                              ? 'bg-blue-600 text-white rounded-br-md' 
                              : 'bg-white text-gray-900 border rounded-bl-md'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isMe ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 输入区域 */}
              <div className="border-t bg-white p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        placeholder="输入消息..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[44px] pr-12 py-3 rounded-full border-gray-200"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={sendMessage} 
                      size="sm" 
                      className="h-9 w-9 p-0 rounded-full"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">选择一个聊天开始对话</h3>
                <p className="text-gray-400">从左侧选择联系人或群组开始聊天</p>
              </div>
            </div>
          )}
        </div>
        
        {/* 右侧信息栏 */}
        {currentChat && (
          <div className="w-80 border-l bg-gray-50">
            <div className="p-4">
              {/* 聊天信息 */}
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarFallback className={`text-2xl ${
                    currentChat.type === 'group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {currentChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{currentChat.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentChat.type === 'group' 
                    ? `群组 • ${currentChat.members} 成员` 
                    : currentChat.major
                  }
                </p>
              </div>

              {/* 快速操作 */}
              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {currentChat.type === 'group' ? '邀请成员' : '添加好友'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  消息提醒
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  聊天设置
                </Button>
              </div>

              {/* 在线成员 */}
              {currentChat.type === 'group' && (
                <div>
                  <h4 className="font-medium mb-3">在线成员</h4>
                  <div className="space-y-2">
                    {['张三', '李四', '王五', '赵六'].map((member) => (
                      <div key={member} className="flex items-center space-x-2 p-2 hover:bg-white rounded">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {member[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                        </div>
                        <span className="text-sm">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}