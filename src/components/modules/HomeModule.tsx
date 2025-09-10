import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  TrendingUp,
  Users,
  Briefcase,
  BookOpen,
  Heart,
  Eye,
  ThumbsUp,
  MessageCircle,
  Filter,
  ArrowUpDown,
  X,
  Send
} from 'lucide-react';

// 导入数据文件
import academicResourceData from '../../data/academicresourceData.json';
import recruitmentData from '../../data/recruitmentData.json';
import teamData from '../../data/teamData.json';

export function HomeModule() {
  const [sortBy, setSortBy] = useState('time');
  const [filterBy, setFilterBy] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Record<string, {id: string, text: string, author: string, time: string}[]>>({});

  // 从localStorage加载点赞和评论数据
  const loadFromLocalStorage = () => {
    try {
      // 加载点赞数据
      const savedLikedPosts = localStorage.getItem('likedPosts');
      const likedPostsSet = savedLikedPosts ? new Set(JSON.parse(savedLikedPosts)) : new Set();

      // 加载评论数据
      const savedComments = localStorage.getItem('postComments');
      const commentsData = savedComments ? JSON.parse(savedComments) : {};

      // 加载点赞数量数据
      const savedLikesCount = localStorage.getItem('likesCount');
      const likesCountData = savedLikesCount ? JSON.parse(savedLikesCount) : {};

      // 一次性设置所有状态，减少渲染次数
      setLikedPosts(likedPostsSet);
      setComments(commentsData);

      // 返回点赞数量数据，以便在loadAndTransformData中使用
      return likesCountData;
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return {};
    }
  };

  // 保存点赞数据到localStorage
  const saveLikedPostsToLocalStorage = (likedPostsSet: Set<string>) => {
    try {
      const likedPostsArray = Array.from(likedPostsSet);
      localStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
    } catch (error) {
      console.error('Failed to save liked posts to localStorage:', error);
    }
  };

  // 保存点赞数量到localStorage
  const saveLikesCountToLocalStorage = (posts: any[]) => {
    try {
      const likesCountData: Record<string, number> = {};
      posts.forEach(post => {
        likesCountData[post.id] = post.likes;
      });
      localStorage.setItem('likesCount', JSON.stringify(likesCountData));
    } catch (error) {
      console.error('Failed to save likes count to localStorage:', error);
    }
  };

  // 保存评论数据到localStorage
  const saveCommentsToLocalStorage = (commentsData: Record<string, {id: string, text: string, author: string, time: string}[]>) => {
    try {
      localStorage.setItem('postComments', JSON.stringify(commentsData));
    } catch (error) {
      console.error('Failed to save comments to localStorage:', error);
    }
  };

  // 确保组件已挂载，避免SSR和hydration问题
  useEffect(() => {
    setIsMounted(true);
    // 从localStorage加载点赞和评论数据
    const likesCountData = loadFromLocalStorage();
    // 加载帖子数据并传入点赞数量数据
    loadAndTransformData(likesCountData);
  }, []);

  // 当筛选或排序条件变化时，重新处理数据
  useEffect(() => {
    if (recentPosts.length > 0) {
      // 获取localStorage中的点赞数量数据
      const savedLikesCount = localStorage.getItem('likesCount');
      const likesCountData = savedLikesCount ? JSON.parse(savedLikesCount) : {};
      // 重新处理数据并应用点赞数量
      loadAndTransformData(likesCountData);
    }
  }, [sortBy, filterBy]);

  // 处理快速入口按钮点击事件
  const handleQuickAccessClick = (moduleId: string) => {
    // 设置标记，表明是从首页点击按钮进入的
    try {
      sessionStorage.setItem('fromHomeModule', moduleId);
    } catch (error) {
      console.error('Failed to set fromHomeModule in sessionStorage:', error);
    }

    // 通过全局事件或直接操作DOM来触发模块切换
    const event = new CustomEvent('moduleChange', { detail: { moduleId } });
    window.dispatchEvent(event);
  };

  // 处理帖子点击事件
  const handlePostClick = (post: any) => {
    // 根据帖子类型确定要跳转的模块
    let moduleId = '';
    let postId = '';
    let elementId = '';

    // 从帖子ID中提取原始ID和类型
    if (post.id.startsWith('academic-course-')) {
      moduleId = 'academic-resources';
      postId = post.id.replace('academic-course-', '');
      elementId = `academic-course-${postId}`;
    } else if (post.id.startsWith('academic-tech-')) {
      moduleId = 'academic-resources';
      postId = post.id.replace('academic-tech-', '');
      elementId = `academic-tech-${postId}`;

      // 设置标记，指示需要切换到技术交流标签页
      try {
        sessionStorage.setItem('targetTab', 'tech');
      } catch (error) {
        console.error('Failed to set targetTab in sessionStorage:', error);
      }
    } else if (post.id.startsWith('recruitment-')) {
      moduleId = 'recruitment';
      postId = post.id.replace('recruitment-', '');
      elementId = `recruitment-${postId}`;  // 确保与RecruitmentModule中的ID格式一致
    } else if (post.id.startsWith('team-')) {
      moduleId = 'team-center';
      postId = post.id.replace('team-', '');
      elementId = `team-${postId}`;
    }

    // 创建自定义事件，传递模块ID和帖子ID
    const event = new CustomEvent('postClick', { 
      detail: { 
        moduleId, 
        postId,
        elementId,
        postData: post 
      } 
    });
    window.dispatchEvent(event);

    // 同时触发模块切换事件
    const moduleEvent = new CustomEvent('moduleChange', { detail: { moduleId } });
    window.dispatchEvent(moduleEvent);

    // 使用URL哈希值来标记目标元素，这是最可靠的滚动方法
    try {
      // 保存到localStorage作为备用，并设置一次性标记
      localStorage.setItem('targetElementId', elementId);
      localStorage.setItem('oneTimeScroll', 'true');

      // 设置一个过期时间，例如10分钟后清除这个标记
      setTimeout(() => {
        try {
          localStorage.removeItem('oneTimeScroll');
        } catch (error) {
          console.error('Failed to clear oneTimeScroll from localStorage:', error);
        }
      }, 600000); // 10分钟 = 600000毫秒

      // 直接修改URL哈希值，浏览器会自动滚动到对应ID的元素
      // 使用replaceState而不是pushState，避免在历史记录中添加额外条目
      const currentUrl = new URL(window.location.href);
      currentUrl.hash = elementId;
      window.history.replaceState({}, '', currentUrl);

      // 强制触发滚动
      setTimeout(() => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加一个高亮效果，让用户更容易注意到
          targetElement.classList.add('highlighted');
          setTimeout(() => {
            targetElement.classList.remove('highlighted');
          }, 2000);
        } else {
          console.warn(`Element with ID ${elementId} not found`);
        }
      }, 500); // 给予更多时间让页面完全加载
    } catch (error) {
      console.error('Error during scroll to element:', error);
    }
  };

  // 加载并转换数据
  const loadAndTransformData = (likesCountData: Record<string, number> = {}) => {
    // 从各个数据源提取并转换数据
    const academicPosts = transformAcademicData();
    const recruitmentPosts = transformRecruitmentData();
    const teamPosts = transformTeamData();

    // 合并所有数据
    let allPosts = [...academicPosts, ...recruitmentPosts, ...teamPosts];

    // 应用localStorage中的点赞数量
    allPosts = allPosts.map(post => {
      if (likesCountData[post.id]) {
        return { ...post, likes: likesCountData[post.id] };
      }
      return post;
    });

    // 根据筛选条件过滤数据
    if (filterBy !== 'all') {
      allPosts = allPosts.filter(post => post.categoryType === filterBy);
    }

    // 根据排序条件排序数据
    allPosts = sortPosts(allPosts, sortBy);

    setRecentPosts(allPosts);
  };

  // 转换学术资源数据
  const transformAcademicData = () => {
    const posts: any[] = [];

    // 处理课程讨论数据
    academicResourceData.courseDiscussions.forEach((item: any) => {
      // 为每个课程讨论设置固定的查看、点赞和评论数
      const fixedStats = {
        '1': { views: 156, likes: 24, replies: item.posts || 0 },
        '2': { views: 89, likes: 15, replies: item.posts || 0 },
        '3': { views: 203, likes: 42, replies: item.posts || 0 },
        '4': { views: 67, likes: 8, replies: item.posts || 0 },
        '5': { views: 134, likes: 19, replies: item.posts || 0 }
      };

      const stats = fixedStats[item.id as keyof typeof fixedStats] || { 
        views: Math.floor(Math.random() * 200) + 50, 
        likes: Math.floor(Math.random() * 50) + 1, 
        replies: item.posts || 0 
      };

      posts.push({
        id: `academic-course-${item.id}`,
        title: item.title,
        category: "学术资源-课程讨论",
        categoryType: "academic",
        author: item.creator,
        avatar: item.creator ? item.creator.substring(0, 1) : "课",
        time: item.lastActivity,
        replies: stats.replies,
        likes: stats.likes,
        views: stats.views,
        isHot: item.posts > 80
      });
    });

    // 处理技术交流数据
    academicResourceData.techExchanges.forEach((item: any) => {
      posts.push({
        id: `academic-tech-${item.id}`,
        title: item.title,
        category: "学术资源-技术交流",
        categoryType: "academic",
        author: item.author,
        avatar: item.avatar,
        time: item.time,
        replies: item.replies,
        likes: item.likes,
        views: item.views,
        isHot: item.likes > 50
      });
    });

    return posts;
  };

  // 转换社团招募数据
  const transformRecruitmentData = () => {
    const posts: any[] = [];

    // 处理社团招募数据
    recruitmentData.recruitments.forEach((item: any) => {
      // 为每个社团招募设置固定的查看、点赞和评论数
      const fixedStats = {
        '1': { views: 245, likes: 36, replies: 12 },
        '2': { views: 178, likes: 28, replies: 8 },
        '3': { views: 312, likes: 45, replies: 17 },
        '4': { views: 92, likes: 14, replies: 5 },
        '5': { views: 156, likes: 23, replies: 9 }
      };

      const stats = fixedStats[item.id as keyof typeof fixedStats] || { 
        views: Math.floor(Math.random() * 300) + 50, 
        likes: Math.floor(Math.random() * 80) + 10, 
        replies: Math.floor(Math.random() * 30) + 1 
      };

      posts.push({
        id: `recruitment-${item.id}`,
        title: item.title,
        category: "项目/社团招募",
        categoryType: "recruitment",
        author: item.organizer,
        avatar: item.organizerAvatar,
        time: formatTimeDifference(item.createdAt),
        replies: stats.replies,
        likes: stats.likes,
        views: stats.views,
        isHot: item.isUrgent
      });
    });

    return posts;
  };

  // 转换组队中心数据
  const transformTeamData = () => {
    const posts: any[] = [];

    // 处理寻找团队数据
    teamData.availableTeams.forEach((item: any) => {
      // 为每个组队中心设置固定的查看、点赞和评论数
      const fixedStats = {
        '1': { views: 187, likes: 31, replies: 10 },
        '2': { views: 95, likes: 12, replies: 4 },
        '3': { views: 267, likes: 38, replies: 15 },
        '4': { views: 143, likes: 21, replies: 7 },
        '5': { views: 221, likes: 33, replies: 11 }
      };

      const stats = fixedStats[item.id as keyof typeof fixedStats] || { 
        views: Math.floor(Math.random() * 250) + 30, 
        likes: Math.floor(Math.random() * 60) + 5, 
        replies: Math.floor(Math.random() * 20) + 1 
      };

      posts.push({
        id: `team-${item.id}`,
        title: item.name,
        category: "组队中心-寻找团队",
        categoryType: "team",
        author: item.leader,
        avatar: item.leaderAvatar,
        time: formatTimeDifference(item.createdAt),
        replies: stats.replies,
        likes: stats.likes,
        views: stats.views,
        isHot: item.isUrgent
      });
    });

    return posts;
  };

  // 格式化时间差
  const formatTimeDifference = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "今天";
    } else if (diffDays === 1) {
      return "1天前";
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months}个月前`;
    }
  };

  // 排序帖子
  const sortPosts = (posts: any[], sortBy: string) => {
    const sortedPosts = [...posts];

    switch (sortBy) {
      case 'time':
        // 按时间排序，这里简化处理，实际应该根据时间字符串转换为时间戳
        return sortedPosts.sort((a, b) => {
          // 简单的时间比较，实际应用中应更精确
          const timeOrder = ["今天", "1小时前", "2小时前", "3小时前", "4小时前", "5小时前", "1天前"];
          const aIndex = timeOrder.findIndex(t => a.time.includes(t.replace(/[0-9]+/, "")));
          const bIndex = timeOrder.findIndex(t => b.time.includes(t.replace(/[0-9]+/, "")));
          return aIndex - bIndex;
        });
      case 'hot':
        // 按热度排序
        return sortedPosts.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
      case 'replies':
        // 按回复数排序
        return sortedPosts.sort((a, b) => b.replies - a.replies);
      case 'likes':
        // 按点赞数排序
        return sortedPosts.sort((a, b) => b.likes - a.likes);
      default:
        return sortedPosts;
    }
  };

  // 处理点赞
  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    let updatedPosts = [...recentPosts];

    if (newLikedPosts.has(postId)) {
      // 取消点赞
      newLikedPosts.delete(postId);
      updatedPosts = updatedPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      );
    } else {
      // 添加点赞
      newLikedPosts.add(postId);
      updatedPosts = updatedPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
    }

    setLikedPosts(newLikedPosts);
    setRecentPosts(updatedPosts);
    // 保存点赞数据到localStorage
    saveLikedPostsToLocalStorage(newLikedPosts);
    // 保存点赞数量到localStorage
    saveLikesCountToLocalStorage(updatedPosts);
  };

  // 处理评论按钮点击
  const handleCommentClick = (postId: string) => {
    if (commentingPostId === postId) {
      setCommentingPostId(null);
      setNewComment('');
    } else {
      setCommentingPostId(postId);
      setNewComment('');
    }
  };

  // 发送评论
  const handleSendComment = (postId: string) => {
    if (!newComment.trim()) return;

    const commentId = `comment-${Date.now()}`;
    const newCommentObj = {
      id: commentId,
      text: newComment,
      author: "当前用户", // 实际应用中应该是登录用户
      time: "刚刚"
    };

    const updatedComments = { ...comments };
    if (!updatedComments[postId]) {
      updatedComments[postId] = [];
    }
    updatedComments[postId].push(newCommentObj);

    setComments(updatedComments);
    setNewComment('');

    // 保存评论数据到localStorage
    saveCommentsToLocalStorage(updatedComments);

    // 更新帖子的回复数
    const updatedPosts = recentPosts.map(post => 
      post.id === postId ? { ...post, replies: post.replies + 1 } : post
    );
    setRecentPosts(updatedPosts);
  };

  // 删除评论
  const handleDeleteComment = (postId: string, commentId: string) => {
    const updatedComments = { ...comments };
    if (updatedComments[postId]) {
      updatedComments[postId] = updatedComments[postId].filter(comment => comment.id !== commentId);
      setComments(updatedComments);

      // 保存评论数据到localStorage
      saveCommentsToLocalStorage(updatedComments);

      // 更新帖子的回复数
      const updatedPosts = recentPosts.map(post => 
        post.id === postId ? { ...post, replies: post.replies - 1 } : post
      );
      setRecentPosts(updatedPosts);
    }
  };

  const hotTopics = [
    { name: "期末复习", count: 156 },
    { name: "前端开发", count: 89 },
    { name: "实习招聘", count: 76 },
    { name: "课程作业", count: 65 },
    { name: "社团活动", count: 54 }
  ];

  return (
    <div className="space-y-6 overflow-hidden">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">欢迎来到CityU学生资源论坛！</h1>
        <p className="text-blue-100">在这里分享学术资源、寻找项目伙伴、交流学习心得</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最新帖子 */}
        <Card className="lg:col-span-2 h-[400px] flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                最新动态
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="academic">学术资源</SelectItem>
                    <SelectItem value="recruitment">项目招募</SelectItem>
                    <SelectItem value="team">组队中心</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">最新发布</SelectItem>
                    <SelectItem value="hot">最热讨论</SelectItem>
                    <SelectItem value="replies">回复最多</SelectItem>
                    <SelectItem value="likes">点赞最多</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto pr-2 pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{maxHeight: '350px', marginTop: '0'}}>
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button 
                        onClick={() => handlePostClick(post)}
                        className="font-medium truncate text-left hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {post.title}
                      </button>
                      {post.isHot && <Badge variant="destructive" className="text-xs">热门</Badge>}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{post.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span>{post.time}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </div>
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 ${likedPosts.has(post.id) ? 'text-red-500' : ''}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button 
                        onClick={() => handleCommentClick(post.id)}
                        className={`flex items-center gap-1 ${commentingPostId === post.id ? 'text-blue-500' : ''}`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        {post.replies}
                      </button>
                    </div>

                    {/* 评论输入框和评论列表 */}
                    {commentingPostId === post.id && (
                      <div className="mt-3 space-y-3">
                        {/* 评论输入框 */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="写下你的评论..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                          />
                          <button
                            onClick={() => handleSendComment(post.id)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                          >
                            <Send className="h-4 w-4" />
                            发送
                          </button>
                        </div>

                        {/* 评论列表 */}
                        {comments[post.id] && comments[post.id].length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {comments[post.id].map((comment) => (
                              <div key={comment.id} className="bg-gray-50 p-2 rounded-md text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">{comment.author}</span>
                                  <span className="text-xs text-gray-500">{comment.time}</span>
                                </div>
                                <p className="mt-1">{comment.text}</p>
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                >
                                  <X className="h-3 w-3" />
                                  删除
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">正在加载数据...</div>
            )}
          </CardContent>
        </Card>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 热门搜索 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                热门搜索
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hotTopics.map((topic, index) => (
                <div key={topic.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    <span className="text-sm">{topic.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {topic.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 快速入口 */}
          <Card>
            <CardHeader>
              <CardTitle>快速入口</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1"
                onClick={() => handleQuickAccessClick('academic-resources')}
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">学术资源</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1"
                onClick={() => handleQuickAccessClick('recruitment')}
              >
                <Briefcase className="h-5 w-5" />
                <span className="text-xs">项目招募</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1"
                onClick={() => handleQuickAccessClick('team-center')}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">组队中心</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1"
                onClick={() => handleQuickAccessClick('chat')}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">消息中心</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
