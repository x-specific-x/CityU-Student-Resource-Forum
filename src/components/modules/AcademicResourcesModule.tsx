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
  Link,
  Video,
  Music,
  Archive
} from 'lucide-react';

export function AcademicResourcesModule() {
  const [activeTab, setActiveTab] = useState('courses');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('activity');
  const [filterBy, setFilterBy] = useState('all');
  
  const courseDiscussions = [
    {
      id: 1,
      title: "CS3104数据结构与算法",
      description: "讨论课程内容，分享学习心得，解答疑问",
      members: 156,
      posts: 89,
      category: "计算机科学",
      instructor: "张教授",
      lastActivity: "2小时前",
      isJoined: true
    },
    {
      id: 2,
      title: "EE2001电路分析基础",
      description: "电路理论学习讨论组",
      members: 89,
      posts: 67,
      category: "电子工程",
      instructor: "李教授",
      lastActivity: "4小时前",
      isJoined: false
    },
    {
      id: 3,
      title: "MA2001高等数学",
      description: "微积分、线性代数学习交流",
      members: 234,
      posts: 145,
      category: "数学",
      instructor: "王教授",
      lastActivity: "1小时前",
      isJoined: true
    }
  ];

  const techExchanges = [
    {
      id: 1,
      title: "React开发最佳实践分享",
      author: "张三",
      avatar: "张",
      tags: ["React", "前端", "JavaScript"],
      replies: 23,
      likes: 45,
      views: 156,
      time: "2小时前",
      isHot: true
    },
    {
      id: 2,
      title: "Python数据分析入门教程",
      author: "李四",
      avatar: "李",
      tags: ["Python", "数据分析", "机器学习"],
      replies: 34,
      likes: 67,
      views: 234,
      time: "1天前",
      isHot: false
    },
    {
      id: 3,
      title: "深度学习框架对比：TensorFlow vs PyTorch",
      author: "王五",
      avatar: "王",
      tags: ["深度学习", "TensorFlow", "PyTorch"],
      replies: 45,
      likes: 89,
      views: 345,
      time: "2天前",
      isHot: true
    }
  ];

  const learningMaterials = [
    {
      id: 1,
      title: "数据结构复习资料合集",
      type: "PDF",
      size: "15.6MB",
      downloads: 234,
      uploader: "学霸同学",
      uploadTime: "1周前",
      rating: 4.8,
      description: "包含所有章节的重点总结和练习题",
      fileType: "document",
      url: "#"
    },
    {
      id: 2,
      title: "Web开发实战视频教程",
      type: "视频",
      size: "2.3GB",
      downloads: 156,
      uploader: "前端大神",
      uploadTime: "3天前",
      rating: 4.9,
      description: "从零开始的全栈Web开发教程",
      fileType: "video",
      url: "#"
    },
    {
      id: 3,
      title: "机器学习算法代码实现",
      type: "ZIP",
      size: "45.2MB",
      downloads: 89,
      uploader: "AI研究生",
      uploadTime: "5天前",
      rating: 4.7,
      description: "常用机器学习算法的Python实现",
      fileType: "archive",
      url: "#"
    },
    {
      id: 4,
      title: "CS3104课程官方网站",
      type: "网页链接",
      size: "-",
      downloads: 567,
      uploader: "教务处",
      uploadTime: "1个月前",
      rating: 4.6,
      description: "课程大纲、作业提交、成绩查询等官方资源",
      fileType: "link",
      url: "https://www.cityu.edu.hk/courses/cs3104"
    },
    {
      id: 5,
      title: "Python编程在线课程",
      type: "网页链接",
      size: "-",
      downloads: 345,
      uploader: "技术分享者",
      uploadTime: "2周前",
      rating: 4.7,
      description: "免费的Python在线学习平台，包含互动练习",
      fileType: "link",
      url: "https://www.codecademy.com/learn/learn-python-3"
    },
    {
      id: 6,
      title: "算法可视化演示",
      type: "网页链接",
      size: "-",
      downloads: 123,
      uploader: "可视化爱好者",
      uploadTime: "1周前",
      rating: 4.9,
      description: "动态展示各种算法执行过程的网站",
      fileType: "link",
      url: "https://visualgo.net"
    },
    {
      id: 7,
      title: "线性代数精讲音频",
      type: "音频",
      size: "156MB",
      downloads: 78,
      uploader: "数学老师",
      uploadTime: "4天前",
      rating: 4.5,
      description: "重点概念讲解，适合复习时听",
      fileType: "audio",
      url: "#"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">学术资源</h1>
          <p className="text-muted-foreground">分享学习资源，交流学术心得</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              发起讨论
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>发起新讨论</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">标题</label>
                <Input placeholder="输入讨论标题" />
              </div>
              <div>
                <label className="text-sm font-medium">分类</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">课程讨论</SelectItem>
                    <SelectItem value="tech">技术交流</SelectItem>
                    <SelectItem value="document">文档资料</SelectItem>
                    <SelectItem value="video">视频教程</SelectItem>
                    <SelectItem value="audio">音频资料</SelectItem>
                    <SelectItem value="link">网页链接</SelectItem>
                    <SelectItem value="archive">压缩包</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">内容</label>
                <Textarea placeholder="详细描述你的问题或想分享的内容。如果是网页链接，请包含链接地址。" rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium">附件/链接 (可选)</label>
                <Input placeholder="粘贴网页链接或上传文件" />
                <p className="text-xs text-muted-foreground mt-1">
                  支持网页链接、文档、视频、音频等多种类型
                </p>
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
          placeholder="搜索课程、技术话题、学习资料..."
          className="pl-10"
        />
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
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

        {/* 课程讨论 */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部专业</SelectItem>
                <SelectItem value="cs">计算机科学</SelectItem>
                <SelectItem value="ee">电子工程</SelectItem>
                <SelectItem value="math">数学</SelectItem>
                <SelectItem value="business">商业管理</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">最新活动</SelectItem>
                <SelectItem value="members">成员最多</SelectItem>
                <SelectItem value="posts">帖子最多</SelectItem>
                <SelectItem value="created">创建时间</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            {courseDiscussions.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge variant="outline">{course.category}</Badge>
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
                      <Button 
                        variant={course.isJoined ? "outline" : "default"}
                        size="sm"
                      >
                        {course.isJoined ? "已加入" : "加入讨论"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 技术交流 */}
        <TabsContent value="tech" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
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
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">最新发布</SelectItem>
                <SelectItem value="hot">最热讨论</SelectItem>
                <SelectItem value="likes">点赞最多</SelectItem>
                <SelectItem value="replies">回复最多</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            {techExchanges.map((post) => (
              <Card key={post.id}>
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
                        <h3 className="font-semibold">{post.title}</h3>
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

        {/* 学习资料 */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32">
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
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downloads">下载最多</SelectItem>
                  <SelectItem value="rating">评分最高</SelectItem>
                  <SelectItem value="time">最新上传</SelectItem>
                  <SelectItem value="size">文件大小</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              上传资料
            </Button>
          </div>
          
          <div className="grid gap-4">
            {learningMaterials
              .filter(material => filterBy === 'all' || material.fileType === filterBy)
              .map((material) => {
                const getFileIcon = (fileType: string) => {
                  switch (fileType) {
                    case 'document': return <FileText className="h-6 w-6 text-blue-600" />;
                    case 'video': return <Video className="h-6 w-6 text-red-600" />;
                    case 'audio': return <Music className="h-6 w-6 text-green-600" />;
                    case 'link': return <Link className="h-6 w-6 text-purple-600" />;
                    case 'archive': return <Archive className="h-6 w-6 text-orange-600" />;
                    default: return <FileText className="h-6 w-6 text-blue-600" />;
                  }
                };

                const getIconBgColor = (fileType: string) => {
                  switch (fileType) {
                    case 'document': return 'bg-blue-100';
                    case 'video': return 'bg-red-100';
                    case 'audio': return 'bg-green-100';
                    case 'link': return 'bg-purple-100';
                    case 'archive': return 'bg-orange-100';
                    default: return 'bg-blue-100';
                  }
                };

                const getActionButton = (fileType: string) => {
                  if (fileType === 'link') {
                    return (
                      <Button onClick={() => window.open(material.url, '_blank')}>
                        <Link className="h-4 w-4 mr-2" />
                        访问链接
                      </Button>
                    );
                  }
                  return (
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                  );
                };

                return (
                  <Card key={material.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${getIconBgColor(material.fileType)} rounded-md flex items-center justify-center`}>
                            {getFileIcon(material.fileType)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{material.title}</h3>
                              {material.fileType === 'link' && (
                                <Badge variant="secondary" className="text-xs">
                                  外部链接
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {material.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{material.type}{material.size !== '-' && ` • ${material.size}`}</span>
                              <div className="flex items-center gap-1">
                                {material.fileType === 'link' ? (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    {material.downloads} 访问
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4" />
                                    {material.downloads} 下载
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {material.rating}
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-2">
                              由 {material.uploader} 分享于 {material.uploadTime}
                            </p>
                          </div>
                        </div>
                        
                        {getActionButton(material.fileType)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}