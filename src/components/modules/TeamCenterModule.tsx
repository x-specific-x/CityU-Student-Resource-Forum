import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  Users2, 
  Plus, 
  Search,
  Target,
  Clock,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Code,
  Palette,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export function TeamCenterModule() {
  const [activeTab, setActiveTab] = useState('find-team');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');
  const [filterBy, setFilterBy] = useState('all');
  
  const availableTeams = [
    {
      id: 1,
      name: "智慧校园APP开发团队",
      description: "开发一个集校园服务、社交、学习于一体的移动应用",
      leader: "张三",
      leaderAvatar: "张",
      category: "技术项目",
      skills: ["React Native", "Node.js", "UI设计"],
      currentMembers: 3,
      maxMembers: 6,
      progress: 25,
      stage: "需求分析",
      needs: [
        { role: "前端开发", count: 1, skills: ["React", "JavaScript"] },
        { role: "UI设计师", count: 1, skills: ["Figma", "设计思维"] }
      ],
      duration: "4个月",
      commitment: "每周10-15小时",
      location: "线上+线下",
      deadline: "2024-02-01",
      isUrgent: true
    },
    {
      id: 2,
      name: "Kaggle机器学习竞赛队",
      description: "参加Kaggle数据科学竞赛，目标进入前10%，冲击奖金",
      leader: "李四",
      leaderAvatar: "李",
      category: "学术竞赛",
      skills: ["Python", "TensorFlow", "数据分析"],
      currentMembers: 2,
      maxMembers: 4,
      progress: 40,
      stage: "数据探索",
      needs: [
        { role: "数据科学家", count: 1, skills: ["Python", "Pandas", "Scikit-learn"] },
        { role: "深度学习工程师", count: 1, skills: ["TensorFlow", "PyTorch"] }
      ],
      duration: "2个月",
      commitment: "每周8-12小时",
      location: "线上",
      deadline: "2024-01-20",
      isUrgent: false
    },
    {
      id: 3,
      name: "创业项目：校园二手交易平台",
      description: "构建一个安全可靠的校园二手物品交易平台",
      leader: "王五",
      leaderAvatar: "王",
      category: "创业项目",
      skills: ["商业策划", "产品设计", "市场营销"],
      currentMembers: 4,
      maxMembers: 8,
      progress: 15,
      stage: "商业计划",
      needs: [
        { role: "产品经理", count: 1, skills: ["产品设计", "用户研究"] },
        { role: "市场推广", count: 2, skills: ["营销策划", "社交媒体"] }
      ],
      duration: "6个月+",
      commitment: "每周15-20小时",
      location: "校内孵化器",
      deadline: "2024-01-25",
      isUrgent: false
    },
    {
      id: 4,
      name: "ACM-ICPC程序设计竞赛队",
      description: "备战ACM国际大学生程序设计竞赛，提升算法编程能力",
      leader: "赵算法",
      leaderAvatar: "赵",
      category: "程序竞赛",
      skills: ["算法设计", "C++", "数据结构", "动态规划"],
      currentMembers: 2,
      maxMembers: 3,
      progress: 60,
      stage: "强化训练",
      needs: [
        { role: "算法工程师", count: 1, skills: ["C++", "算法优化", "数学建模"] }
      ],
      duration: "6个月",
      commitment: "每周12-16小时",
      location: "校内机房",
      deadline: "2024-01-15",
      isUrgent: true
    },
    {
      id: 5,
      name: "数学建模竞赛团队",
      description: "参加全国大学生数学建模竞赛，冲击国家级奖项",
      leader: "钱数模",
      leaderAvatar: "钱",
      category: "学科竞赛",
      skills: ["数学建模", "MATLAB", "Python", "论文写作"],
      currentMembers: 2,
      maxMembers: 3,
      progress: 30,
      stage: "模型学习",
      needs: [
        { role: "建模专家", count: 1, skills: ["统计学", "运筹学", "MATLAB"] }
      ],
      duration: "3个月",
      commitment: "每周10-14小时",
      location: "线上+校内",
      deadline: "2024-01-28",
      isUrgent: false
    },
    {
      id: 6,
      name: "区块链投票系统研究",
      description: "研究基于区块链的安全投票系统，撰写学术论文",
      leader: "孙区块",
      leaderAvatar: "孙",
      category: "学术研究",
      skills: ["Solidity", "Web3", "密码学", "系统安全"],
      currentMembers: 3,
      maxMembers: 5,
      progress: 50,
      stage: "原型开发",
      needs: [
        { role: "区块链开发", count: 1, skills: ["Solidity", "以太坊"] },
        { role: "安全研究", count: 1, skills: ["密码学", "系统安全"] }
      ],
      duration: "8个月",
      commitment: "每周6-10小时",
      location: "校内实验室",
      deadline: "2024-02-10",
      isUrgent: false
    }
  ];

  const myTeams = [
    {
      id: 1,
      name: "区块链投票系统",
      role: "前端开发",
      members: 4,
      progress: 60,
      stage: "开发阶段",
      nextMeeting: "2024-01-08 14:00",
      tasks: [
        { name: "完成用户界面设计", status: "completed" },
        { name: "实现智能合约接口", status: "in-progress" },
        { name: "编写单元测试", status: "pending" }
      ]
    },
    {
      id: 2,
      name: "AI研究小组",
      role: "研究员",
      members: 6,
      progress: 35,
      stage: "文献调研",
      nextMeeting: "2024-01-10 16:00",
      tasks: [
        { name: "收集相关论文", status: "completed" },
        { name: "分析现有方法", status: "in-progress" },
        { name: "提出改进方案", status: "pending" }
      ]
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">组队中心</h1>
          <p className="text-muted-foreground">寻找队友，组建团队，共同完成项目和参与竞赛</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建团队
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>创建新团队</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">团队名称</label>
                <Input placeholder="输入团队名称" />
              </div>
              <div>
                <label className="text-sm font-medium">项目类别</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">技术项目</SelectItem>
                    <SelectItem value="research">学术研究</SelectItem>
                    <SelectItem value="competition">学术竞赛</SelectItem>
                    <SelectItem value="programming">程序竞赛</SelectItem>
                    <SelectItem value="modeling">学科竞赛</SelectItem>
                    <SelectItem value="startup">创业项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">项目描述</label>
                <Textarea placeholder="详细描述项目内容、目标和计划" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">团队人数上限</label>
                  <Input type="number" placeholder="如：6" />
                </div>
                <div>
                  <label className="text-sm font-medium">项目周期</label>
                  <Input placeholder="如：4个月" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">时间投入</label>
                  <Input placeholder="如：每周10-15小时" />
                </div>
                <div>
                  <label className="text-sm font-medium">工作方式</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">线上</SelectItem>
                      <SelectItem value="offline">线下</SelectItem>
                      <SelectItem value="hybrid">线上+线下</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">需要技能</label>
                <Input placeholder="如：React, Python, UI设计 (用逗号分隔)" />
              </div>
              <div>
                <label className="text-sm font-medium">招募截止时间</label>
                <Input type="date" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  创建团队
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索团队、竞赛项目、技能要求..."
          className="pl-10"
        />
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find-team">寻找团队</TabsTrigger>
          <TabsTrigger value="my-teams">我的团队</TabsTrigger>
        </TabsList>

        {/* 寻找团队 */}
        <TabsContent value="find-team" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="tech">技术项目</SelectItem>
                <SelectItem value="research">学术研究</SelectItem>
                <SelectItem value="competition">学术竞赛</SelectItem>
                <SelectItem value="programming">程序竞赛</SelectItem>
                <SelectItem value="modeling">学科竞赛</SelectItem>
                <SelectItem value="startup">创业项目</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">招募截止</SelectItem>
                <SelectItem value="progress">项目进度</SelectItem>
                <SelectItem value="members">团队人数</SelectItem>
                <SelectItem value="urgent">紧急程度</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            {availableTeams.map((team) => (
              <Card key={team.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {team.leaderAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{team.name}</h3>
                          {team.isUrgent && <Badge variant="destructive">急招</Badge>}
                          <Badge variant="outline">{team.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          队长：{team.leader}
                        </p>
                      </div>
                    </div>
                    <Button>申请加入</Button>
                  </div>

                  <p className="text-sm mb-4">{team.description}</p>

                  {/* 项目进度 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">项目进度：{team.stage}</span>
                      <span className="text-sm text-muted-foreground">{team.progress}%</span>
                    </div>
                    <Progress value={team.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users2 className="h-4 w-4 text-gray-500" />
                        <span>团队规模：{team.currentMembers}/{team.maxMembers}人</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>时间投入：{team.commitment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>工作方式：{team.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>项目周期：{team.duration}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">急需职位：</h4>
                      <div className="space-y-2">
                        {team.needs.map((need, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{need.role}</span>
                              <Badge variant="secondary" className="text-xs">
                                需要 {need.count} 人
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {need.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">技能要求：</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>招募截止：{team.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 我的团队 */}
        <TabsContent value="my-teams" className="space-y-4">
          <div className="grid gap-6">
            {myTeams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        我的角色：{team.role} • {team.members} 人团队
                      </p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1">
                      {team.stage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 项目进度 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">整体进度</span>
                      <span className="text-sm text-muted-foreground">{team.progress}%</span>
                    </div>
                    <Progress value={team.progress} className="h-2" />
                  </div>

                  {/* 下次会议 */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">下次团队会议</span>
                    </div>
                    <p className="text-sm text-blue-700">{team.nextMeeting}</p>
                  </div>

                  {/* 我的任务 */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">我的任务进度</h4>
                    <div className="space-y-2">
                      {team.tasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          {getStatusIcon(task.status)}
                          <span className={`text-sm flex-1 ${
                            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {task.name}
                          </span>
                          <Badge 
                            variant={
                              task.status === 'completed' ? 'default' :
                              task.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {task.status === 'completed' ? '已完成' :
                             task.status === 'in-progress' ? '进行中' : '待开始'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      查看详情
                    </Button>
                    <Button size="sm">
                      团队聊天
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}