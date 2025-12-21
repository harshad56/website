import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  Code, 
  Users, 
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  Filter,
  Tag
} from "lucide-react";

const BlogResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: BookOpen },
    { id: "tutorials", name: "Tutorials", icon: Video },
    { id: "articles", name: "Articles", icon: FileText },
    { id: "code-snippets", name: "Code Snippets", icon: Code },
    { id: "interviews", name: "Interviews", icon: Users },
  ];

  const articles = [
    {
      id: 1,
      title: "Mastering React Hooks: A Comprehensive Guide",
      excerpt: "Learn how to use React Hooks effectively to build modern, functional components with state management and side effects.",
      category: "tutorials",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "8 min read",
      views: 12450,
      likes: 342,
      tags: ["React", "JavaScript", "Frontend"],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "The Future of Web Development: What to Expect in 2024",
      excerpt: "Explore the latest trends and technologies that will shape the future of web development, from AI integration to new frameworks.",
      category: "articles",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "12 min read",
      views: 8920,
      likes: 256,
      tags: ["Web Development", "Trends", "Technology"],
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 3,
      title: "10 Essential Python Libraries for Data Science",
      excerpt: "Discover the most important Python libraries that every data scientist should know, from pandas to scikit-learn.",
      category: "tutorials",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      readTime: "15 min read",
      views: 15670,
      likes: 489,
      tags: ["Python", "Data Science", "Machine Learning"],
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Building Scalable Microservices with Go",
      excerpt: "Learn how to design and implement scalable microservices using Go, including best practices and common pitfalls.",
      category: "tutorials",
      author: "David Kim",
      date: "2024-01-08",
      readTime: "20 min read",
      views: 7230,
      likes: 198,
      tags: ["Go", "Microservices", "Backend"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Interview with a Senior Software Engineer at Google",
      excerpt: "Get insights into the hiring process, technical challenges, and career advice from a senior engineer at one of the world's top tech companies.",
      category: "interviews",
      author: "Alex Thompson",
      date: "2024-01-05",
      readTime: "10 min read",
      views: 18920,
      likes: 567,
      tags: ["Career", "Interview", "Google"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Optimizing JavaScript Performance: Tips and Tricks",
      excerpt: "Learn advanced techniques to optimize your JavaScript code for better performance and user experience.",
      category: "code-snippets",
      author: "Lisa Wang",
      date: "2024-01-03",
      readTime: "6 min read",
      views: 11230,
      likes: 234,
      tags: ["JavaScript", "Performance", "Optimization"],
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Blog & Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the latest tutorials, articles, and insights from our expert instructors and industry professionals.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles, tutorials, and resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Articles */}
        {selectedCategory === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4">Featured</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <span className="text-sm text-muted-foreground">{article.date}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {article.likes}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === "all" ? "All Articles" : `${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground">{article.date}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest articles, tutorials, and resources delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogResources; 