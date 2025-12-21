import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-6 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LearningPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-4">
        {/* Alert Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview Card Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Tabs Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CourseCatalogSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full mx-auto" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
          <div className="flex justify-center gap-4 mt-8">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>

      {/* Language Grid */}
      <div className="container mx-auto px-6 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-16 mx-auto mb-4" />
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


