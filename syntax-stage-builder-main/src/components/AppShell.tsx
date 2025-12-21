/**
 * Minimal app shell that renders immediately
 * Shows instant feedback while React loads
 */
export const AppShell = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header - shows instantly */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold">CodeAcademy Pro</span>
          </div>
        </div>
      </div>
      
      {/* Minimal content - shows instantly */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
      </div>
    </div>
  );
};


