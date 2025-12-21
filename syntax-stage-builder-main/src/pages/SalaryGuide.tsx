import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackButton } from "@/components/BackButton";
import { LineChart } from "lucide-react";

const salaryData = [
  { level: "Junior", us: "$98k", eu: "63k", remote: "$82k" },
  { level: "Mid", us: "$142k", eu: "92k", remote: "$118k" },
  { level: "Senior", us: "$182k", eu: "118k", remote: "$150k" }
];

const SalaryGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <div className="bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-lime-500/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Market data</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Salary Guide</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compare compensation bands across regions, seniority levels, and company stages. Updated monthly from public reports and community submissions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Compensation Snapshot</CardTitle>
            <CardDescription>Median total cash (base + bonus) by region.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>United States</TableHead>
                  <TableHead>Europe</TableHead>
                  <TableHead>Remote-first</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryData.map((row) => (
                  <TableRow key={row.level}>
                    <TableCell className="font-medium">{row.level}</TableCell>
                    <TableCell>{row.us}</TableCell>
                    <TableCell>{row.eu}</TableCell>
                    <TableCell>{row.remote}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adjust filters</CardTitle>
            <CardDescription>Change location, role, or company stage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="location">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="role">Role</TabsTrigger>
                <TabsTrigger value="stage">Stage</TabsTrigger>
              </TabsList>
              <TabsContent value="location" className="pt-4 text-sm text-muted-foreground">
                San Francisco + NYC pay a ~18% premium over national averages.
              </TabsContent>
              <TabsContent value="role" className="pt-4 text-sm text-muted-foreground">
                Data + ML roles command the highest signing bonuses in 2025.
              </TabsContent>
              <TabsContent value="stage" className="pt-4 text-sm text-muted-foreground">
                Series D+ companies offer higher base, startups lead with equity.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" /> Negotiation Insights
            </CardTitle>
            <CardDescription>Compiled from 2,300 recent offers.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p> Counter-offers add an average of 11% to base salary.</p>
            <p> Remote-first companies are increasing equity refreshers year over year.</p>
            <p> Mentioning competing offers during final stages increases signing bonuses by 22% on average.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalaryGuide;
