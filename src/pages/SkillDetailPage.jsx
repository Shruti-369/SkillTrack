import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Flame, Target, Award, ListPlus,
  ExternalLink, BookmarkPlus, Trophy, Plus, X, Trash2,
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { format, subDays, startOfWeek, isAfter } from 'date-fns';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { HeatmapGraph } from '../components/ui/heatmap';
import { useSkills } from '../lib/SkillContext';
import {
  getLevel, getPrediction, getConsistencyScore,
  getMomentum, getBurnoutAlerts, getAchievements
} from '../lib/analytics';

// ─── Consistency Circle ───────────────────────────────────────────────────────
function ConsistencyGauge({ score }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center z-10">
          <span className="text-xl font-bold text-white">{score}</span>
          <span className="text-[10px] text-zinc-500 block -mt-1">/ 100</span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 font-medium">Consistency</p>
    </div>
  );
}

// ─── Momentum Badge ───────────────────────────────────────────────────────────
function MomentumBadge({ skill }) {
  const m = getMomentum(skill);
  if (m.direction === 'up') return (
    <div className="flex items-center gap-2 text-sm text-emerald-400">
      <TrendingUp className="w-4 h-4" />
      <span>Up {m.percent}% vs last week ({m.thisWeek}h → {m.thisWeek}h)</span>
    </div>
  );
  if (m.direction === 'down') return (
    <div className="flex items-center gap-2 text-sm text-red-400">
      <TrendingDown className="w-4 h-4" />
      <span>Down {m.percent}% vs last week</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500">
      <Minus className="w-4 h-4" />
      <span>Stable pace this week</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SkillDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { skills, addLog, addResource, deleteSkill } = useSkills();

  const skill = skills.find(s => s.id === id);

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isResourceOpen, setIsResourceOpen] = useState(false);
  const [logHours, setLogHours] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  if (!skill) {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24 text-center">
        <h2 className="text-2xl text-white font-bold mb-4">Skill Not Found</h2>
        <Button onClick={() => navigate('/dashboard')} className="bg-blue-600">Back to Dashboard</Button>
      </div>
    );
  }

  const logs = skill.logs;
  const resources = skill.resources;
  const today = new Date();

  // ─── Derived Metrics ────────────────────────────────────────────────────────
  const totalHours = logs.reduce((sum, log) => sum + Number(log.hours), 0);
  const weeklyGoal = Number(skill.weeklyGoal);
  const startOfCurrWeek = startOfWeek(today);
  const completedThisWeek = logs
    .filter(log => !isAfter(startOfCurrWeek, new Date(log.date)))
    .reduce((sum, log) => sum + Number(log.hours), 0);

  let xpEarned = totalHours * 25;
  if (skill.progress > 0) xpEarned += skill.progress * 50;

  const { level, currentXp, nextThreshold } = getLevel(xpEarned);
  const consistencyScore = getConsistencyScore(skill);
  const prediction = getPrediction(skill);
  const burnoutAlerts = getBurnoutAlerts(skill).filter(a => !dismissedAlerts.includes(a));
  const achievements = getAchievements(skill);

  // ─── Heatmap ────────────────────────────────────────────────────────────────
  const heatmapData = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
      const dayLogs = logs.filter(l => l.date === dateStr);
      const dayHours = dayLogs.reduce((sum, l) => sum + Number(l.hours), 0);
      let lv = 0;
      if (dayHours > 0) lv = 1;
      if (dayHours >= 2) lv = 2;
      if (dayHours >= 4) lv = 3;
      if (dayHours >= 6) lv = 4;
      return { date: dateStr, level: lv, hours: dayHours };
    });
  }, [logs]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!logHours) return;
    addLog(id, { date: format(today, 'yyyy-MM-dd'), hours: Number(logHours), notes: logNotes || 'Practice session' });
    setLogHours(''); setLogNotes(''); setIsLogOpen(false);
  };

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    if (!resourceTitle || !resourceUrl) return;
    addResource(id, { title: resourceTitle, url: resourceUrl });
    setResourceTitle(''); setResourceUrl(''); setIsResourceOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you certain you want to delete this skill? This cannot be undone.')) {
      deleteSkill(id); navigate('/dashboard');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="mb-0">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />Dashboard
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="destructive" onClick={handleDelete} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
            <Trash2 className="w-4 h-4 mr-2" />Delete Skill
          </Button>
          <Button onClick={() => setIsLogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
            <ListPlus className="w-4 h-4 mr-2" />Log Practice
          </Button>
        </div>
      </div>

      {/* Burnout Alerts */}
      {burnoutAlerts.map((alert, i) => (
        <div key={i} className="flex items-start justify-between gap-4 px-4 py-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-300">{alert}</p>
          </div>
          <button onClick={() => setDismissedAlerts(d => [...d, alert])} className="text-zinc-600 hover:text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Skill Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">{skill.name}</h1>
            <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/20">{skill.level}</span>
            <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-md border border-zinc-700">Lv {level}</span>
          </div>
          <MomentumBadge skill={skill} />
          {prediction && (
            <p className="text-sm text-zinc-400 mt-2 italic">💡 {prediction}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <p className="text-zinc-400 text-sm font-medium">Streak</p>
            <h3 className="text-2xl font-bold text-white mt-1">{Math.floor(logs.length / 7)} Days</h3>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <Target className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-zinc-400 text-sm font-medium">Weekly Goal</p>
            <h3 className="text-2xl font-bold text-white mt-1">{completedThisWeek} / {weeklyGoal}h</h3>
          </CardContent>
        </Card>

        {/* XP with Level */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <Award className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-zinc-400 text-sm font-medium">Level {level} • XP</p>
              <h3 className="text-2xl font-bold text-white mt-1">{currentXp}<span className="text-sm text-zinc-500"> / {nextThreshold}</span></h3>
            </div>
            <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${(currentXp / nextThreshold) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Consistency Gauge */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex items-center justify-center">
            <ConsistencyGauge score={consistencyScore} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Heatmap + Achievements */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Contribution History</CardTitle>
              <CardDescription>Daily practice record over the last few months</CardDescription>
            </CardHeader>
            <CardContent>
              <HeatmapGraph data={heatmapData} />
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg text-white">Achievements</CardTitle>
                <CardDescription>Badges earned for consistency and effort</CardDescription>
              </div>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {achievements.map(badge => (
                  <div
                    key={badge.id}
                    title={badge.description}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      badge.unlocked
                        ? 'bg-zinc-900 border-zinc-700'
                        : 'bg-zinc-950 border-zinc-800/60 opacity-40 grayscale'
                    }`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[11px] font-medium text-zinc-300 text-center leading-tight">{badge.label}</span>
                    {badge.unlocked && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* End Goal */}
          <Card className="bg-zinc-950 border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Target className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white">End Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-zinc-100 font-medium text-lg">{skill.endGoal || 'Master this skill'}</p>
                <p className="text-zinc-500 text-sm mt-1">
                  Target: {skill.targetDate ? format(new Date(skill.targetDate), 'MMM dd, yyyy') : 'No date set'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400">
                  <span>Progress</span>
                  <span>{skill.progress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${skill.progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
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

          {/* Resources */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg text-white">Resources</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsResourceOpen(true)}>
                <Plus className="w-4 h-4 text-zinc-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">No resources yet.</p>
                ) : resources.map((res) => (
                  <a key={res.id} href={res.url} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors group">
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

      {/* Log Practice Dialog */}
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
              <Input type="number" min="0.5" step="0.5" placeholder="e.g. 2" value={logHours} onChange={(e) => setLogHours(e.target.value)} required autoFocus />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">What did you learn? (Notes)</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                placeholder="Briefly describe what you worked on..."
                value={logNotes} onChange={(e) => setLogNotes(e.target.value)} required
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">Save Log</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog */}
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
              <Input placeholder="e.g. Official React Docs" value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} required autoFocus />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">URL</label>
              <Input type="url" placeholder="https://" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} required />
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
