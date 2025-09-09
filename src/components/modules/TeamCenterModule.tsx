import { useState, useEffect } from 'react';
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
import teamData from '../../data/teamData.json';
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
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Briefcase
} from 'lucide-react';

export function TeamCenterModule() {
  const [activeTab, setActiveTab] = useState('find-team');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTaskEditDialogOpen, setIsTaskEditDialogOpen] = useState(false);
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
  const [currentEditingTeamInfo, setCurrentEditingTeamInfo] = useState<any>(null);
  const [currentEditingTeam, setCurrentEditingTeam] = useState<any>(null);
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' 或 'desc'
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false); // 是否只显示急招团队
  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  const [myTeamsList, setMyTeamsList] = useState<any[]>([]);
  const [myCreatedTeams, setMyCreatedTeams] = useState<any[]>([]); // 我创建的团队列表
  
  // 任务编辑状态
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  // 创建团队表单状态
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    category: '',
    maxMembers: '',
    duration: '',
    workload: '',
    workMode: '',
    customLocation: '',
    skills: '',
    deadline: '',
    positions: []
  });

  // 编辑团队表单状态
  const [editTeam, setEditTeam] = useState({
    name: '',
    description: '',
    category: '',
    maxMembers: '',
    duration: '',
    workload: '',
    workMode: '',
    customLocation: '',
    skills: '',
    deadline: '',
    positions: []
  });

  // 职位输入状态
  const [positionInput, setPositionInput] = useState({
    role: '',
    count: '',
    skills: ''
  });
  
  // 职位修改状态
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [editExistingPosition, setEditExistingPosition] = useState({
    count: '',
    skills: ''
  });

  // 团队ID映射：将availableTeams中的ID映射到myTeams中的ID
  const [teamIdMap, setTeamIdMap] = useState<{ [key: number]: number }>({
    6: 1, // 区块链投票系统研究 (availableTeams.id: 6) -> 区块链投票系统 (myTeams.id: 1)
    5: 2  // 数学建模竞赛团队 (availableTeams.id: 5) -> 数学建模竞赛团队 (myTeams.id: 2)
  });

  // 初始化数据
  useEffect(() => {
    // 尝试从localStorage中获取availableTeams数据
    const savedAvailableTeams = localStorage.getItem('availableTeams');
    
    if (savedAvailableTeams) {
      setAvailableTeams(JSON.parse(savedAvailableTeams));
    } else {
      setAvailableTeams(teamData.availableTeams);
    }

    // 尝试从localStorage中获取用户的团队数据
    const savedMyTeams = localStorage.getItem('myTeams');
    const savedTeamIdMap = localStorage.getItem('teamIdMap');
    const savedMyCreatedTeams = localStorage.getItem('myCreatedTeams');

    if (savedMyTeams) {
      setMyTeamsList(JSON.parse(savedMyTeams));
    } else {
      setMyTeamsList(teamData.myTeams);
    }

    if (savedTeamIdMap) {
      setTeamIdMap(JSON.parse(savedTeamIdMap));
    }

    if (savedMyCreatedTeams) {
      setMyCreatedTeams(JSON.parse(savedMyCreatedTeams));
    }
  }, []);

  // 当myTeamsList、teamIdMap、myCreatedTeams或availableTeams变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('availableTeams', JSON.stringify(availableTeams));
    localStorage.setItem('myTeams', JSON.stringify(myTeamsList));
    localStorage.setItem('teamIdMap', JSON.stringify(teamIdMap));
    localStorage.setItem('myCreatedTeams', JSON.stringify(myCreatedTeams));
  }, [availableTeams, myTeamsList, teamIdMap, myCreatedTeams]);

  // 处理申请加入团队
  const handleJoinTeam = (team: any) => {
    // 检查是否已经加入该团队
    const alreadyJoined = isTeamJoined(team.id);

    if (!alreadyJoined) {
      // 对于没有预定义映射的团队，使用一个新的唯一ID
      const newTeamId = teamIdMap[team.id] || Math.max(...myTeamsList.map(t => t.id), 0) + 1;

      // 创建一个新的团队对象，添加到我的团队列表
      const newTeam = {
        id: newTeamId,
        name: team.name,
        role: "成员", // 默认角色为成员
        members: team.currentMembers + 1, // 加入后成员数+1
        progress: team.progress,
        stage: team.stage,
        nextMeeting: "待定", // 初始会议时间待定
        tasks: team.tasks || [
          { name: "熟悉团队项目", status: "pending" },
          { name: "参与团队讨论", status: "pending" }
        ], // 使用团队原有的任务信息，如果没有则使用默认任务
        createdAt: new Date().toISOString().split('T')[0], // 添加创建时间
        isNewTeam: true // 标记为新加入的团队，用于控制UI显示
      };

      // 如果这个团队没有预定义映射，添加到映射中
      if (!teamIdMap[team.id]) {
        setTeamIdMap({
          ...teamIdMap,
          [team.id]: newTeamId
        });
      }

      setMyTeamsList([...myTeamsList, newTeam]);

      // 不再自动切换到"我的团队"标签页，让用户留在当前页面
    }
  };

  // 检查团队是否已加入
  const isTeamJoined = (teamId: number) => {
    const mappedId = teamIdMap[teamId];
    return mappedId !== undefined && myTeamsList.some(myTeam => myTeam.id === mappedId);
  };

  // 计算进度基于任务完成情况
  const calculateProgress = (tasks: any[] | undefined) => {
    if (!tasks || tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  
  // 打开任务编辑对话框
  const openTaskEditDialog = (team: any) => {
    setCurrentEditingTeam(team);
    // 如果是"我的创建"中的团队，同时设置currentEditingTeamInfo
    if (myCreatedTeams.some(t => t.id === team.id)) {
      setCurrentEditingTeamInfo(team);
    }
    setIsTaskEditDialogOpen(true);
    setNewTaskName('');
    setEditingTaskIndex(null);
    setEditingTaskName('');
  };

  // 打开编辑团队信息对话框
  const openEditTeamDialog = (team: any) => {
    setCurrentEditingTeamInfo(team);
    // 将团队信息填充到编辑表单
    setEditTeam({
      id: team.id,
      name: team.name,
      description: team.description,
      category: team.categoryValue,
      maxMembers: team.maxMembers.toString(),
      duration: team.duration,
      workload: team.commitment,
      workMode: team.workMode,
      customLocation: team.customLocation || '',
      skills: team.skills.join(', '),
      deadline: team.deadline,
      positions: team.needs.map((need: any) => ({
        role: need.role,
        count: need.count.toString(),
        skills: need.skills.join(', ')
      }))
    });
    setIsEditTeamDialogOpen(true);
  };
  
  // 添加新任务
  const handleAddTask = () => {
    if (!newTaskName.trim() || !currentEditingTeam) return;
    
    // 创建新任务
    const newTask = { name: newTaskName.trim(), status: 'pending' };
    
    // 更新当前编辑团队的任务列表
    const updatedCurrentTeam = {
      ...currentEditingTeam,
      tasks: [...currentEditingTeam.tasks, newTask]
    };
    
    // 立即更新当前编辑的团队对象，确保对话框内实时更新
    setCurrentEditingTeam(updatedCurrentTeam);
    
    // 更新myTeamsList中的任务
    const updatedMyTeamsList = myTeamsList.map(team => {
      if (team.id === currentEditingTeam.id) {
        return updatedCurrentTeam;
      }
      return team;
    });
    
    setMyTeamsList(updatedMyTeamsList);
    
    // 如果是"我的创建"中的团队，同时更新myCreatedTeams中的任务
    if (currentEditingTeamInfo && currentEditingTeam.id === currentEditingTeamInfo.id) {
      const updatedMyCreatedTeams = myCreatedTeams.map(team => {
        if (team.id === currentEditingTeamInfo.id) {
          // 更新当前编辑的团队信息对象，确保界面实时更新
          setCurrentEditingTeamInfo(updatedCurrentTeam);
          return updatedCurrentTeam;
        }
        return team;
      });
      
      setMyCreatedTeams(updatedMyCreatedTeams);
    }
    
    setNewTaskName('');
  };
  
  // 删除任务
  const handleDeleteTask = (index: number) => {
    if (!currentEditingTeam) return;
    
    // 更新当前编辑团队的任务列表
    const updatedTasks = [...currentEditingTeam.tasks];
    updatedTasks.splice(index, 1);
    
    const updatedCurrentTeam = {
      ...currentEditingTeam,
      tasks: updatedTasks
    };
    
    // 立即更新当前编辑的团队对象，确保对话框内实时更新
    setCurrentEditingTeam(updatedCurrentTeam);
    
    // 更新myTeamsList中的任务
    const updatedMyTeamsList = myTeamsList.map(team => {
      if (team.id === currentEditingTeam.id) {
        return updatedCurrentTeam;
      }
      return team;
    });
    
    setMyTeamsList(updatedMyTeamsList);
    
    // 如果是"我的创建"中的团队，同时更新myCreatedTeams中的任务
    if (currentEditingTeamInfo && currentEditingTeam.id === currentEditingTeamInfo.id) {
      const updatedMyCreatedTeams = myCreatedTeams.map(team => {
        if (team.id === currentEditingTeamInfo.id) {
          // 更新当前编辑的团队信息对象，确保界面实时更新
          setCurrentEditingTeamInfo(updatedCurrentTeam);
          return updatedCurrentTeam;
        }
        return team;
      });
      
      setMyCreatedTeams(updatedMyCreatedTeams);
    }
    
    // 如果正在编辑的任务被删除，取消编辑状态
    if (editingTaskIndex === index) {
      setEditingTaskIndex(null);
      setEditingTaskName('');
    }
  };
  
  // 开始编辑任务
  const startEditingTask = (index: number, taskName: string) => {
    setEditingTaskIndex(index);
    setEditingTaskName(taskName);
  };
  
  // 取消编辑任务
  const cancelEditingTask = () => {
    setEditingTaskIndex(null);
    setEditingTaskName('');
  };
  
  // 保存编辑后的任务
  const saveEditedTask = () => {
    if (!currentEditingTeam || editingTaskIndex === null || !editingTaskName.trim()) return;
    
    // 更新当前编辑团队的任务列表
    const updatedTasks = [...currentEditingTeam.tasks];
    updatedTasks[editingTaskIndex] = {
      ...updatedTasks[editingTaskIndex],
      name: editingTaskName.trim()
    };
    
    const updatedCurrentTeam = {
      ...currentEditingTeam,
      tasks: updatedTasks
    };
    
    // 立即更新当前编辑的团队对象，确保对话框内实时更新
    setCurrentEditingTeam(updatedCurrentTeam);
    
    // 更新myTeamsList中的任务
    const updatedMyTeamsList = myTeamsList.map(team => {
      if (team.id === currentEditingTeam.id) {
        return updatedCurrentTeam;
      }
      return team;
    });
    
    setMyTeamsList(updatedMyTeamsList);
    
    // 如果是"我的创建"中的团队，同时更新myCreatedTeams中的任务
    if (currentEditingTeamInfo && currentEditingTeam.id === currentEditingTeamInfo.id) {
      const updatedMyCreatedTeams = myCreatedTeams.map(team => {
        if (team.id === currentEditingTeamInfo.id) {
          // 更新当前编辑的团队信息对象，确保界面实时更新
          setCurrentEditingTeamInfo(updatedCurrentTeam);
          return updatedCurrentTeam;
        }
        return team;
      });
      
      setMyCreatedTeams(updatedMyCreatedTeams);
    }
    
    setEditingTaskIndex(null);
    setEditingTaskName('');
  };
  
  // 保存编辑后的团队信息
  const saveEditedTeamInfo = () => {
    if (!currentEditingTeamInfo) return;

    // 表单验证
    if (!editTeam.name.trim()) {
      alert('请输入团队名称');
      return;
    }
    if (!editTeam.category) {
      alert('请选择项目类别');
      return;
    }
    if (!editTeam.description.trim()) {
      alert('请输入项目描述');
      return;
    }
    if (!editTeam.maxMembers) {
      alert('请输入团队人数上限');
      return;
    }
    if (!editTeam.duration) {
      alert('请输入项目周期');
      return;
    }
    if (!editTeam.workload) {
      alert('请输入时间投入');
      return;
    }
    if (!editTeam.workMode) {
      alert('请选择工作方式');
      return;
    }
    if (editTeam.workMode === 'custom' && !editTeam.customLocation.trim()) {
      alert('请输入具体工作地点');
      return;
    }
    if (!editTeam.deadline) {
      alert('请选择招募截止时间');
      return;
    }

    try {
      // 处理技能字符串
      const skillsArray = editTeam.skills 
        ? editTeam.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : [];
      
      // 创建更新后的团队对象
      const updatedTeamObj = {
        id: editTeam.id,
        name: editTeam.name,
        description: editTeam.description,
        category: getCategoryLabel(editTeam.category),
        categoryValue: editTeam.category,
        currentMembers: currentEditingTeamInfo.currentMembers, // 保持当前成员数不变
        maxMembers: parseInt(editTeam.maxMembers),
        duration: editTeam.duration,
        commitment: editTeam.workload,
        workMode: editTeam.workMode,
        location: editTeam.workMode === 'custom' ? editTeam.customLocation : 
                 editTeam.workMode === 'online' ? '线上' : 
                 editTeam.workMode === 'offline' ? '线下' : '线上+线下',
        customLocation: editTeam.customLocation,
        skills: skillsArray,
        deadline: editTeam.deadline,
        positions: editTeam.positions,
        createdAt: currentEditingTeamInfo.createdAt, // 保持创建时间不变
        progress: currentEditingTeamInfo.progress, // 保持进度不变
        stage: currentEditingTeamInfo.stage, // 保持阶段不变
        nextMeeting: currentEditingTeamInfo.nextMeeting, // 保持会议时间不变
        leader: currentEditingTeamInfo.leader, // 保持队长不变
        leaderAvatar: currentEditingTeamInfo.leaderAvatar, // 保持队长头像不变
        isUrgent: currentEditingTeamInfo.isUrgent, // 保持急招状态不变
        needs: editTeam.positions.map(p => ({
          role: p.role,
          count: parseInt(p.count),
          skills: p.skills ? p.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
          filled: p.filled || 0 // 保持已填充人数不变
        })),
        tasks: currentEditingTeamInfo.tasks // 保持任务不变
      };
      
      // 更新availableTeams列表
      const updatedAvailableTeams = availableTeams.map(team => {
        if (team.id === editTeam.id) {
          return updatedTeamObj;
        }
        return team;
      });
      
      // 更新myCreatedTeams列表
      const updatedMyCreatedTeams = myCreatedTeams.map(team => {
        if (team.id === editTeam.id) {
          return updatedTeamObj;
        }
        return team;
      });
      
      setAvailableTeams(updatedAvailableTeams);
      setMyCreatedTeams(updatedMyCreatedTeams);
      setIsEditTeamDialogOpen(false);
      
      alert('团队信息更新成功！');
    } catch (error) {
      console.error('更新团队信息失败:', error);
      alert('更新团队信息失败，请重试');
    }
  };

  // 更新任务状态
  const updateTaskStatus = (index: number, status: string) => {
    if (!currentEditingTeam) return;
    
    // 更新当前编辑团队的任务状态
    const updatedTasks = [...currentEditingTeam.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      status
    };
    
    const updatedCurrentTeam = {
      ...currentEditingTeam,
      tasks: updatedTasks
    };
    
    // 更新当前编辑的团队对象，确保对话框内实时更新
    setCurrentEditingTeam(updatedCurrentTeam);
    
    // 更新myTeamsList中的任务状态
    const updatedMyTeamsList = myTeamsList.map(team => {
      if (team.id === currentEditingTeam.id) {
        return updatedCurrentTeam;
      }
      return team;
    });
    
    setMyTeamsList(updatedMyTeamsList);
    
    // 如果是"我的创建"中的团队，同时更新myCreatedTeams中的任务状态
    if (currentEditingTeamInfo && currentEditingTeam.id === currentEditingTeamInfo.id) {
      const updatedMyCreatedTeams = myCreatedTeams.map(team => {
        if (team.id === currentEditingTeamInfo.id) {
          // 更新当前编辑的团队信息对象，确保界面实时更新
          setCurrentEditingTeamInfo(updatedCurrentTeam);
          return updatedCurrentTeam;
        }
        return team;
      });
      
      setMyCreatedTeams(updatedMyCreatedTeams);
    }
  };

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

  // 获取团队类别对应的值
  const getCategoryValue = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      '技术项目': 'tech',
      '学术研究': 'research',
      '学术竞赛': 'competition',
      '程序竞赛': 'programming',
      '学科竞赛': 'modeling',
      '创业项目': 'startup'
    };
    return categoryMap[category] || category;
  };

  // 获取类别标签
  const getCategoryLabel = (categoryValue: string) => {
    const categoryMap: { [key: string]: string } = {
      'tech': '技术项目',
      'research': '学术研究',
      'competition': '学术竞赛',
      'programming': '程序竞赛',
      'modeling': '学科竞赛',
      'startup': '创业项目'
    };
    return categoryMap[categoryValue] || categoryValue;
  };

  // 筛选和搜索团队数据
  const filteredTeams = availableTeams.filter(team => {
    // 类型筛选
    const typeMatch = filterBy === 'all' || team.categoryValue === filterBy;

    // 搜索筛选
    const searchMatch = !searchQuery ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      team.needs.some(need => need.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         need.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      team.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (showUrgentOnly && searchQuery.includes('#急招'));

    // 急招筛选
    const urgentMatch = !showUrgentOnly || team.isUrgent;

    return typeMatch && urgentMatch && searchMatch;
  });

  // 排序团队数据
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case 'deadline':
        result = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case 'progress':
        result = a.progress - b.progress;
        break;
      case 'members':
        // 计算每个团队需要的总人数
        const aNeedsTotal = a.needs.reduce((sum, need) => sum + need.count, 0);
        const bNeedsTotal = b.needs.reduce((sum, need) => sum + need.count, 0);
        result = aNeedsTotal - bNeedsTotal;
        break;

      default:
        return 0;
    }
    // 根据排序方向返回结果
    return sortOrder === 'asc' ? result : -result;
  });

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
                <Input 
                  placeholder="输入团队名称" 
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">项目类别</label>
                <Select value={newTeam.category} onValueChange={(value) => setNewTeam({...newTeam, category: value})}>
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
                <Textarea 
                  placeholder="详细描述项目内容、目标和计划" 
                  rows={3} 
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">团队人数上限</label>
                <Input 
                  type="number" 
                  placeholder="如：6" 
                  value={newTeam.maxMembers}
                  onChange={(e) => setNewTeam({...newTeam, maxMembers: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">项目周期</label>
                <Input 
                  placeholder="如：4个月" 
                  value={newTeam.duration}
                  onChange={(e) => setNewTeam({...newTeam, duration: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">时间投入</label>
                <Input 
                  placeholder="如：每周10-15小时" 
                  value={newTeam.workload}
                  onChange={(e) => setNewTeam({...newTeam, workload: e.target.value})}
                />
              </div>
              
              {/* 急需职位模块 */}
              <div>
                <label className="text-sm font-medium">急需职位</label>
                <div className="space-y-2">
                  {/* 已添加的职位列表 */}
                  {newTeam.positions.map((position, index) => (
                    <div key={index} className="flex flex-col space-y-2 p-2 border rounded-md bg-gray-50">
                      {/* 职位信息行 */}
                      <div className="flex items-center w-full">
                        <div className="flex-1 flex flex-col justify-start items-start pl-4">
                          <div className="font-medium">{position.role}</div>
                          {position.skills && (
                            <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                              {position.skills.split(',').map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex justify-center items-center">
                          <span className="text-sm text-gray-500">需要：{position.count}人</span>
                        </div>
                        <div className="flex-1 flex justify-center items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              if (editingPositionIndex === index) {
                                // 取消修改
                                setEditingPositionIndex(null);
                              } else {
                                // 开始修改
                                setEditingPositionIndex(index);
                                setEditExistingPosition({
                                  count: position.count.toString(),
                                  skills: position.skills
                                });
                              }
                            }}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            {editingPositionIndex === index ? '取消' : '修改'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const newPositions = [...newTeam.positions];
                              newPositions.splice(index, 1);
                              setNewTeam({...newTeam, positions: newPositions});
                              if (editingPositionIndex === index) {
                                setEditingPositionIndex(null);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                      
                      {/* 修改表单行 */}
                      {editingPositionIndex === index && (
                        <div className="flex items-end space-x-2 mt-2 pt-2 border-t border-gray-200">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-500">需要人数</label>
                              <Input 
                                type="number"
                                min="1"
                                value={editExistingPosition.count}
                                onChange={(e) => setEditExistingPosition({...editExistingPosition, count: e.target.value})}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">职位技能</label>
                              <Input 
                                value={editExistingPosition.skills}
                                onChange={(e) => setEditExistingPosition({...editExistingPosition, skills: e.target.value})}
                                className="h-8"
                                placeholder="如：统计学, JavaScript"
                              />
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              const count = parseInt(editExistingPosition.count) || 0;
                              
                              if (count <= 0) {
                                alert('需要人数必须大于0');
                                return;
                              }
                              
                              // 更新职位信息
                              const newPositions = [...newTeam.positions];
                              newPositions[index] = {
                                ...newPositions[index],
                                count,
                                skills: editExistingPosition.skills
                              };
                              
                              setNewTeam({...newTeam, positions: newPositions});
                              setEditingPositionIndex(null);
                            }}
                          >
                            保存
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 添加新职位的输入框 */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Input
                        placeholder="职位名称"
                        value={positionInput.role}
                        onChange={(e) => setPositionInput({...positionInput, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="需要人数"
                        type="number"
                        min="1"
                        value={positionInput.count}
                        onChange={(e) => setPositionInput({...positionInput, count: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Input
                      placeholder="职位需要技能     如：统计学, JavaScript, 算法优化 (用逗号分隔)"
                      value={positionInput.skills}
                      onChange={(e) => setPositionInput({...positionInput, skills: e.target.value})}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (positionInput.role && positionInput.count) {
                        setNewTeam({
                          ...newTeam,
                          positions: [
                            ...newTeam.positions,
                            {
                              role: positionInput.role,
                              count: parseInt(positionInput.count),
                              skills: positionInput.skills
                            }
                          ]
                        });
                        setPositionInput({ role: '', count: '', skills: '' });
                      }
                    }}
                    className="mt-2"
                  >
                    添加职位
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">工作方式</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={newTeam.workMode} onValueChange={(value) => setNewTeam({...newTeam, workMode: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">线上</SelectItem>
                        <SelectItem value="offline">线下</SelectItem>
                        <SelectItem value="hybrid">线上+线下</SelectItem>
                        <SelectItem value="custom">具体地点(自行填入)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTeam.workMode === 'custom' && (
                    <div className="flex-1">
                      <Input
                        placeholder="请输入具体工作地点"
                        value={newTeam.customLocation}
                        onChange={(e) => setNewTeam({...newTeam, customLocation: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">需要技能</label>
                <Input 
                  placeholder="如：React, Python, UI设计 (用逗号分隔)" 
                  value={newTeam.skills}
                  onChange={(e) => setNewTeam({...newTeam, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">招募截止时间</label>
                <Input 
                  type="date" 
                  value={newTeam.deadline}
                  onChange={(e) => setNewTeam({...newTeam, deadline: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => {
                  // 表单验证
                  if (!newTeam.name.trim()) {
                    alert('请输入团队名称');
                    return;
                  }
                  if (!newTeam.category) {
                    alert('请选择项目类别');
                    return;
                  }
                  if (!newTeam.description.trim()) {
                    alert('请输入项目描述');
                    return;
                  }
                  if (!newTeam.maxMembers) {
                    alert('请输入团队人数上限');
                    return;
                  }
                  if (!newTeam.duration) {
                    alert('请输入项目周期');
                    return;
                  }
                  if (!newTeam.workload) {
                    alert('请输入时间投入');
                    return;
                  }
                  if (!newTeam.workMode) {
                    alert('请选择工作方式');
                    return;
                  }
                  if (newTeam.workMode === 'custom' && !newTeam.customLocation.trim()) {
                    alert('请输入具体工作地点');
                    return;
                  }
                  if (!newTeam.deadline) {
                    alert('请选择招募截止时间');
                    return;
                  }

                  try {
                    // 生成新的团队ID
                    const newId = availableTeams.length > 0 ? Math.max(...availableTeams.map(t => t.id)) + 1 : 1;
                    
                    // 处理技能字符串
                    const skillsArray = newTeam.skills 
                      ? newTeam.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
                      : [];
                    
                    // 创建新的团队对象
                    const newTeamObj = {
                      id: newId,
                      name: newTeam.name,
                      description: newTeam.description,
                      category: getCategoryLabel(newTeam.category),
                      categoryValue: newTeam.category,
                      currentMembers: 1, // 创建者作为第一个成员
                      maxMembers: parseInt(newTeam.maxMembers),
                      duration: newTeam.duration,
                      commitment: newTeam.workload,
                      workMode: newTeam.workMode,
                      location: newTeam.workMode === 'custom' ? newTeam.customLocation : 
                               newTeam.workMode === 'online' ? '线上' : 
                               newTeam.workMode === 'offline' ? '线下' : '线上+线下',
                      customLocation: newTeam.customLocation,
                      skills: skillsArray,
                      deadline: newTeam.deadline,
                      positions: newTeam.positions,
                      createdAt: new Date().toISOString().split('T')[0],
                      progress: 0,
                      stage: "筹备中",
                      nextMeeting: "待定",
                      leader: "当前用户",
                      leaderAvatar: "当",
                      isUrgent: false,
                      needs: newTeam.positions.map(p => ({
                        role: p.role,
                        count: p.count,
                        skills: p.skills ? p.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
                        filled: 0
                      })),
                      tasks: [
                        { name: "制定项目计划", status: "pending" },
                        { name: "招募团队成员", status: "pending" }
                      ]
                    };
                    
                    // 更新可用团队列表
                    setAvailableTeams([...availableTeams, newTeamObj]);
                    
                    // 更新我的创建列表
                    setMyCreatedTeams([...myCreatedTeams, newTeamObj]);
                    
                    // 重置表单
                    setNewTeam({
                      name: '',
                      description: '',
                      category: '',
                      maxMembers: '',
                      duration: '',
                      workload: '',
                      workMode: '',
                      customLocation: '',
                      skills: '',
                      deadline: '',
                      positions: []
                    });
                    
                    setPositionInput({ role: '', count: '', skills: '' });
                    setIsCreateDialogOpen(false);
                    
                    alert('团队创建成功！');
                  } catch (error) {
                    console.error('创建团队失败:', error);
                    alert('创建团队失败，请重试');
                  }
                }}>
                  创建团队
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索栏和急招标签容器 */}
      <div className="mb-1">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索团队、竞赛项目、技能要求、职位..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 急招标签 */}
        <div className="mt-1 flex">
          <Badge
            variant={showUrgentOnly ? "default" : "outline"}
            className={`cursor-pointer ${showUrgentOnly ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-100'}`}
            onClick={() => {
              setShowUrgentOnly(!showUrgentOnly);
              if (!showUrgentOnly) {
                setSearchQuery(searchQuery ? `${searchQuery} #急招` : '#急招');
              } else {
                setSearchQuery(searchQuery.replace(' #急招', '').replace('#急招', ''));
              }
            }}
          >
            <div className="flex items-center justify-between mr-1 p-0" style={{width: '36px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${showUrgentOnly ? 'text-white' : 'text-red-500'}`}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${showUrgentOnly ? 'text-white' : 'text-red-500'}`}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${showUrgentOnly ? 'text-white' : 'text-red-500'}`}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            #急招
          </Badge>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find-team">寻找团队</TabsTrigger>
          <TabsTrigger value="my-teams">我的申请</TabsTrigger>
          <TabsTrigger value="my-created-teams">我的创建</TabsTrigger>
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

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                // 切换到招募截止或项目进度时默认降序排列
                if ((value === 'deadline' || value === 'progress') && sortBy !== value) {
                  setSortOrder('desc');
                }
              }}>
              <SelectTrigger className="w-36">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">招募截止</SelectItem>
                <SelectItem value="progress">项目进度</SelectItem>
                <SelectItem value="members">招募人数</SelectItem>
              </SelectContent>
            </Select>

            {/* 排序方向按钮 */}
            {(sortBy === 'deadline' || sortBy === 'progress' || sortBy === 'members') && (
              <div className="flex flex-col border rounded-md bg-background h-9 w-[3.125rem]">
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 flex items-center justify-center hover:bg-gray-100 rounded-t-md transition-colors ${
                    sortOrder === 'desc' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
                  }`}
                  title="降序排列"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 flex items-center justify-center hover:bg-gray-100 rounded-b-md transition-colors ${
                    sortOrder === 'asc' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
                  }`}
                  title="升序排列"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              )}
            </div>

            {(filterBy !== 'all' || searchQuery || sortBy !== 'deadline') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterBy('all');
                  setSearchQuery('');
                  setSortBy('deadline');
                  setSortOrder('desc');
                  setShowUrgentOnly(false);
                }}
              >
                清空筛选
              </Button>
            )}
          </div>

          {/* 筛选结果提示 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filterBy === 'all' ? '显示全部类型' : `筛选类型：${getCategoryLabel(filterBy)}`}
              {searchQuery && ` | 搜索："${searchQuery}"`}
              {sortBy === 'deadline' && ` | 按招募截止时间${sortOrder === 'asc' ? '升序' : '降序'}排序`}
              {sortBy === 'progress' && ` | 按项目进度${sortOrder === 'asc' ? '升序' : '降序'}排序`}
              {sortBy === 'members' && ` | 按招募人数${sortOrder === 'asc' ? '升序' : '降序'}排序`}
            </span>
            <span>共找到 {sortedTeams.length} 个结果</span>
          </div>

          <div className="grid gap-4">
            {sortedTeams.length === 0 ? null : (
              sortedTeams.map((team) => (
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
                    <Button 
                      onClick={() => handleJoinTeam(team)}
                      disabled={isTeamJoined(team.id) || myCreatedTeams.some(t => t.id === team.id)}
                      variant={isTeamJoined(team.id) ? "secondary" : myCreatedTeams.some(t => t.id === team.id) ? "outline" : "default"}
                    >
                      {isTeamJoined(team.id) ? "已加入" : myCreatedTeams.some(t => t.id === team.id) ? "已创建" : "申请加入"}
                    </Button>
                  </div>

                  <p className="text-sm mb-4">{team.description}</p>

                  {/* 项目进度 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">项目进度：{team.stage}</span>
                      <span className="text-sm text-muted-foreground">{calculateProgress(team.tasks)}%</span>
                    </div>
                    <Progress value={calculateProgress(team.tasks)} className="h-2" />
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
              ))
            )}
          </div>
        </TabsContent>

        {/* 我的团队 */}
        <TabsContent value="my-teams" className="space-y-4">
          <div className="grid gap-6">
            {myTeamsList.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      我的角色：{team.role} • {team.members} 人团队
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 项目进度 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">整体进度</span>
                      <span className="text-sm text-muted-foreground">{calculateProgress(team.tasks)}%</span>
                    </div>
                    <Progress value={calculateProgress(team.tasks)} className="h-2" />
                  </div>

                  {/* 只对非新加入的团队显示下次会议和任务进度 */}
                  {!team.isNewTeam && (
                    <>
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
                    </>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openTaskEditDialog(team)}>
                      编辑任务
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

        {/* 我的创建 */}
        <TabsContent value="my-created-teams" className="space-y-4">
          <div className="grid gap-6">
            {myCreatedTeams.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground p-8">
                <div className="mb-6">
                  <Briefcase className="h-12 w-12 mx-auto opacity-50" />
                </div>
                <h3 className="mb-3">您还没有创建任何组队信息</h3>
                <p className="text-sm">点击"创建团队"按钮创建您的第一个团队</p>
              </div>
            ) : (
              myCreatedTeams.map((team) => (
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
                    </div>

                    <p className="text-sm mb-4">{team.description}</p>

                    {/* 项目进度 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">项目进度：{team.stage}</span>
                        <span className="text-sm text-muted-foreground">{calculateProgress(team.tasks)}%</span>
                      </div>
                      <Progress value={calculateProgress(team.tasks)} className="h-2" />
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

                    {/* 我的任务进度 */}
                    <div className="mt-4">
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

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => openEditTeamDialog(team)}>
                        编辑团队信息
                      </Button>
                      <Button size="sm" onClick={() => openTaskEditDialog(team)}>
                        编辑任务
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 编辑团队信息对话框 */}
      <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑团队信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">团队名称</label>
              <Input 
                placeholder="输入团队名称" 
                value={editTeam.name}
                onChange={(e) => setEditTeam({...editTeam, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">项目类别</label>
              <Select value={editTeam.category} onValueChange={(value) => setEditTeam({...editTeam, category: value})}>
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
              <Textarea 
                placeholder="详细描述项目内容、目标和计划" 
                rows={3} 
                value={editTeam.description}
                onChange={(e) => setEditTeam({...editTeam, description: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">团队人数上限</label>
              <Input 
                type="number" 
                placeholder="如：6" 
                value={editTeam.maxMembers}
                onChange={(e) => setEditTeam({...editTeam, maxMembers: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">项目周期</label>
              <Input 
                placeholder="如：4个月" 
                value={editTeam.duration}
                onChange={(e) => setEditTeam({...editTeam, duration: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">时间投入</label>
              <Input 
                placeholder="如：每周10-15小时" 
                value={editTeam.workload}
                onChange={(e) => setEditTeam({...editTeam, workload: e.target.value})}
              />
            </div>
            
            {/* 急需职位模块 */}
            <div>
              <label className="text-sm font-medium">急需职位</label>
              <div className="space-y-2">
                {/* 已添加的职位列表 */}
                {editTeam.positions.map((position, index) => (
                  <div key={index} className="flex flex-col space-y-2 p-2 border rounded-md bg-gray-50">
                    {/* 职位信息行 */}
                    <div className="flex items-center w-full">
                      <div className="flex-1 flex flex-col justify-start items-start pl-4">
                        <div className="font-medium">{position.role}</div>
                        {position.skills && (
                          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                            {position.skills.split(',').map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex justify-center items-center">
                        <span className="text-sm text-gray-500">需要：{position.count}人</span>
                      </div>
                      <div className="flex-1 flex justify-center items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            if (editingPositionIndex === index) {
                              // 取消修改
                              setEditingPositionIndex(null);
                            } else {
                              // 开始修改
                              setEditingPositionIndex(index);
                              setEditExistingPosition({
                                count: position.count,
                                skills: position.skills
                              });
                            }
                          }}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          {editingPositionIndex === index ? '取消' : '修改'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            const newPositions = [...editTeam.positions];
                            newPositions.splice(index, 1);
                            setEditTeam({...editTeam, positions: newPositions});
                            if (editingPositionIndex === index) {
                              setEditingPositionIndex(null);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                    
                    {/* 修改表单行 */}
                    {editingPositionIndex === index && (
                      <div className="flex items-end space-x-2 mt-2 pt-2 border-t border-gray-200">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">需要人数</label>
                            <Input 
                              type="number"
                              min="1"
                              value={editExistingPosition.count}
                              onChange={(e) => setEditExistingPosition({...editExistingPosition, count: e.target.value})}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">职位技能</label>
                            <Input 
                              value={editExistingPosition.skills}
                              onChange={(e) => setEditExistingPosition({...editExistingPosition, skills: e.target.value})}
                              className="h-8"
                              placeholder="如：统计学, JavaScript"
                            />
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            const count = parseInt(editExistingPosition.count) || 0;
                            
                            if (count <= 0) {
                              alert('需要人数必须大于0');
                              return;
                            }
                            
                            // 更新职位信息
                            const newPositions = [...editTeam.positions];
                            newPositions[index] = {
                              ...newPositions[index],
                              count,
                              skills: editExistingPosition.skills
                            };
                            
                            setEditTeam({...editTeam, positions: newPositions});
                            setEditingPositionIndex(null);
                          }}
                        >
                          保存
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* 添加新职位的输入框 */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Input
                      placeholder="职位名称"
                      value={positionInput.role}
                      onChange={(e) => setPositionInput({...positionInput, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="需要人数"
                      type="number"
                      min="1"
                      value={positionInput.count}
                      onChange={(e) => setPositionInput({...positionInput, count: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="职位需要技能     如：统计学, JavaScript, 算法优化 (用逗号分隔)"
                    value={positionInput.skills}
                    onChange={(e) => setPositionInput({...positionInput, skills: e.target.value})}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (positionInput.role && positionInput.count) {
                      setEditTeam({
                        ...editTeam,
                        positions: [
                          ...editTeam.positions,
                          {
                            role: positionInput.role,
                            count: parseInt(positionInput.count),
                            skills: positionInput.skills
                          }
                        ]
                      });
                      setPositionInput({ role: '', count: '', skills: '' });
                    }
                  }}
                  className="mt-2"
                >
                  添加职位
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">工作方式</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select value={editTeam.workMode} onValueChange={(value) => setEditTeam({...editTeam, workMode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">线上</SelectItem>
                      <SelectItem value="offline">线下</SelectItem>
                      <SelectItem value="hybrid">线上+线下</SelectItem>
                      <SelectItem value="custom">具体地点(自行填入)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editTeam.workMode === 'custom' && (
                  <div className="flex-1">
                    <Input
                      placeholder="请输入具体工作地点"
                      value={editTeam.customLocation}
                      onChange={(e) => setEditTeam({...editTeam, customLocation: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">需要技能</label>
              <Input 
                placeholder="如：React, Python, UI设计 (用逗号分隔)" 
                value={editTeam.skills}
                onChange={(e) => setEditTeam({...editTeam, skills: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">招募截止时间</label>
              <Input 
                type="date" 
                value={editTeam.deadline}
                onChange={(e) => setEditTeam({...editTeam, deadline: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditTeamDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={saveEditedTeamInfo}>
                保存修改
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 任务编辑对话框 */}
      <Dialog open={isTaskEditDialogOpen} onOpenChange={setIsTaskEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑任务清单 - {currentEditingTeam?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 添加新任务区域 */}
            <div className="flex gap-2">
              <Input
                placeholder="输入新任务名称"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button onClick={handleAddTask} disabled={!newTaskName.trim()}>
                添加
              </Button>
            </div>
            
            {/* 任务列表 */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {currentEditingTeam?.tasks.map((task: any, index: number) => (
                <div key={index} className="border rounded-md p-3 bg-gray-50">
                  {editingTaskIndex === index ? (
                    // 编辑模式
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={editingTaskName}
                          onChange={(e) => setEditingTaskName(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={saveEditedTask} disabled={!editingTaskName.trim()}>
                          保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditingTask}>
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // 查看模式
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className={`${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.name}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingTask(index, task.name)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      
                      {/* 任务状态选择 */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">状态:</span>
                        <Select
                          value={task.status}
                          onValueChange={(value) => updateTaskStatus(index, value)}
                        >
                          <SelectTrigger className="w-32 h-7 text-xs">
                            <div className="flex items-center gap-2">
                              {task.status === 'completed' ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : task.status === 'in-progress' ? (
                                <AlertCircle className="h-3 w-3 text-yellow-500" />
                              ) : (
                                <Clock className="h-3 w-3 text-gray-400" />
                              )}
                              <span>
                                {task.status === 'completed' ? '已完成' : 
                                 task.status === 'in-progress' ? '进行中' : '待开始'}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span>待开始</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="in-progress">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-yellow-500" />
                                <span>进行中</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="completed">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>已完成</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {currentEditingTeam?.tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无任务，请添加新任务</p>
                </div>
              )}
            </div>
            

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
