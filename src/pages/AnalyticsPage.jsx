import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';

const weeklyData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 0 },
];

const categoryData = [
  { name: 'React', value: 45, color: '#3b82f6' },
  { name: 'UI Design', value: 25, color: '#8b5cf6' },
  { name: 'TypeScript', value: 20, color: '#10b981' },
  { name: 'Other', value: 10, color: '#f59e0b' },
];

const streakHistory = [
  { name: 'Jan', streak: 5 },
  { name: 'Feb', streak: 12 },
  { name: 'Mar', streak: 8 },
  { name: 'Apr', streak: 21 },
  { name: 'May', streak: 15 },
  { name: 'Jun', streak: 30 },
];

export function AnalyticsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics</h1>
          <p className="text-zinc-400 text-sm">Deep dive into your learning habits and progress.</p>
        </div>
        <Button variant="outline" className="border-zinc-800 shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">This Week's Focus</CardTitle>
            <CardDescription>Hours practiced per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Skill Distribution</CardTitle>
            <CardDescription>Where you spend your time</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px', zIndex: 100 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 w-full">
              {categoryData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-zinc-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Streak History (Monthly Max)</CardTitle>
            <CardDescription>Your highest streak per month over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streakHistory}>
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <Bar dataKey="streak" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
