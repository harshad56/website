import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Heart,
  Reply,
  Send,
  Search,
  Filter
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  participants: number;
  posts: number;
  lastActivity: string;
  category: string;
}

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "All Topics", icon: "🌐" },
    { id: "java", name: "Java", icon: "☕" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "javascript", name: "JavaScript", icon: "⚡" },
    { id: "cpp", name: "C++", icon: "⚙️" },
    { id: "algorithms", name: "Algorithms", icon: "🧮" },
    { id: "projects", name: "Projects", icon: "🚀" },
    { id: "career", name: "Career", icon: "💼" }
  ];

  const mockPosts: Post[] = [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        level: "Expert"
      },
      title: "Best practices for Java memory management",
      content: "I've been working on optimizing memory usage in my Java applications. Here are some key strategies I've found effective...",
      category: "java",
      tags: ["java", "memory", "optimization", "performance"],
      likes: 24,
      replies: 8,
      views: 156,
      createdAt: "2 hours ago"
    },
    {
      id: "2",
      author: {
        name: "Alex Rodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        level: "Intermediate"
      },
      title: "Python vs JavaScript for web development",
      content: "I'm trying to decide between Python (Django/Flask) and JavaScript (Node.js) for my next web project. What are your thoughts?",
      category: "general",
      tags: ["python", "javascript", "web-development", "comparison"],
      likes: 18,
      replies: 12,
      views: 203,
      createdAt: "4 hours ago"
    },
    {
      id: "3",
      author: {
        name: "Emma Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        level: "Beginner"
      },
      title: "Help with my first coding project",
      content: "I'm building a simple calculator app and I'm stuck on implementing the division function. Can anyone help?",
      category: "projects",
      tags: ["beginner", "calculator", "help", "project"],
      likes: 5,
      replies: 15,
      views: 89,
      createdAt: "6 hours ago"
    }
  ];

  const discussions: Discussion[] = [
    {
      id: "1",
      title: "Java Fundamentals",
      description: "Discuss Java basics, OOP concepts, and best practices",
      participants: 234,
      posts: 156,
      lastActivity: "2 hours ago",
      category: "java"
    },
    {
      id: "2",
      title: "Python Data Science",
      description: "Share insights about pandas, numpy, and machine learning",
      participants: 189,
      posts: 203,
      lastActivity: "1 hour ago",
      category: "python"
    },
    {
      id: "3",
      title: "Algorithm Challenges",
      description: "Solve coding problems and discuss different approaches",
      participants: 456,
      posts: 312,
      lastActivity: "30 minutes ago",
      category: "algorithms"
    }
  ];

  const handleLike = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts.",
        variant: "destructive",
      });
      return;
    }
    // In a real app, this would update the database
    toast({
      title: "Post liked!",
      description: "Thanks for your feedback.",
    });
  };

  const handleBookmark = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to bookmark posts.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Post bookmarked!",
      description: "You can find it in your bookmarks.",
    });
  };

  const handleNewPost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create posts.",
        variant: "destructive",
      });
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would create a new post
    toast({
      title: "Post created!",
      description: "Your post has been published successfully.",
    });

    setShowNewPost(false);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("general");
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Community</h1>
              <p className="text-muted-foreground">Connect with fellow learners</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                <Users className="w-4 h-4 mr-1" />
                12.5K members
              </Badge>
              {isAuthenticated && (
                <Button onClick={() => setShowNewPost(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-6">
                {/* Posts */}
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">{post.author.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {post.author.level}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {post.createdAt}
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {post.content}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleLike(post.id)}
                                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                  <Reply className="w-4 h-4" />
                                  <span>{post.replies}</span>
                                </button>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <Eye className="w-4 h-4" />
                                  <span>{post.views}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleBookmark(post.id)}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Bookmark className="w-4 h-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-primary transition-colors">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline">
                            {categories.find(c => c.id === discussion.category)?.icon}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {discussion.category}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                        <p className="text-muted-foreground mb-4">{discussion.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>{discussion.participants} participants</span>
                            <span>{discussion.posts} posts</span>
                          </div>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Share your thoughts with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Enter post title..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  placeholder="Write your post content..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewPost}>
                  <Send className="w-4 h-4 mr-2" />
                  Publish Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Community; 