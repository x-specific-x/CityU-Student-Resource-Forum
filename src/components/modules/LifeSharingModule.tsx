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
  Heart, 
  Plus, 
  Search,
  Camera,
  MapPin,
  ThumbsUp,
  MessageCircle,
  Share2,
  Clock,
  Utensils,
  Home,
  ShoppingBag,
  Gamepad2,
  Music,
  Plane,
  Book,
  Coffee,
  Star,
  MoreHorizontal,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export function LifeSharingModule() {
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('time');
  const [filterBy, setFilterBy] = useState('all');
  
  const posts = [
    {
      id: 1,
      author: "张小美",
      avatar: "张",
      major: "艺术设计",
      time: "2小时前",
      category: "美食推荐",
      title: "发现学校附近超棒的泰式料理！",
      content: "今天和室友去试了学校旁边新开的泰式餐厅，pad thai和冬阴功汤都超级正宗！价格也很学生友好，人均50港币就能吃得很满足～推荐给大家！",
      images: ["thai-food.jpg"],
      likes: 24,
      comments: 8,
      shares: 3,
      location: "CityU附近",
      tags: ["美食", "泰式料理", "学生优惠"],
      isLiked: false
    },
    {
      id: 2,
      author: "李运动",
      avatar: "李",
      major: "体育科学",
      time: "5小时前",
      category: "运动健身",
      title: "晨跑打卡第30天！",
      content: "坚持晨跑一个月了！从最开始的3公里到现在的8公里，体重减了5斤，精神状态也好了很多。有想一起晨跑的同学吗？每天早上6:30在体育馆集合～",
      images: ["running-track.jpg"],
      likes: 45,
      comments: 12,
      shares: 6,
      location: "CityU体育馆",
      tags: ["运动", "晨跑", "减肥", "寻找跑友"],
      isLiked: true
    },
    {
      id: 3,
      author: "王文艺",
      avatar: "王",
      major: "文学创作",
      time: "1天前",
      category: "文化活动",
      title: "周末去了太空馆看星空展",
      content: "香港太空馆的星空展真的太震撼了！躺在那里看着星空投影，感觉整个人都被治愈了。还学到了很多天文知识，强烈推荐给学弟学妹们！门票学生价很划算～",
      images: ["space-museum.jpg", "stars.jpg"],
      likes: 32,
      comments: 15,
      shares: 8,
      location: "香港太空馆",
      tags: ["文化", "太空馆", "学生优惠", "周末活动"],
      isLiked: false
    },
    {
      id: 4,
      author: "陈购物",
      avatar: "陈",
      major: "商业管理",
      time: "2天前",
      category: "购物分享",
      title: "淘到宝！二手教科书超级便宜",
      content: "在学校的二手书市场淘到了下学期需要的所有教科书，比新书便宜了一半！书的品相也很好，有些还有学长学姐的笔记，超值！推荐大家多逛逛二手市场～",
      images: ["textbooks.jpg"],
      likes: 28,
      comments: 6,
      shares: 12,
      location: "CityU二手市场",
      tags: ["二手书", "省钱", "教科书", "购物攻略"],
      isLiked: false
    }
  ];

  const categories = [
    { id: 'all', name: '全部', icon: Heart },
    { id: 'food', name: '美食推荐', icon: Utensils },
    { id: 'accommodation', name: '住宿分享', icon: Home },
    { id: 'shopping', name: '购物攻略', icon: ShoppingBag },
    { id: 'entertainment', name: '娱乐休闲', icon: Gamepad2 },
    { id: 'culture', name: '文化活动', icon: Music },
    { id: 'travel', name: '旅行游记', icon: Plane },
    { id: 'study', name: '学习生活', icon: Book }
  ];

  const hotTopics = [
    { name: "期末考试加油", count: 156, trend: "up" },
    { name: "香港美食探店", count: 89, trend: "up" },
    { name: "宿舍生活", count: 76, trend: "stable" },
    { name: "兼职推荐", count: 65, trend: "up" },
    { name: "周末活动", count: 54, trend: "down" }
  ];

  const toggleLike = (postId: number) => {
    // 这里可以实现点赞逻辑
    console.log('Toggle like for post:', postId);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">生活分享</h1>
          <p className="text-muted-foreground">分享校园生活，发现生活之美</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              发布动态
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>分享你的生活</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">分类</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">美食推荐</SelectItem>
                    <SelectItem value="accommodation">住宿分享</SelectItem>
                    <SelectItem value="shopping">购物攻略</SelectItem>
                    <SelectItem value="entertainment">娱乐休闲</SelectItem>
                    <SelectItem value="culture">文化活动</SelectItem>
                    <SelectItem value="travel">旅行游记</SelectItem>
                    <SelectItem value="study">学习生活</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">标题</label>
                <Input placeholder="给你的分享起个标题" />
              </div>
              <div>
                <label className="text-sm font-medium">内容</label>
                <Textarea placeholder="分享你的经历、感受或推荐..." rows={5} />
              </div>
              <div>
                <label className="text-sm font-medium">位置（可选）</label>
                <Input placeholder="分享发生的地点" />
              </div>
              <div>
                <label className="text-sm font-medium">标签</label>
                <Input placeholder="用空格分隔多个标签，如：美食 便宜 推荐" />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">点击上传图片（最多9张）</p>
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
          placeholder="搜索生活分享、美食推荐、活动信息..."
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 主内容区域 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 分类标签 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
              {categories.slice(0, 8).map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex flex-col items-center gap-1 p-2 text-xs"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {/* 筛选和排序 */}
              <div className="flex items-center gap-3 mb-6">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-36">
                    <Filter className="h-4 w-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部话题</SelectItem>
                    <SelectItem value="study">学习相关</SelectItem>
                    <SelectItem value="food">美食推荐</SelectItem>
                    <SelectItem value="housing">住宿分享</SelectItem>
                    <SelectItem value="shopping">购物攻略</SelectItem>
                    <SelectItem value="activity">活动推荐</SelectItem>
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
                    <SelectItem value="likes">点赞最多</SelectItem>
                    <SelectItem value="comments">评论最多</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    {/* 发布者信息 */}
                    <div className="flex items-start space-x-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-pink-100 text-pink-700">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{post.author}</h3>
                          <Badge variant="outline" className="text-xs">
                            {post.major}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{post.time}</span>
                          {post.location && (
                            <>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{post.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* 内容 */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">{post.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* 图片（如果有） */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          {post.images.map((image, index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <Camera className="h-8 w-8 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 标签 */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 互动按钮 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Coffee className="h-4 w-4 mr-1" />
                        关注
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 热门话题 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5" />
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
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {topic.count}
                    </Badge>
                    {topic.trend === 'up' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 推荐关注 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">推荐关注</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "美食探索家", followers: "1.2k", category: "美食博主" },
                { name: "校园生活达人", followers: "856", category: "生活分享" },
                { name: "省钱小能手", followers: "2.1k", category: "购物攻略" }
              ].map((user) => (
                <div key={user.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.followers} 关注者</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    关注
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 生活指南 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">生活指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "新生入学必备清单",
                "香港交通攻略",
                "学生优惠大全",
                "校园周边美食地图",
                "期末复习小贴士"
              ].map((tip) => (
                <div key={tip} className="p-2 bg-blue-50 rounded text-sm text-blue-800 cursor-pointer hover:bg-blue-100">
                  {tip}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}