import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Target, Award, ListPlus, ExternalLink, BookmarkPlus, Trophy, Plus, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isSameDay, startOfWeek, isAfter } from 'date-fns';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { HeatmapGraph } from '../components/ui/heatmap';

// Initial Mock Data
const today = new Date();
const initialLogs = [
  { id: 1, date: format(subDays(today, 0), 'yyyy-MM-dd'), hours: 2, notes: 'Built Dashboard UI' },
  { id: 2, date: format(subDays(today, 1), 'yyyy-MM-dd'), hours: 1, notes: 'Read React Docs' },
  { id: 3, date: format(subDays(today, 2), 'yyyy-MM-dd'), hours: 3, notes: 'Refactored State' },
];

const initialResources = [
  { id: 1, title: 'React Official Docs', url: 'https://react.dev' },
  { id: 2, title: 'Framer Motion Guide', url: 'https://framer.com/motion' }
];

export function SkillDetailPage() {
  const { id } = useParams();

  // State
  const [logs, setLogs] = useState(initialLogs);
  const [resources, setResources] = useState(initialResources);

  // Dialog States
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isResourceOpen, setIsResourceOpen] = useState(false);

  // Form States
  const [logHours, setLogHours] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  // Derived Metrics
  const totalHours = logs.reduce((sum, log) => sum + Number(log.hours), 0) + 136; // offset for mock history

  const weeklyGoal = 10;
  const startOfCurrWeek = startOfWeek(today);
  const completedThisWeek = logs
    .filter(log => !isAfter(startOfCurrWeek, new Date(log.date)))
    .reduce((sum, log) => sum + Number(log.hours), 0);

  const xpEarned = totalHours * 25; // 25 XP per hour

  // Calculate dynamic heatmap
  const heatmapData = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
      // Find if we have a log for this day
      const dayLogs = logs.filter(l => l.date === dateStr);
      const dayHours = dayLogs.reduce((sum, l) => sum + Number(l.hours), 0);

      let level = 0;
      if (dayHours > 0) level = 1;
      if (dayHours >= 2) level = 2;
      if (dayHours >= 4) level = 3;
      if (dayHours >= 6) level = 4;

      return { date: dateStr, level, hours: dayHours };
    });
  }, [logs]);

  // Handlers
  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!logHours) return;

    const newLog = {
      id: Date.now(),
      date: format(today, 'yyyy-MM-dd'),
      hours: Number(logHours),
      notes: logNotes || 'Practice session'
    };

    setLogs([newLog, ...logs]);
    setLogHours('');
    setLogNotes('');
    setIsLogOpen(false);
  };

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    if (!resourceTitle || !resourceUrl) return;

    const newRes = {
      id: Date.now(),
      title: resourceTitle,
      url: resourceUrl
    };

    setResources([...resources, newRes]);
    setResourceTitle('');
    setResourceUrl('');
    setIsResourceOpen(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="mb-0">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <Button onClick={() => setIsLogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
          <ListPlus className="w-4 h-4 mr-2" />
          Log Practice
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">React Development</h1>
            <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/20">Intermediate</span>
          </div>
          <p className="text-zinc-400">Mastering modern React, hooks, and performance optimization.</p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <Clock className="w-5 h-5 text-zinc-500 mb-2" />
            <p className="text-zinc-400 text-sm font-medium">Total Hours</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalHours}h</h3>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Flame className="w-24 h-24 text-orange-500" />
          </div>
          <CardContent className="p-6 relative">
            <Flame className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-zinc-400 text-sm font-medium">Current Streak</p>
            <h3 className="text-2xl font-bold text-white mt-1">12 Days</h3>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <Target className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-zinc-400 text-sm font-medium">Weekly Goal</p>
            <h3 className="text-2xl font-bold text-white mt-1">{completedThisWeek} / {weeklyGoal}h</h3>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <Award className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-zinc-400 text-sm font-medium">XP Earned</p>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mt-1">
                {xpEarned.toLocaleString()}
              </h3>
            </div>
            <div className="mt-4 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${Math.min((xpEarned % 1000) / 10, 100)}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph and Heatmap Area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Heatmap Section */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Contribution History</CardTitle>
              <CardDescription>Daily practice record over the last few months</CardDescription>
            </CardHeader>
            <CardContent>
              <HeatmapGraph data={heatmapData} />
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg text-white">Achievements</CardTitle>
                <CardDescription>Badges earned for consistency</CardDescription>
              </div>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 text-center">7 Day<br />Streak</span>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 text-center">100 Hours<br />Reached</span>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-lg bg-zinc-900 border border-zinc-800 opacity-50 grayscale">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Target className="w-5 h-5 text-zinc-500" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 text-center">Goal<br />Crusher</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="bg-zinc-950 border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Target className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white">End Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-zinc-100 font-medium text-lg">Build 5 Fullstack Apps</p>
                <p className="text-zinc-500 text-sm mt-1">Target: Dec 31, 2026</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400">
                  <span>Progress</span>
                  <span>40%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">No practice logged yet.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex justify-between items-start text-sm border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-zinc-200 font-medium">{log.notes}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{log.date === format(today, 'yyyy-MM-dd') ? 'Today' : log.date}</p>
                      </div>
                      <div className="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                        {log.hours}h
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg text-white">Resources</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsResourceOpen(true)}>
                <Plus className="w-4 h-4 text-zinc-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <BookmarkPlus className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">{res.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-400 shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Log Practice Modal */}
      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent>
          <div className="flex justify-between items-start mb-4">
            <DialogHeader>
              <DialogTitle>Log Practice Session</DialogTitle>
              <DialogDescription>Record your learning hours and notes to update your progress.</DialogDescription>
            </DialogHeader>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2" onClick={() => setIsLogOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Hours Practiced</label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 2"
                value={logHours}
                onChange={(e) => setLogHours(e.target.value)}
                required autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">What did you learn? (Notes)</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                placeholder="Briefly describe what you worked on..."
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">Save Log</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Resource Modal */}
      <Dialog open={isResourceOpen} onOpenChange={setIsResourceOpen}>
        <DialogContent>
          <div className="flex justify-between items-start mb-4">
            <DialogHeader>
              <DialogTitle>Add Resource</DialogTitle>
              <DialogDescription>Save a useful link or tutorial for this skill.</DialogDescription>
            </DialogHeader>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2" onClick={() => setIsResourceOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleResourceSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Title</label>
              <Input
                placeholder="e.g. Official React Docs"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                required autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">URL</label>
              <Input
                type="url"
                placeholder="https://"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">Save Resource</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
