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
import { 
  Briefcase, 
  Users, 
  Plus, 
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export function RecruitmentModule() {
  const [activeTab, setActiveTab] = useState('clubs');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');
  const [filterBy, setFilterBy] = useState('all');
  


  const recruitments = [
    {
      id: 1,
      title: "CityU学生会技术部",
      description: "负责学校网站维护、活动系统开发、技术支持等工作",
      organizer: "学生会",
      organizerAvatar: "学",
      type: "学生组织",
      skills: ["Web开发", "系统维护", "技术支持"],
      positions: [
        { role: "技术部长", count: 1, filled: 0 },
        { role: "开发工程师", count: 3, filled: 1 },
        { role: "运维工程师", count: 2, filled: 0 }
      ],
      benefits: ["实习证明", "技能培训", "人脉拓展"],
      workload: "每周6-8小时",
      deadline: "2024-01-10",
      applications: 25,
      isUrgent: true
    },
    {
      id: 2,
      title: "AI研究社团",
      description: "专注人工智能技术研究与应用，定期举办技术分享会和学术活动",
      organizer: "王五",
      organizerAvatar: "王",
      type: "学术社团",
      skills: ["机器学习", "深度学习", "Python", "TensorFlow"],
      positions: [
        { role: "技术总监", count: 1, filled: 0 },
        { role: "研究员", count: 5, filled: 2 },
        { role: "项目经理", count: 2, filled: 1 }
      ],
      benefits: ["学术研究", "论文发表", "技能提升"],
      workload: "每周4-6小时",
      deadline: "2024-01-25",
      applications: 18,
      isUrgent: false
    },
    {
      id: 3,
      title: "创业者协会",
      description: "为有创业想法的学生提供平台，组织创业培训、项目孵化和投资对接",
      organizer: "陈创业",
      organizerAvatar: "陈",
      type: "创业社团",
      skills: ["商业策划", "市场分析", "项目管理", "团队协作"],
      positions: [
        { role: "社团会长", count: 1, filled: 1 },
        { role: "项目经理", count: 3, filled: 1 },
        { role: "市场推广", count: 2, filled: 0 },
        { role: "财务管理", count: 1, filled: 0 }
      ],
      benefits: ["创业指导", "资源对接", "人脉扩展"],
      workload: "每周5-7小时",
      deadline: "2024-02-05",
      applications: 15,
      isUrgent: false
    },
    {
      id: 4,
      title: "摄影协会",
      description: "热爱摄影的同学聚集地，定期组织外拍活动、摄影比赛和技术交流会",
      organizer: "李摄影",
      organizerAvatar: "李",
      type: "文艺社团",
      skills: ["摄影技术", "后期处理", "美学素养", "活动策划"],
      positions: [
        { role: "技术指导", count: 2, filled: 1 },
        { role: "活动策划", count: 3, filled: 0 },
        { role: "宣传推广", count: 2, filled: 1 }
      ],
      benefits: ["摄影技能", "作品展示", "社交拓展"],
      workload: "每周3-5小时",
      deadline: "2024-01-30",
      applications: 22,
      isUrgent: false
    }
  ];

  const myApplications = [
    {
      id: 1,
      title: "AI研究社团",
      position: "研究员",
      status: "已通过",
      appliedDate: "2024-01-03",
      organizer: "王五"
    },
    {
      id: 2,
      title: "创业者协会",
      position: "项目经理",
      status: "待审核",
      appliedDate: "2024-01-05",
      organizer: "陈创业"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待审核': return 'bg-yellow-100 text-yellow-800';
      case '已通过': return 'bg-green-100 text-green-800';
      case '已拒绝': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">社团招募</h1>
          <p className="text-muted-foreground">发布社团和学生组织招募信息，寻找志同道合的伙伴</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              发布招募
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>发布招募信息</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">社团名称</label>
                  <Input placeholder="输入社团名称" />
                </div>
                <div>
                  <label className="text-sm font-medium">类型</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">学术社团</SelectItem>
                      <SelectItem value="student">学生组织</SelectItem>
                      <SelectItem value="tech">技术社团</SelectItem>
                      <SelectItem value="startup">创业社团</SelectItem>
                      <SelectItem value="arts">文艺社团</SelectItem>
                      <SelectItem value="sports">体育社团</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">社团描述</label>
                <Textarea placeholder="详细描述社团性质、活动内容和目标" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">时间投入</label>
                <Input placeholder="如：每周4-6小时" />
              </div>
              <div>
                <label className="text-sm font-medium">需要技能</label>
                <Input placeholder="如：策划能力, 沟通技巧, 组织能力 (用逗号分隔)" />
              </div>
              <div>
                <label className="text-sm font-medium">招募截止日期</label>
                <Input type="date" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  发布
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
          placeholder="搜索社团、技能要求、职位..."
          className="pl-10"
        />
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clubs">社团招募</TabsTrigger>
          <TabsTrigger value="applications">我的申请</TabsTrigger>
        </TabsList>



        {/* 社团招募 */}
        <TabsContent value="clubs" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="academic">学术社团</SelectItem>
                <SelectItem value="student">学生组织</SelectItem>
                <SelectItem value="tech">技术社团</SelectItem>
                <SelectItem value="startup">创业社团</SelectItem>
                <SelectItem value="arts">文艺社团</SelectItem>
                <SelectItem value="sports">体育社团</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">截止时间</SelectItem>
                <SelectItem value="applications">申请人数</SelectItem>
                <SelectItem value="urgent">紧急程度</SelectItem>
                <SelectItem value="created">发布时间</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            {recruitments.map((recruitment) => (
              <Card key={recruitment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {recruitment.organizerAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{recruitment.title}</h3>
                          {recruitment.isUrgent && <Badge variant="destructive">急招</Badge>}
                          <Badge variant="outline">{recruitment.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          组织者：{recruitment.organizer}
                        </p>
                      </div>
                    </div>
                    <Button>申请加入</Button>
                  </div>

                  <p className="text-sm mb-4">{recruitment.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>工作量：{recruitment.workload}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>截止日期：{recruitment.deadline}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">招募职位：</h4>
                      <div className="space-y-1">
                        {recruitment.positions.map((pos, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{pos.role}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              pos.filled >= pos.count 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pos.filled}/{pos.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">需要技能：</h4>
                    <div className="flex flex-wrap gap-2">
                      {recruitment.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">加入收益：</h4>
                    <div className="flex flex-wrap gap-2">
                      {recruitment.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{recruitment.applications} 人已申请</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 我的申请 */}
        <TabsContent value="applications" className="space-y-4">
          <div className="grid gap-4">
            {myApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{application.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        申请职位：{application.position}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>发起人：{application.organizer}</span>
                        <span>申请日期：{application.appliedDate}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
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