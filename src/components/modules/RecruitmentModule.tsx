import { useState, useEffect } from 'react';
import recruitmentData from '../../data/recruitmentData.json';
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
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export function RecruitmentModule() {
  const [activeTab, setActiveTab] = useState('clubs');
  const [myRecruitments, setMyRecruitments] = useState<any[]>([]); // 我的发布记录
  const [editingRecruitment, setEditingRecruitment] = useState<any>(null); // 正在编辑的招募信息
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // 编辑对话框是否打开
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 默认降序
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedRecruitmentIds, setAppliedRecruitmentIds] = useState<number[]>([]); // 记录已申请的社团ID
  const [recruitments, setRecruitments] = useState<any[]>([]); // 招募信息列表
  const [myApplications, setMyApplications] = useState<any[]>([]); // 我的申请记录
  const [loading, setLoading] = useState(true); // 加载状态
  const [showUrgentOnly, setShowUrgentOnly] = useState(false); // 是否只显示急招社团
  
  // 新增表单状态
  const [newRecruitment, setNewRecruitment] = useState({
    title: '',
    description: '',
    organizer: '当前用户',
    organizerAvatar: '用',
    type: '',
    typeValue: '',
    skillString: '',
    benefitString: '',
    positions: [],
    workload: '',
    deadline: '',
    isUrgent: false
  });
  
  // 职位输入状态
  const [positionInput, setPositionInput] = useState({
    role: '',
    count: '',
    filled: ''
  });
  
  // 职位修改状态
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [editExistingPosition, setEditExistingPosition] = useState({
    count: '',
    filled: ''
  });
  
  // 编辑对话框中的职位输入状态
  const [editPositionInput, setEditPositionInput] = useState({
    role: '',
    count: '',
    filled: ''
  });
  
  // 编辑对话框中正在修改的职位索引
  // 使用上面已定义的 editingPositionIndex
  
  // 编辑对话框中的职位修改输入状态
  const [editExistingPositionForDialog, setEditExistingPositionForDialog] = useState({
    count: '',
    filled: ''
  });

  // 初始化加载数据
  useEffect(() => {
      try {
        setLoading(true);
        // 设置招募信息
        const savedRecruitments = localStorage.getItem('recruitments');
        if (savedRecruitments) {
          setRecruitments(JSON.parse(savedRecruitments));
        } else {
          setRecruitments(recruitmentData.recruitments);
        }
        
        // 设置用户申请记录
        const savedMyApplications = localStorage.getItem('myApplications');
        if (savedMyApplications) {
          setMyApplications(JSON.parse(savedMyApplications));
        } else {
          setMyApplications(recruitmentData.applications);
        }
        
        // 设置已申请的招募ID列表
        const savedAppliedRecruitmentIds = localStorage.getItem('appliedRecruitmentIds');
        if (savedAppliedRecruitmentIds) {
          setAppliedRecruitmentIds(JSON.parse(savedAppliedRecruitmentIds));
        } else {
          // 从用户数据中获取已申请的招募ID
          const user = recruitmentData.users.find((u: any) => u.id === 1);
          setAppliedRecruitmentIds(user ? user.appliedRecruitmentIds : []);
        }
        
        // 设置用户发布的招募信息
        const savedMyRecruitments = localStorage.getItem('myRecruitments');
        if (savedMyRecruitments) {
          setMyRecruitments(JSON.parse(savedMyRecruitments));
        } else {
          // 初始设置为空数组，用户创建后会添加
          setMyRecruitments([]);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    
  }, []);

  // 数据保存到localStorage
  useEffect(() => {
    localStorage.setItem('recruitments', JSON.stringify(recruitments));
    localStorage.setItem('myApplications', JSON.stringify(myApplications));
    localStorage.setItem('appliedRecruitmentIds', JSON.stringify(appliedRecruitmentIds));
    localStorage.setItem('myRecruitments', JSON.stringify(myRecruitments));
  }, [recruitments, myApplications, appliedRecruitmentIds, myRecruitments]);

  // 监听滚动事件，实现滚动到指定元素
  useEffect(() => {
    // 处理滚动到指定元素的函数
    const scrollToElement = () => {
      // 首先尝试从URL哈希中获取元素ID
      let elementId = window.location.hash.substring(1);

      // 如果URL哈希中没有，尝试从localStorage中获取
      if (!elementId) {
        try {
          elementId = localStorage.getItem('targetElementId') || '';
        } catch (error) {
          console.error('Failed to get target element ID from localStorage:', error);
        }
      }

      if (elementId) {
        // 延迟执行滚动，确保组件已完全渲染
        setTimeout(() => {
          const targetElement = document.getElementById(elementId);
          if (targetElement) {
            // 使用平滑滚动效果
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 添加高亮效果
            targetElement.classList.add('highlighted');
            setTimeout(() => {
              targetElement.classList.remove('highlighted');
            }, 2000);

            // 清除localStorage中的目标ID
            try {
              localStorage.removeItem('targetElementId');
            } catch (error) {
              console.error('Failed to clear target element ID from localStorage:', error);
            }
          } else {
            console.warn(`Element with ID ${elementId} not found`);
          }
        }, 300);
      }
    };

    // 监听自定义滚动事件
    const handleScrollEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.elementId) {
        // 设置目标元素ID并触发滚动
        try {
          localStorage.setItem('targetElementId', customEvent.detail.elementId);
          scrollToElement();
        } catch (error) {
          console.error('Failed to set target element ID in localStorage:', error);
        }
      }
    };

    // 添加事件监听器
    window.addEventListener('scrollToElement', handleScrollEvent as EventListener);

    // 组件加载时尝试滚动到目标元素
    // 只在URL中有哈希值或localStorage中有目标ID时才滚动
    const hasHash = window.location.hash && window.location.hash.length > 1;
    let hasTargetId = false;
    let oneTimeScroll = false;
    try {
      hasTargetId = !!localStorage.getItem('targetElementId');
      oneTimeScroll = localStorage.getItem('oneTimeScroll') === 'true';
    } catch (error) {
      console.error('Failed to check target element ID or oneTimeScroll in localStorage:', error);
    }

    if (hasHash || hasTargetId) {
      scrollToElement();

      // 如果是一次性滚动，使用后清除标记
      if (oneTimeScroll) {
        try {
          localStorage.removeItem('oneTimeScroll');

          // 清除URL哈希值，防止下次进入时再次滚动
          const currentUrl = new URL(window.location.href);
          currentUrl.hash = '';
          window.history.replaceState({}, '', currentUrl);
        } catch (error) {
          console.error('Failed to clear oneTimeScroll or URL hash:', error);
        }
      }
    }

    // 清理函数
    return () => {
      window.removeEventListener('scrollToElement', handleScrollEvent as EventListener);
    };
  }, []); // 空依赖数组，确保只在组件挂载和卸载时执行

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待审核': return 'bg-yellow-100 text-yellow-800';
      case '已通过': return 'bg-green-100 text-green-800';
      case '已拒绝': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 筛选和搜索社团数据
  const filteredRecruitments = recruitments.filter(recruitment => {
    // 类型筛选
    const typeMatch = filterBy === 'all' || recruitment.typeValue === filterBy;
    
    // 搜索筛选
    const searchMatch = !searchQuery || 
      recruitment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruitment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruitment.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recruitment.positions.some(pos => pos.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recruitment.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (showUrgentOnly && searchQuery.includes('#急招'));
    
    // 急招筛选
    const urgentMatch = !showUrgentOnly || recruitment.isUrgent;

    return typeMatch && urgentMatch && searchMatch;
  });

  // 排序社团数据
  const sortedRecruitments = [...filteredRecruitments].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case 'deadline':
        result = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case 'applications':
        result = a.applications - b.applications;
        break;
      case 'urgent':
        result = a.isUrgent === b.isUrgent ? 0 : a.isUrgent ? 1 : -1;
        break;
      case 'created':
        result = a.id - b.id; // 假设id越大越新
        break;
      default:
        return 0;
    }
    // 根据排序方向调整结果
    return sortOrder === 'desc' ? -result : result;
  });

  const getTypeLabel = (typeValue: string) => {
    const typeMap: { [key: string]: string } = {
      'academic': '学术社团',
      'student': '学生组织',
      'tech': '技术社团',
      'startup': '创业社团',
      'arts': '文艺社团',
      'sports': '体育社团'
    };
    return typeMap[typeValue] || typeValue;
  };

  // 处理编辑招募
  const handleEdit = (recruitment: any) => {
    // 设置编辑的招募信息
    setEditingRecruitment({
      ...recruitment,
      skillString: recruitment.skills.join(', '),
      benefitString: recruitment.benefits.join(', ')
    });
    setIsEditDialogOpen(true);
  };
  
  // 处理删除招募
  const handleDelete = (recruitmentId: number) => {
    // 弹出确认对话框
    if (window.confirm('确定要删除这条招募信息吗？此操作不可撤销。')) {
      try {
        // 从招募列表中删除
        const updatedRecruitments = recruitments.filter(r => r.id !== recruitmentId);
        setRecruitments(updatedRecruitments);

        // 从我的发布列表中删除
        const updatedMyRecruitments = myRecruitments.filter(r => r.id !== recruitmentId);
        setMyRecruitments(updatedMyRecruitments);
        

        

        
        alert('招募信息已成功删除');
      } catch (error) {
        console.error('删除招募失败:', error);
        alert('删除招募失败，请重试');
      }
    }
  };
  
  // 处理申请加入
  const handleApply = (recruitmentId: number) => {
    if (appliedRecruitmentIds.includes(recruitmentId)) {
      return; // 已经申请过了
    }
    
    try {
      // 获取招募信息，用于确定申请的职位
      const recruitment = recruitments.find(r => r.id === recruitmentId);
      if (!recruitment || !recruitment.positions || recruitment.positions.length === 0) {
        return;
      }
      
      // 选择第一个未满的职位
      const position = recruitment.positions.find(p => p.filled < p.count) || recruitment.positions[0];
      
      // 创建新的申请记录
      const newApplication = {
        id: myApplications.length > 0 ? Math.max(...myApplications.map(a => a.id)) + 1 : 1,
        recruitmentId,
        title: recruitment.title,
        position: position.role,
        status: "待审核",
        appliedDate: new Date().toISOString().split('T')[0],
        organizer: recruitment.organizer,
        message: "我对该职位感兴趣，希望能加入贵组织。"
      };
      
      // 更新本地状态
      setAppliedRecruitmentIds([...appliedRecruitmentIds, recruitmentId]);
      setMyApplications([...myApplications, newApplication]);
      
      // 更新招募信息（增加申请人数和职位填充数）
      const updatedRecruitments = recruitments.map(r => {
        if (r.id === recruitmentId) {
          // 增加申请人数
          const updatedRecruitment = { ...r, applications: r.applications + 1 };
          
          // 更新职位填充数
          const updatedPositions = r.positions.map(p => {
            if (p.role === position.role && p.filled < p.count) {
              return { ...p, filled: p.filled + 1 };
            }
            return p;
          });
          
          return { ...updatedRecruitment, positions: updatedPositions };
        }
        return r;
      });
      
      setRecruitments(updatedRecruitments);
    } catch (error) {
      console.error('申请失败:', error);
      alert(error instanceof Error ? error.message : '申请失败，请重试');
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
                  <Input 
                    placeholder="输入社团名称" 
                    value={newRecruitment.title}
                    onChange={(e) => setNewRecruitment({...newRecruitment, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">类型</label>
                  <Select value={newRecruitment.typeValue} onValueChange={(value) => {
                    const typeMap: { [key: string]: string } = {
                      'academic': '学术社团',
                      'student': '学生组织',
                      'tech': '技术社团',
                      'startup': '创业社团',
                      'arts': '文艺社团',
                      'sports': '体育社团'
                    };
                    setNewRecruitment({
                      ...newRecruitment, 
                      typeValue: value,
                      type: typeMap[value] || value
                    });
                  }}>
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
                <Textarea 
                  placeholder="详细描述社团性质、活动内容和目标" 
                  rows={3} 
                  value={newRecruitment.description}
                  onChange={(e) => setNewRecruitment({...newRecruitment, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">招募职位</label>
                <div className="space-y-2">
                  {/* 已添加的职位列表 */}
                  {newRecruitment.positions.map((position, index) => (
                    <div key={index} className="flex flex-col space-y-2 p-2 border rounded-md bg-gray-50">
                      {/* 职位信息行 */}
                      <div className="flex items-center w-full">
                        <div className="flex-1 flex justify-start items-center pl-4">
                          <div className="font-medium">{position.role}</div>
                        </div>
                        <div className="flex-1 flex justify-center items-center">
                          <span className="text-sm text-gray-500">需要：{position.count}人 已招：{position.filled}人</span>
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
                                  filled: position.filled.toString()
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
                              const newPositions = [...newRecruitment.positions];
                              newPositions.splice(index, 1);
                              setNewRecruitment({...newRecruitment, positions: newPositions});
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
                              <label className="text-xs text-gray-500">已招人数</label>
                              <Input 
                                type="number"
                                min="0"
                                value={editExistingPosition.filled}
                                onChange={(e) => setEditExistingPosition({...editExistingPosition, filled: e.target.value})}
                                className="h-8"
                              />
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              const count = parseInt(editExistingPosition.count) || 0;
                              const filled = parseInt(editExistingPosition.filled) || 0;
                              
                              if (count <= 0) {
                                alert('需要人数必须大于0');
                                return;
                              }
                              
                              if (filled < 0) {
                                alert('已招人数不能为负数');
                                return;
                              }
                              
                              if (filled > count) {
                                alert('已招人数不能大于需要人数');
                                return;
                              }
                              
                              // 更新职位信息
                              const newPositions = [...newRecruitment.positions];
                              newPositions[index] = {
                                ...newPositions[index],
                                count,
                                filled
                              };
                              
                              setNewRecruitment({...newRecruitment, positions: newPositions});
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
                  <div className="grid grid-cols-3 gap-2 mt-2">
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
                    <div>
                      <Input 
                        placeholder="已招人数" 
                        type="number"
                        min="0"
                        value={positionInput.filled}
                        onChange={(e) => setPositionInput({...positionInput, filled: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (positionInput.role.trim() && positionInput.count) {
                        const count = parseInt(positionInput.count) || 0;
                        const filled = parseInt(positionInput.filled) || 0;
                        
                        if (count <= 0) {
                          alert('需要人数必须大于0');
                          return;
                        }
                        
                        if (filled < 0) {
                          alert('已招人数不能为负数');
                          return;
                        }
                        
                        if (filled > count) {
                          alert('已招人数不能大于需要人数');
                          return;
                        }
                        
                        setNewRecruitment({
                          ...newRecruitment, 
                          positions: [
                            ...newRecruitment.positions, 
                            {
                              role: positionInput.role.trim(),
                              count,
                              filled
                            }
                          ]
                        });
                        
                        setPositionInput({ role: '', count: '', filled: '' });
                      } else {
                        alert('请填写职位名称和需要人数');
                      }
                    }}
                    className="mt-2"
                  >
                    添加职位
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">时间投入</label>
                <Input 
                  placeholder="如：每周4-6小时" 
                  value={newRecruitment.workload}
                  onChange={(e) => setNewRecruitment({...newRecruitment, workload: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">需要技能</label>
                <Input 
                  placeholder="如：策划能力, 沟通技巧, 组织能力 (用逗号分隔)" 
                  value={newRecruitment.skillString}
                  onChange={(e) => setNewRecruitment({...newRecruitment, skillString: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">加入收益</label>
                <Input 
                  placeholder="如：技能提升, 人脉拓展, 实践机会 (用逗号分隔)" 
                  value={newRecruitment.benefitString}
                  onChange={(e) => setNewRecruitment({...newRecruitment, benefitString: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">招募截止日期</label>
                <Input 
                  type="date" 
                  value={newRecruitment.deadline}
                  onChange={(e) => setNewRecruitment({...newRecruitment, deadline: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isUrgent"
                  checked={newRecruitment.isUrgent}
                  onChange={(e) => setNewRecruitment({...newRecruitment, isUrgent: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isUrgent" className="text-sm font-medium">急招</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => {
                  // 表单验证
                  if (!newRecruitment.title.trim()) {
                    alert('请输入社团名称');
                    return;
                  }
                  if (!newRecruitment.typeValue) {
                    alert('请选择社团类型');
                    return;
                  }
                  if (!newRecruitment.description.trim()) {
                    alert('请输入社团描述');
                    return;
                  }
                  if (newRecruitment.positions.length === 0) {
                    alert('请至少添加一个招募职位');
                    return;
                  }
                  if (!newRecruitment.workload.trim()) {
                    alert('请输入时间投入');
                    return;
                  }
                  if (!newRecruitment.deadline) {
                    alert('请选择招募截止日期');
                    return;
                  }
                  
                  try {
                    // 准备表单数据
                    const formData = {
                      ...newRecruitment,
                      // 将技能字符串转换为数组
                      skills: newRecruitment.skillString
                        ? newRecruitment.skillString.split(',').map(skill => skill.trim()).filter(skill => skill)
                        : [],
                      // 将收益字符串转换为数组
                      benefits: newRecruitment.benefitString
                        ? newRecruitment.benefitString.split(',').map(benefit => benefit.trim()).filter(benefit => benefit)
                        : [],
                      // 设置初始申请人数为0
                      applications: 0
                    };
                    
                    // 生成新的招募ID
                    const newId = recruitments.length > 0 ? Math.max(...recruitments.map(r => r.id)) + 1 : 1;
                    
                    // 创建新的招募对象
                    const newRecruitmentObj = {
                      ...formData,
                      id: newId,
                      createdAt: new Date().toISOString().split('T')[0]
                    };
                    
                    // 更新招募列表
                    setRecruitments([...recruitments, newRecruitmentObj]);
                    
                    // 更新我的发布列表
                    setMyRecruitments([...myRecruitments, newRecruitmentObj]);
                    setIsCreateDialogOpen(false);
                    

                    
                    // 重置表单
                    setNewRecruitment({
                      title: '',
                      description: '',
                      organizer: '当前用户',
                      organizerAvatar: '用',
                      type: '',
                      typeValue: '',
                      skillString: '',
                      benefitString: '',
                      positions: [],
                      workload: '',
                      deadline: '',
                      isUrgent: false
                    });
                    

                    
                    alert('招募信息发布成功！');
                  } catch (error) {
                    console.error('创建招募失败:', error);
                    alert('创建招募失败，请重试');
                  }
                }}>
                  发布
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
            placeholder="搜索社团、技能要求、职位..."
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
          <TabsTrigger value="clubs">社团招募</TabsTrigger>
          <TabsTrigger value="applications">我的申请</TabsTrigger>
          <TabsTrigger value="myRecruitments">我的发布</TabsTrigger>
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
            
<div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                // 当切换到"截止时间"、"申请人数"或"发布时间"时，设置默认为降序
                if (value === 'deadline' || value === 'applications' || value === 'created') {
                  setSortOrder('desc');
                }
              }}>
                <SelectTrigger className="w-36">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">截止时间</SelectItem>
                  <SelectItem value="applications">申请人数</SelectItem>
                  <SelectItem value="created">发布时间</SelectItem>
                </SelectContent>
              </Select>
              
              {/* 当选择"截止时间"、"申请人数"或"发布时间"时显示箭头控件 */}
              {(sortBy === 'deadline' || sortBy === 'applications' || sortBy === 'created') && (
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

            {(filterBy !== 'all' || searchQuery || sortBy !== 'deadline' || showUrgentOnly) && (
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
              {filterBy === 'all' ? '显示全部社团' : `筛选类型：${getTypeLabel(filterBy)}`}
              {searchQuery && ` | 搜索："${searchQuery}"`}
              {(sortBy === 'deadline' || sortBy === 'applications') && 
                ` | 按${sortBy === 'deadline' ? '截止时间' : '申请人数'}${sortOrder === 'asc' ? '升序' : '降序'}排列`
              }
              {sortBy === 'urgent' && ` | 按紧急程度排序`}
              {sortBy === 'created' && ` | 按发布时间排序`}
            </span>
            <span>共找到 {sortedRecruitments.length} 个结果</span>
          </div>
          
          <div className="grid gap-4">
            {sortedRecruitments.length === 0 ? null : (
              sortedRecruitments.map((recruitment) => (
                <Card key={recruitment.id} id={`recruitment-${recruitment.id}`}>
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
                      {(() => {
                        // 查找该招募的申请状态
                        const application = myApplications.find(app => app.recruitmentId === recruitment.id);
                        const isApplied = appliedRecruitmentIds.includes(recruitment.id);
                        const status = application ? application.status : null;
                        // 检查是否是用户自己发布的招募
                        const isMyRecruitment = myRecruitments.some(r => r.id === recruitment.id);

                        if (isMyRecruitment) {
                          return (
                            <Button variant="outline" disabled>
                              已发布
                            </Button>
                          );
                        } else if (isApplied && status === "已通过") {
                          return (
                            <Button variant="outline" disabled>
                              已通过
                            </Button>
                          );
                        } else if (isApplied && status === "已拒绝") {
                          return (
                            <Button variant="destructive" disabled>
                              已拒绝
                            </Button>
                          );
                        } else if (isApplied) {
                          return (
                            <Button variant="secondary" disabled>
                              待审核
                            </Button>
                          );
                        } else {
                          return (
                            <Button onClick={() => handleApply(recruitment.id)}>
                              申请加入
                            </Button>
                          );
                        }
                      })()}
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
                            <div key={index} className="flex items-center gap-2 text-sm">
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
                      <span>{appliedRecruitmentIds.includes(recruitment.id) ? recruitment.applications + 1 : recruitment.applications} 人已申请</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
        
        {/* 我的发布 */}
        <TabsContent value="myRecruitments" className="space-y-4">
          <div className="grid gap-4">
            {myRecruitments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground p-8">
                <div className="mb-6">
                  <Briefcase className="h-12 w-12 mx-auto opacity-50" />
                </div>
                <h3 className="mb-3">您还没有发布任何招募信息</h3>
                <p className="text-sm">点击"发布招募"按钮创建您的第一个招募</p>
              </div>
            ) : (
              myRecruitments.map((recruitment) => (
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
                            发布者：{recruitment.organizer}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(recruitment)}
                        >
                          编辑
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(recruitment.id)}
                        >
                          删除
                        </Button>
                      </div>
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
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{recruitment.applications} 人已申请</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">招募职位：</h4>
                        <div className="space-y-1">
                          {recruitment.positions.map((pos, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
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
                      <span>发布日期：{recruitment.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 编辑招募对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑招募信息</DialogTitle>
          </DialogHeader>
          {editingRecruitment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">社团名称</label>
                  <Input 
                    value={editingRecruitment.title}
                    onChange={(e) => setEditingRecruitment({...editingRecruitment, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">类型</label>
                  <Select value={editingRecruitment.typeValue} onValueChange={(value) => {
                    const typeMap: { [key: string]: string } = {
                      'academic': '学术社团',
                      'student': '学生组织',
                      'tech': '技术社团',
                      'startup': '创业社团',
                      'arts': '文艺社团',
                      'sports': '体育社团'
                    };
                    setEditingRecruitment({
                      ...editingRecruitment, 
                      typeValue: value,
                      type: typeMap[value] || value
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue />
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
                <Textarea 
                  rows={3} 
                  value={editingRecruitment.description}
                  onChange={(e) => setEditingRecruitment({...editingRecruitment, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">招募职位</label>
                <div className="space-y-2">
                  {/* 已添加的职位列表 */}
                  {editingRecruitment.positions.map((position: any, index: number) => (
                    <div key={index} className="flex flex-col space-y-2 p-2 border rounded-md bg-gray-50">
                      {/* 职位信息行 */}
                      <div className="flex items-center w-full">
                        <div className="flex-1 flex justify-start items-center pl-4">
                          <div className="font-medium">{position.role}</div>
                        </div>
                        <div className="flex-1 flex justify-center items-center">
                          <span className="text-sm text-gray-500">需要：{position.count}人 已招：{position.filled}人</span>
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
                                  filled: position.filled.toString()
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
                              const newPositions = [...editingRecruitment.positions];
                              newPositions.splice(index, 1);
                              setEditingRecruitment({...editingRecruitment, positions: newPositions});
                              if (editingPositionIndex === index) {
                                setEditingPositionIndex(null);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-blue-50"
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
                              <label className="text-xs text-gray-500">已招人数</label>
                              <Input 
                                type="number"
                                min="0"
                                value={editExistingPosition.filled}
                                onChange={(e) => setEditExistingPosition({...editExistingPosition, filled: e.target.value})}
                                className="h-8"
                              />
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              const count = parseInt(editExistingPosition.count) || 0;
                              const filled = parseInt(editExistingPosition.filled) || 0;
                              
                              if (count <= 0) {
                                alert('需要人数必须大于0');
                                return;
                              }
                              
                              if (filled < 0) {
                                alert('已招人数不能为负数');
                                return;
                              }
                              
                              if (filled > count) {
                                alert('已招人数不能大于需要人数');
                                return;
                              }
                              
                              // 更新职位信息
                              const newPositions = [...editingRecruitment.positions];
                              newPositions[index] = {
                                ...newPositions[index],
                                count,
                                filled
                              };
                              
                              setEditingRecruitment({...editingRecruitment, positions: newPositions});
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
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <Input 
                        placeholder="职位名称" 
                        value={editPositionInput.role}
                        onChange={(e) => setEditPositionInput({...editPositionInput, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="需要人数" 
                        type="number"
                        min="1"
                        value={editPositionInput.count}
                        onChange={(e) => setEditPositionInput({...editPositionInput, count: e.target.value})}
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="已招人数" 
                        type="number"
                        min="0"
                        value={editPositionInput.filled}
                        onChange={(e) => setEditPositionInput({...editPositionInput, filled: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (editPositionInput.role.trim() && editPositionInput.count) {
                        const count = parseInt(editPositionInput.count) || 0;
                        const filled = parseInt(editPositionInput.filled) || 0;
                        
                        if (count <= 0) {
                          alert('需要人数必须大于0');
                          return;
                        }
                        
                        if (filled < 0) {
                          alert('已招人数不能为负数');
                          return;
                        }
                        
                        if (filled > count) {
                          alert('已招人数不能大于需要人数');
                          return;
                        }
                        
                        setEditingRecruitment({
                          ...editingRecruitment, 
                          positions: [
                            ...editingRecruitment.positions, 
                            {
                              role: editPositionInput.role.trim(),
                              count,
                              filled
                            }
                          ]
                        });
                        
                        setEditPositionInput({ role: '', count: '', filled: '' });
                      } else {
                        alert('请填写职位名称和需要人数');
                      }
                    }}
                    className="mt-2"
                  >
                    添加职位
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">时间投入</label>
                <Input 
                  value={editingRecruitment.workload}
                  onChange={(e) => setEditingRecruitment({...editingRecruitment, workload: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">需要技能</label>
                <Input 
                  placeholder="如：策划能力, 沟通技巧, 组织能力 (用逗号分隔)" 
                  value={editingRecruitment.skillString}
                  onChange={(e) => setEditingRecruitment({...editingRecruitment, skillString: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">加入收益</label>
                <Input 
                  placeholder="如：技能提升, 人脉拓展, 实践机会 (用逗号分隔)" 
                  value={editingRecruitment.benefitString}
                  onChange={(e) => setEditingRecruitment({...editingRecruitment, benefitString: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">招募截止日期</label>
                <Input 
                  type="date" 
                  value={editingRecruitment.deadline}
                  onChange={(e) => setEditingRecruitment({...editingRecruitment, deadline: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="editIsUrgent"
                  checked={editingRecruitment.isUrgent}
                  onChange={(e) => setEditingRecruitment({...editingRecruitment, isUrgent: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="editIsUrgent" className="text-sm font-medium">急招</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={async () => {
                  // 表单验证
                  if (!editingRecruitment.title.trim()) {
                    alert('请输入社团名称');
                    return;
                  }
                  if (!editingRecruitment.typeValue) {
                    alert('请选择社团类型');
                    return;
                  }
                  if (!editingRecruitment.description.trim()) {
                    alert('请输入社团描述');
                    return;
                  }
                  if (editingRecruitment.positions.length === 0) {
                    alert('请至少添加一个招募职位');
                    return;
                  }
                  if (!editingRecruitment.workload.trim()) {
                    alert('请输入时间投入');
                    return;
                  }
                  if (!editingRecruitment.deadline) {
                    alert('请选择招募截止日期');
                    return;
                  }
                  
                  try {
                    // 准备表单数据
                    const formData = {
                      ...editingRecruitment,
                      // 将技能字符串转换为数组
                      skills: editingRecruitment.skillString
                        ? editingRecruitment.skillString.split(',').map(skill => skill.trim()).filter(skill => skill)
                        : [],
                      // 将收益字符串转换为数组
                      benefits: editingRecruitment.benefitString
                        ? editingRecruitment.benefitString.split(',').map(benefit => benefit.trim()).filter(benefit => benefit)
                        : []
                    };
                    
                    // 更新招募信息
                    const updatedRecruitments = recruitments.map(r => {
                      if (r.id === editingRecruitment.id) {
                        return {
                          ...formData,
                          id: editingRecruitment.id,
                          createdAt: editingRecruitment.createdAt
                        };
                      }
                      return r;
                    });
                    
                    setRecruitments(updatedRecruitments);
                    
                    // 更新我的发布列表
                    const updatedMyRecruitments = myRecruitments.map(r => {
                      if (r.id === editingRecruitment.id) {
                        return {
                          ...formData,
                          id: editingRecruitment.id,
                          createdAt: editingRecruitment.createdAt
                        };
                      }
                      return r;
                    });
                    
                    setMyRecruitments(updatedMyRecruitments);
                    setIsEditDialogOpen(false);
                    

                    

                    
                    alert('招募信息更新成功！');
                  } catch (error) {
                    console.error('更新招募失败:', error);
                    alert('更新招募失败，请重试');
                  }
                }}>
                  保存修改
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
