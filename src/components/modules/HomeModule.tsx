import { useState } from 'react';
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
  ArrowUpDown
} from 'lucide-react';

export function HomeModule() {

  
  const [sortBy, setSortBy] = useState('time');
  const [filterBy, setFilterBy] = useState('all');

  const recentPosts = [
    {
      id: 1,
      title: "CS3104数据结构课程讨论群招新",
      category: "学术资源",
      author: "李明",
      avatar: "LM",
      time: "2小时前",
      replies: 23,
      likes: 45,
      views: 156,
      isHot: true
    },
    {
      id: 2,
      title: "寻找前端开发小组成员，一起做毕业项目",
      category: "组队中心",
      author: "王小红",
      avatar: "王",
      time: "3小时前",
      replies: 12,
      likes: 28,
      views: 89,
      isHot: false
    },
    {
      id: 3,
      title: "CityU学生会技术部招募志愿者",
      category: "项目/社团招募",
      author: "张伟",
      avatar: "张",
      time: "5小时前",
      replies: 34,
      likes: 67,
      views: 234,
      isHot: true
    },
    {
      id: 4,
      title: "分享一些好吃的食堂推荐",
      category: "生活分享",
      author: "陈美丽",
      avatar: "陈",
      time: "1天前",
      replies: 45,
      likes: 89,
      views: 345,
      isHot: false
    }
  ];

  const hotTopics = [
    { name: "期末复习", count: 156 },
    { name: "前端开发", count: 89 },
    { name: "实习招聘", count: 76 },
    { name: "课程作业", count: 65 },
    { name: "社团活动", count: 54 }
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">欢迎来到CityU学生资源论坛！</h1>
        <p className="text-blue-100">在这里分享学术资源、寻找项目伙伴、交流学习心得</p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最新帖子 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                最新动态
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="academic">学术资源</SelectItem>
                    <SelectItem value="recruitment">项目招募</SelectItem>
                    <SelectItem value="team">组队中心</SelectItem>
                    <SelectItem value="life">生活分享</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
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
          <CardContent className="space-y-4">
            {recentPosts.map((post) => (
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
                      <h3 className="font-medium truncate">{post.title}</h3>
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
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 热门话题 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                热门话题
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
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">学术资源</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <Briefcase className="h-5 w-5" />
                <span className="text-xs">项目招募</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <Users className="h-5 w-5" />
                <span className="text-xs">组队中心</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <Heart className="h-5 w-5" />
                <span className="text-xs">生活分享</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}