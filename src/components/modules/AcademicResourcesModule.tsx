import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  BookOpen,
  Code,
  FileText,
  Plus,
  Search,
  Users,
  MessageCircle,
  Download,
  Eye,
  ThumbsUp,
  Clock,
  Star,
  Upload,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  Video,
  Music,
  Archive,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

// 导入初始数据
import academicResourceData from '../../data/academicresourceData.json';

// 定义数据结构接口
interface CourseDiscussion {
  id: number;
  title: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  instructor: string;
  lastActivity: string;
  isJoined: boolean;
  creator: string; // 新增：讨论组创建者
}

interface LearningMaterial {
  id: number;
  title: string;
  type: string;
  size: string;
  downloads: number;
  uploader: string;
  uploadTime: string;
  rating: number;
  description: string;
  fileType: string;
  url: string;
}

interface TechExchange {
  id: number;
  title: string;
  author: string;
  avatar: string;
  tags: string[];
  replies: number;
  likes: number;
  views: number;
  time: string;
  isHot: boolean;
}

interface SortStates {
  courses: 'activity' | 'members' | 'posts';
  tech: 'time' | 'hot' | 'likes' | 'replies';
  materials: 'downloads' | 'rating' | 'time' | 'size';
}

interface SortOrders {
  courses: 'asc' | 'desc';
  tech: 'asc' | 'desc';
  materials: 'asc' | 'desc';
}

interface MajorOption {
  value: string;
  label: string;
}

export function AcademicResourcesModule() {
  // 当前用户（实际应用中可能从登录状态获取）
  const CURRENT_USER = "当前用户";
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<'courses' | 'tech' | 'materials'>('courses');

  // 检查是否有目标标签页
  useEffect(() => {
    try {
      const targetTab = sessionStorage.getItem('targetTab');
      if (targetTab === 'tech' || targetTab === 'courses' || targetTab === 'materials') {
        setActiveTab(targetTab);
        sessionStorage.removeItem('targetTab');
      }
    } catch (error) {
      console.error('Failed to check targetTab in sessionStorage:', error);
    }
  }, []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeMajor, setActiveMajor] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discussionToDelete, setDiscussionToDelete] = useState<number | null>(null);

  // 为每个标签页设置独立的排序状态和排序方向
  const [sortStates, setSortStates] = useState<SortStates>({
    courses: 'activity',    // 课程讨论默认"最新活动"
    tech: 'time',           // 技术交流默认"最新发布"
    materials: 'downloads'  // 学习资料默认"下载最多"
  });
  
  // 排序方向：升序(asc)或降序(desc)
  const [sortOrders, setSortOrders] = useState<SortOrders>({
    courses: 'desc',    // 课程讨论默认降序
    tech: 'desc',       // 技术交流默认降序
    materials: 'desc'   // 学习资料默认降序
  });

  // 根据当前标签页获取对应的排序值和排序方向
  const currentSort = sortStates[activeTab];
  const currentSortOrder = sortOrders[activeTab];

  // 上传表单状态
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    fileSize: '',
    fileType: 'document',
    file: null as File | null
  });

  // 讨论表单状态
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    category: '',
    content: '',
    attachment: ''
  });

  // 从JSON文件导入的初始数据
  const initialData = academicResourceData;

  // 从localStorage加载课程数据或使用初始数据
  const [courseDiscussions, setCourseDiscussions] = useState<CourseDiscussion[]>([]);

  // 技术交流数据
  const [techExchanges, setTechExchanges] = useState<TechExchange[]>(initialData.techExchanges);

  // 学习资料数据
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>([]);

  // 技术标签分类
  const techTagCategories = initialData.techTagCategories;

  // 专业选项
  const majorOptions: MajorOption[] = initialData.majorOptions;

  // 初始化：从localStorage加载数据
  useEffect(() => {
    // 加载课程讨论数据
    const savedCourses = localStorage.getItem('academic_courses');
    if (savedCourses) {
      setCourseDiscussions(JSON.parse(savedCourses) as CourseDiscussion[]);
    } else {
      setCourseDiscussions(initialData.courseDiscussions);
      localStorage.setItem('academic_courses', JSON.stringify(initialData.courseDiscussions));
    }

    // 加载学习资料数据
    const savedMaterials = localStorage.getItem('academic_materials');
    if (savedMaterials) {
      setLearningMaterials(JSON.parse(savedMaterials) as LearningMaterial[]);
    } else {
      setLearningMaterials(initialData.learningMaterials);
      localStorage.setItem('academic_materials', JSON.stringify(initialData.learningMaterials));
    }

    // 加载技术交流数据
    const savedTechExchanges = localStorage.getItem('academic_techExchanges');
    if (savedTechExchanges) {
      setTechExchanges(JSON.parse(savedTechExchanges) as TechExchange[]);
    } else {
      setTechExchanges(initialData.techExchanges);
      localStorage.setItem('academic_techExchanges', JSON.stringify(initialData.techExchanges));
    }

    // 加载排序状态
    const savedSortStates = localStorage.getItem('academic_sortStates');
    if (savedSortStates) {
      setSortStates(JSON.parse(savedSortStates) as SortStates);
    }
    
    // 加载排序方向
    const savedSortOrders = localStorage.getItem('academic_sortOrders');
    if (savedSortOrders) {
      setSortOrders(JSON.parse(savedSortOrders) as SortOrders);
    }
  }, []);

  // 当课程讨论数据变化时，同步到localStorage
  useEffect(() => {
    if (courseDiscussions.length > 0) {
      localStorage.setItem('academic_courses', JSON.stringify(courseDiscussions));
    }
  }, [courseDiscussions]);

  // 当学习资料变化时，同步到localStorage
  useEffect(() => {
    if (learningMaterials.length > 0) {
      localStorage.setItem('academic_materials', JSON.stringify(learningMaterials));
    }
  }, [learningMaterials]);

  // 当技术交流数据变化时，同步到localStorage
  useEffect(() => {
    if (techExchanges.length > 0) {
      localStorage.setItem('academic_techExchanges', JSON.stringify(techExchanges));
    }
  }, [techExchanges]);

  // 当排序状态变化时，同步到localStorage
  useEffect(() => {
    localStorage.setItem('academic_sortStates', JSON.stringify(sortStates));
  }, [sortStates]);
  
  // 当排序方向变化时，同步到localStorage
  useEffect(() => {
    localStorage.setItem('academic_sortOrders', JSON.stringify(sortOrders));
  }, [sortOrders]);

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

    // 添加额外的检查，确保不是简单的模块切换
    // 检查是否是从首页点击"学术资源"按钮进入的
    let isFromHomeModule = false;
    try {
      isFromHomeModule = sessionStorage.getItem('fromHomeModule') === 'academic-resources';
    } catch (error) {
      console.error('Failed to check fromHomeModule in sessionStorage:', error);
    }

    // 添加额外的检查，确保不是第一次加载模块
    // 检查是否是第一次进入学术资源模块
    let isFirstLoad = false;
    try {
      const visitedModules = JSON.parse(localStorage.getItem('visitedModules') || '{}');
      isFirstLoad = !visitedModules['academic-resources'];

      // 标记为已访问
      if (!visitedModules['academic-resources']) {
        visitedModules['academic-resources'] = true;
        localStorage.setItem('visitedModules', JSON.stringify(visitedModules));
      }
    } catch (error) {
      console.error('Failed to check visitedModules in localStorage:', error);
    }

    // 添加额外的检查，确保不是通过侧边栏导航进入的
    let isFromSidebar = false;
    try {
      isFromSidebar = sessionStorage.getItem('navigationSource') === 'sidebar';
    } catch (error) {
      console.error('Failed to check navigationSource in sessionStorage:', error);
    }

    // 只有在有明确目标且不是从首页点击按钮进入且不是第一次加载且不是通过侧边栏导航进入时才滚动
    if ((hasHash || hasTargetId) && !isFromHomeModule && !isFirstLoad && !isFromSidebar) {
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

    // 清理sessionStorage中的标记
    try {
      sessionStorage.removeItem('fromHomeModule');
      sessionStorage.removeItem('navigationSource');
    } catch (error) {
      console.error('Failed to clear sessionStorage markers:', error);
    }

    // 清理函数
    return () => {
      window.removeEventListener('scrollToElement', handleScrollEvent as EventListener);
    };
  }, []); // 空依赖数组，确保只在组件挂载和卸载时执行

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 处理上传资料
  const handleUpload = () => {
    if (!uploadForm.name) {
      alert('请输入资料名称');
      return;
    }

    const newMaterial: LearningMaterial = {
      id: learningMaterials.length + 1,
      title: uploadForm.name,
      type: uploadForm.fileType === 'document' ? 'PDF' :
        uploadForm.fileType === 'video' ? '视频' :
          uploadForm.fileType === 'audio' ? '音频' :
            uploadForm.fileType === 'archive' ? 'ZIP' : '网页链接',
      size: uploadForm.fileSize || '未知',
      downloads: 0,
      uploader: CURRENT_USER,
      uploadTime: "刚刚",
      rating: 0,
      description: uploadForm.description,
      fileType: uploadForm.fileType,
      url: uploadForm.fileType === 'link' ? '' : '#'
    };

    setLearningMaterials([...learningMaterials, newMaterial]);
    setIsUploadDialogOpen(false);
    setUploadForm({
      name: '',
      description: '',
      fileSize: '',
      fileType: 'document',
      file: null
    });

    alert('资料上传成功！');
  };

  // 处理删除资料
  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除该资料吗？此操作不可恢复。')) {
      const updatedMaterials = learningMaterials.filter(
        material => material.id !== id
      );
      setLearningMaterials(updatedMaterials);
      alert('资料已成功删除');
    }
  };

  // 下载文件处理
  const downloadFile = (material: LearningMaterial) => {
    // 这里实现文件下载逻辑
    let content = `资料: ${material.title}\n描述: ${material.description}`;
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (material.fileType === 'document') {
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
    } else if (material.fileType === 'video') {
      mimeType = 'video/mp4';
      fileExtension = 'mp4';
    } else if (material.fileType === 'audio') {
      mimeType = 'audio/mpeg';
      fileExtension = 'mp3';
    } else if (material.fileType === 'archive') {
      mimeType = 'application/zip';
      fileExtension = 'zip';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 更新下载次数
    setLearningMaterials(learningMaterials.map(m =>
      m.id === material.id ? { ...m, downloads: m.downloads + 1 } : m
    ));
  };

  // 处理“加入讨论”逻辑
  const handleJoinDiscussion = (courseId: number) => {
    setCourseDiscussions(prevDiscussions => {
      // 更新讨论组状态并增加成员数量
      return prevDiscussions.map(course => 
        course.id === courseId 
          ? { ...course, isJoined: true, members: course.members + 1 } 
          : course
      );
    });
    alert('已成功加入讨论组！');
  };

  // 处理“退出讨论”逻辑
  const handleLeaveDiscussion = (courseId: number) => {
    if (window.confirm('确定要退出讨论组吗？')) {
      setCourseDiscussions(prevDiscussions => {
        // 更新讨论组状态并减少成员数量
        return prevDiscussions.map(course => 
          course.id === courseId 
            ? { ...course, isJoined: false, members: Math.max(0, course.members - 1) } 
            : course
        );
      });
    }
  };

  // 处理删除讨论组逻辑
  const handleDeleteDiscussion = () => {
    if (discussionToDelete !== null) {
      const updatedDiscussions = courseDiscussions.filter(
        course => course.id !== discussionToDelete
      );
      setCourseDiscussions(updatedDiscussions);
      setDeleteDialogOpen(false);
      setDiscussionToDelete(null);
      alert('讨论组已成功删除');
    }
  };

  // 打开删除确认对话框
  const openDeleteDialog = (courseId: number) => {
    setDiscussionToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  // 切换排序方向
  const toggleSortOrder = () => {
    setSortOrders(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 排序处理函数 - 课程讨论
  const getSortedCourses = () => {
    const sorted = [...courseDiscussions];
    let ordered;

    switch (currentSort) {
      case 'activity':
        const activityOrder: Record<string, number> = {
          "刚刚": 10, "1小时前": 9, "2小时前": 8, "3小时前": 7,
          "4小时前": 6, "5小时前": 5, "1天前": 4, "2天前": 3,
          "3天前": 2, "1周前": 1, "1个月前": 0
        };
        ordered = sorted.sort((a, b) =>
          (activityOrder[b.lastActivity] || -1) - (activityOrder[a.lastActivity] || -1)
        );
        break;
      case 'members':
        ordered = sorted.sort((a, b) => b.members - a.members);
        break;
      case 'posts':
        ordered = sorted.sort((a, b) => b.posts - a.posts);
        break;
      default:
        ordered = sorted;
    }

    // 根据排序方向调整
    return currentSortOrder === 'asc' ? ordered.reverse() : ordered;
  };

  // 排序处理函数 - 技术交流
  const getSortedTechPosts = () => {
    const sorted = [...techExchanges];
    let ordered;

    switch (currentSort) {
      case 'time': {
        const timeOrder: Record<string, number> = {
          "刚刚": 100, "1分钟前": 90, "30分钟前": 80,
          "1小时前": 70, "2小时前": 60, "3小时前": 50,
          "4小时前": 40, "5小时前": 30, "1天前": 20,
          "2天前": 15, "3天前": 10, "1周前": 5, "1个月前": 1
        };
        ordered = sorted.sort((a, b) => {
          const aVal = timeOrder[a.time] || 0;
          const bVal = timeOrder[b.time] || 0;
          return bVal - aVal;
        });
        break;
      }
      case 'hot': {
        ordered = sorted.sort((a, b) => {
          const aScore = a.views * 1 + a.likes * 3 + a.replies * 5;
          const bScore = b.views * 1 + b.likes * 3 + b.replies * 5;
          return bScore - aScore;
        });
        break;
      }
      case 'likes':
        ordered = sorted.sort((a, b) => b.likes - a.likes);
        break;
      case 'replies':
        ordered = sorted.sort((a, b) => b.replies - a.replies);
        break;
      default:
        ordered = sorted;
    }

    // 根据排序方向调整
    return currentSortOrder === 'asc' ? ordered.reverse() : ordered;
  };

  // 排序处理函数 - 学习资料
  const getSortedMaterials = () => {
    const sorted = [...learningMaterials];
    let ordered;

    switch (currentSort) {
      case 'downloads':
        ordered = sorted.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        ordered = sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'time':
        const timeOrder: Record<string, number> = {
          "刚刚": 10, "1小时前": 9, "2小时前": 8, "3小时前": 7,
          "4小时前": 6, "5小时前": 5, "1天前": 4, "2天前": 3,
          "3天前": 2, "1周前": 1, "1个月前": 0
        };
        ordered = sorted.sort((a, b) =>
          (timeOrder[b.uploadTime] || -1) - (timeOrder[a.uploadTime] || -1)
        );
        break;
      case 'size':
        ordered = sorted.sort((a, b) => {
          if (a.fileType === 'link') return 1;
          if (b.fileType === 'link') return -1;

          const parseSize = (size: string) => {
            const match = size.match(/(\d+\.?\d*)\s*([KMG]?B)/);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const unit = match[2];

            const multipliers: Record<string, number> = {
              'B': 1,
              'KB': 1024,
              'MB': 1024 * 1024,
              'GB': 1024 * 1024 * 1024
            };

            return value * (multipliers[unit] || 1);
          };

          return parseSize(b.size) - parseSize(a.size);
        });
        break;
      default:
        ordered = sorted;
    }

    // 根据排序方向调整
    return currentSortOrder === 'asc' ? ordered.reverse() : ordered;
  };

  // 渲染排序按钮组件
  const SortButtons = () => (
    <div className="flex flex-col border rounded-md bg-background h-9 w-[3.125rem]">
      <button
        onClick={() => setSortOrders(prev => ({...prev, [activeTab]: 'desc'}))}
        className={`flex-1 flex items-center justify-center hover:bg-gray-100 rounded-t-md transition-colors ${
          currentSortOrder === 'desc' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
        }`}
        title="降序排列"
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button
        onClick={() => setSortOrders(prev => ({...prev, [activeTab]: 'asc'}))}
        className={`flex-1 flex items-center justify-center hover:bg-gray-100 rounded-b-md transition-colors ${
          currentSortOrder === 'asc' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
        }`}
        title="升序排列"
      >
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">学术资源</h1>
          <p className="text-muted-foreground">分享学习资源，交流学术心得</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              发起讨论
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>发起新讨论</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">标题</label>
                <Input
                  placeholder="输入讨论标题"
                  value={discussionForm.title}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">分类</label>
                <Select
                  value={discussionForm.category}
                  onValueChange={(value) => setDiscussionForm({ ...discussionForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择专业" />
                  </SelectTrigger>
                  <SelectContent>
                    {majorOptions.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">内容</label>
                <Textarea
                  placeholder="详细描述你的问题或想分享的内容。如果是网页链接，请包含链接地址。"
                  rows={6}
                  value={discussionForm.content}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">附件/链接 (可选)</label>
                <Input
                  placeholder="粘贴网页链接或上传文件"
                  value={discussionForm.attachment}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, attachment: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  支持网页链接、文档、视频、音频等多种类型
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => {
                  if (!discussionForm.title) {
                    alert('请输入讨论标题');
                    return;
                  }

                  // 获取分类对应的显示名称
                  const categoryName = majorOptions.find(
                    option => option.value === discussionForm.category
                  )?.label || discussionForm.category;

                  // 生成新讨论，添加创建者信息
                  const newDiscussion: CourseDiscussion = {
                    id: courseDiscussions.length + 1,
                    title: discussionForm.title,
                    description: discussionForm.content,
                    members: 1,
                    posts: 0,
                    category: categoryName,
                    instructor: CURRENT_USER,
                    lastActivity: "刚刚",
                    isJoined: true,
                    creator: CURRENT_USER  // 设置创建者为当前用户
                  };

                  // 更新课程讨论列表
                  setCourseDiscussions([...courseDiscussions, newDiscussion]);

                  // 重置表单并关闭对话框
                  setDiscussionForm({
                    title: '',
                    category: '',
                    content: '',
                    attachment: ''
                  });
                  setIsCreateDialogOpen(false);

                  alert(`成功发起${categoryName}专业的讨论！`);
                }}>
                  发布
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索栏和急招标签容器 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索课程、技术话题、学习资料..."
            className="pl-10"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 删除讨论组确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除讨论组</DialogTitle>
          </DialogHeader>
          <p>
            确定要删除这个讨论组吗？此操作将永久删除该讨论组及其所有内容，且无法恢复。
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteDiscussion}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 标签页内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 p-1">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            课程讨论
          </TabsTrigger>
          <TabsTrigger value="tech" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            技术交流
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            学习资料
          </TabsTrigger>
        </TabsList>

        {/* 课程讨论内容 */}
        <TabsContent value="courses" className="space-y-4 mt-2">
          <div className="flex items-center gap-3 mb-4">
            <Select value={activeMajor} onValueChange={setActiveMajor}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue placeholder="全部专业" />
              </SelectTrigger>
              <SelectContent>
                {majorOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select
                value={currentSort}
                onValueChange={(value: any) => {
                  setSortStates(prev => ({
                    ...prev,
                    [activeTab]: value
                  }));
                }}
              >
                <SelectTrigger className="w-36">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activity">最新活动</SelectItem>
                  <SelectItem value="members">成员数量</SelectItem>
                  <SelectItem value="posts">帖子数量</SelectItem>
                </SelectContent>
              </Select>
              
              {/* 课程讨论排序按钮 */}
              <SortButtons />
            </div>

            {(activeMajor !== 'all' || searchKeyword || currentSort !== 'activity') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveMajor('all');
                  setSearchKeyword('');
                  setSortStates(prev => ({...prev, courses: 'activity'}));
                  setSortOrders(prev => ({...prev, courses: 'desc'}));
                }}
              >
                清空筛选
              </Button>
            )}
          </div>

          {/* 筛选结果提示 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {activeMajor === 'all' ? '显示全部专业' : `筛选专业：${
                activeMajor === 'computer' ? '计算机科学' : 
                activeMajor === 'electrical' ? '电子工程' : 
                activeMajor === 'mechanical' ? '机械工程' : 
                activeMajor === 'mathematics' ? '数学统计' : activeMajor
              }`}
              {searchKeyword && ` | 搜索："${searchKeyword}"`}
              {currentSort === 'activity' ? ` | 按最新活动${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                currentSort === 'members' ? ` | 按成员数量${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                ` | 按帖子数量${currentSortOrder === 'asc' ? '升序' : '降序'}排序`}
            </span>
            <span>共找到 {getSortedCourses().filter(course => {
              if (activeMajor === 'all') {
                return searchKeyword === '' || course.title.toLowerCase().includes(searchKeyword.toLowerCase());
              }
              const categoryMap: Record<string, string> = {
                computer: '计算机科学',
                electrical: '电子工程',
                mechanical: '机械工程',
                mathematics: '数学统计'
              };
              return (course.category === categoryMap[activeMajor]) &&
                (searchKeyword === '' || course.title.toLowerCase().includes(searchKeyword.toLowerCase()));
            }).length} 个结果</span>
          </div>

          <div className="grid gap-4">
            {getSortedCourses()
              .filter(course => {
                if (activeMajor === 'all') {
                  return searchKeyword === '' || course.title.toLowerCase().includes(searchKeyword.toLowerCase());
                }
                const categoryMap: Record<string, string> = {
                  computer: '计算机科学',
                  electrical: '电子工程',
                  mechanical: '机械工程',
                  mathematics: '数学统计'
                };
                return (course.category === categoryMap[activeMajor]) &&
                  (searchKeyword === '' || course.title.toLowerCase().includes(searchKeyword.toLowerCase()));
              })
              .map((course) => (
                <Card key={course.id} id={`academic-course-${course.id}`} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <Badge variant="outline">{course.category}</Badge>
                          {/* 显示创建者标识 */}
                          {course.creator === CURRENT_USER && (
                            <Badge variant="secondary" className="text-xs">
                              我的讨论
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.members} 成员
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {course.posts} 帖子
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.lastActivity}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm text-muted-foreground">
                          授课教师：{course.instructor}
                        </p>
                        <div className="flex gap-2">
                          {course.isJoined ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLeaveDiscussion(course.id)}
                            >
                              已加入
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleJoinDiscussion(course.id)}
                            >
                              加入讨论
                            </Button>
                          )}
                          
                          {/* 只有自己创建的讨论组才显示删除按钮 */}
                          {course.creator === CURRENT_USER && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(course.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* 技术交流内容 */}
        <TabsContent value="tech" className="space-y-4 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部技术</SelectItem>
                  <SelectItem value="frontend">前端开发</SelectItem>
                  <SelectItem value="backend">后端开发</SelectItem>
                  <SelectItem value="mobile">移动开发</SelectItem>
                  <SelectItem value="ai">人工智能</SelectItem>
                  <SelectItem value="data">数据科学</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={currentSort}
                onValueChange={(value: any) => {
                  setSortStates(prev => ({
                    ...prev,
                    [activeTab]: value
                  }));
                }}
              >
                <SelectTrigger className="w-36">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">发布时间</SelectItem>
                  <SelectItem value="hot">热门程度</SelectItem>
                  <SelectItem value="likes">点赞数量</SelectItem>
                  <SelectItem value="replies">回复数量</SelectItem>
                </SelectContent>
              </Select>
              
              {/* 技术交流排序按钮 */}
              <SortButtons />
            </div>

            {(filterBy !== 'all' || searchKeyword || currentSort !== 'time') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterBy('all');
                  setSearchKeyword('');
                  setSortStates(prev => ({...prev, tech: 'time'}));
                  setSortOrders(prev => ({...prev, tech: 'desc'}));
                }}
              >
                清空筛选
              </Button>
            )}
          </div>

          {/* 筛选结果提示 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filterBy === 'all' ? '显示全部技术' : `筛选技术：${
                filterBy === 'frontend' ? '前端开发' : 
                filterBy === 'backend' ? '后端开发' : 
                filterBy === 'mobile' ? '移动开发' : 
                filterBy === 'ai' ? '人工智能' : 
                filterBy === 'data' ? '数据科学' : filterBy
              }`}
              {searchKeyword && ` | 搜索："${searchKeyword}"`}
              {currentSort === 'time' ? ` | 按发布时间${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                currentSort === 'hot' ? ` | 按热门程度${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                currentSort === 'likes' ? ` | 按点赞数量${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                ` | 按回复数量${currentSortOrder === 'asc' ? '升序' : '降序'}排序`}
            </span>
            <span>共找到 {getSortedTechPosts().filter(post => {
              if (filterBy === 'all') {
                return searchKeyword === '' || post.title.toLowerCase().includes(searchKeyword.toLowerCase());
              }
              const categoryTags = techTagCategories[filterBy as keyof typeof techTagCategories] || [];
              return post.tags.some(tag => categoryTags.includes(tag)) &&
                (searchKeyword === '' || post.title.toLowerCase().includes(searchKeyword.toLowerCase()));
            }).length} 个结果</span>
          </div>

          <div className="grid gap-4">
            {getSortedTechPosts()
              .filter(post => {
                if (filterBy === 'all') {
                  return searchKeyword === '' || post.title.toLowerCase().includes(searchKeyword.toLowerCase());
                }
                const categoryTags = techTagCategories[filterBy as keyof typeof techTagCategories] || [];
                return post.tags.some(tag => categoryTags.includes(tag)) &&
                  (searchKeyword === '' || post.title.toLowerCase().includes(searchKeyword.toLowerCase()));
              })
              .map((post) => (
                <Card key={post.id} id={`academic-tech-${post.id}`} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {post.isHot && <Badge variant="destructive">热门</Badge>}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.replies}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* 学习资料内容 */}
        <TabsContent value="materials" className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="document">文档资料</SelectItem>
                  <SelectItem value="video">视频教程</SelectItem>
                  <SelectItem value="audio">音频资料</SelectItem>
                  <SelectItem value="link">网页链接</SelectItem>
                  <SelectItem value="archive">压缩包</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={currentSort}
                onValueChange={(value: any) => {
                  setSortStates(prev => ({
                    ...prev,
                    [activeTab]: value
                  }));
                }}
              >
                <SelectTrigger className="w-36">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downloads">下载次数</SelectItem>
                  <SelectItem value="rating">评分高低</SelectItem>
                  <SelectItem value="time">上传时间</SelectItem>
                  <SelectItem value="size">文件大小</SelectItem>
                </SelectContent>
              </Select>
              
              {/* 学习资料排序按钮 */}
              <SortButtons />
            </div>

            {(filterBy !== 'all' || searchKeyword || currentSort !== 'downloads') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterBy('all');
                  setSearchKeyword('');
                  setSortStates(prev => ({...prev, materials: 'downloads'}));
                  setSortOrders(prev => ({...prev, materials: 'desc'}));
                }}
              >
                清空筛选
              </Button>
            )}
          </div>

          {/* 筛选结果提示 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filterBy === 'all' ? '显示全部类型' : `筛选类型：${
                filterBy === 'document' ? '文档资料' : 
                filterBy === 'video' ? '视频教程' : 
                filterBy === 'audio' ? '音频资料' : 
                filterBy === 'link' ? '网页链接' : 
                filterBy === 'archive' ? '压缩包' : filterBy
              }`}
              {searchKeyword && ` | 搜索："${searchKeyword}"`}
              {currentSort === 'downloads' ? ` | 按下载次数${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                currentSort === 'rating' ? ` | 按评分高低${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                currentSort === 'time' ? ` | 按上传时间${currentSortOrder === 'asc' ? '升序' : '降序'}排序` : 
                ` | 按文件大小${currentSortOrder === 'asc' ? '升序' : '降序'}排序`}
            </span>
            <span>共找到 {learningMaterials.filter(material => {
              if (filterBy === 'all') {
                return searchKeyword === '' || material.title.toLowerCase().includes(searchKeyword.toLowerCase());
              }
              return material.type === filterBy &&
                (searchKeyword === '' || material.title.toLowerCase().includes(searchKeyword.toLowerCase()));
            }).length} 个结果</span>
          </div>

          <div className="flex items-center gap-2">
            {/* 上传资料按钮 */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  上传资料
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>上传新资料</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">资料名称</label>
                    <Input
                      placeholder="输入资料名称"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">资料类型</label>
                    <Select
                      value={uploadForm.fileType}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, fileType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">文档 (PDF, Word等)</SelectItem>
                        <SelectItem value="video">视频教程</SelectItem>
                        <SelectItem value="audio">音频资料</SelectItem>
                        <SelectItem value="archive">压缩包</SelectItem>
                        <SelectItem value="link">网页链接</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">描述</label>
                    <Textarea
                      placeholder="简单描述资料内容和用途"
                      rows={6}
                      className="min-h-[150px]"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    />
                  </div>
                  
                  {/* 文件上传区域 */}
                  {uploadForm.fileType !== 'link' && (
                    <div className="space-y-1">
                      {uploadForm.file && (
                        <label className="text-sm font-medium block">
                          已选择文件: {uploadForm.file.name}
                        </label>
                      )}
                      
                      <div className="relative">
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) {
                              setUploadForm({
                                ...uploadForm,
                                file,
                                fileSize: formatFileSize(file.size)
                              });
                            } else {
                              setUploadForm({ ...uploadForm, file: null, fileSize: '' });
                            }
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="border rounded-md p-4 text-center border-gray-300 hover:border-blue-500 transition-colors">
                          {uploadForm.file ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                              <FileText className="h-4 w-4" />
                              <span className="truncate max-w-[80%]">{uploadForm.file.name}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              点击或拖放文件到此处上传
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {uploadForm.fileType === 'link' && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">网页链接</label>
                      <Input
                        placeholder="输入有效的网页URL"
                        value={uploadForm.fileSize}
                        onChange={(e) => setUploadForm({ ...uploadForm, fileSize: e.target.value })}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleUpload}>
                      上传
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {getSortedMaterials()
              .filter(material => {
                if (filterBy === 'all') {
                  return searchKeyword === '' || material.title.toLowerCase().includes(searchKeyword.toLowerCase());
                }
                return material.fileType === filterBy &&
                  (searchKeyword === '' || material.title.toLowerCase().includes(searchKeyword.toLowerCase()));
              })
              .map((material) => (
                <Card key={material.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg truncate">{material.title}</h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {material.fileType === 'document' && <FileText className="h-3 w-3" />}
                            {material.fileType === 'video' && <Video className="h-3 w-3" />}
                            {material.fileType === 'audio' && <Music className="h-3 w-3" />}
                            {material.fileType === 'archive' && <Archive className="h-3 w-3" />}
                            {material.fileType === 'link' && <LinkIcon className="h-3 w-3" />}
                            {material.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {material.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {material.downloads} 下载
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {material.rating} 评分
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {material.uploadTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>上传者: {material.uploader}</span>
                          </div>
                          {material.fileType !== 'link' && (
                            <div className="flex items-center gap-1">
                              <span>{material.size}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {material.fileType === 'link' ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => window.open(material.url, '_blank')}
                          >
                            访问链接
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => downloadFile(material)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                        )}
                        {/* 只有自己上传的资料才显示删除按钮 */}
                        {material.uploader === CURRENT_USER && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(material.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
