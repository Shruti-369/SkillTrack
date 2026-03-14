import { Link } from 'react-router-dom';
import { Flame, Target, Zap, Plus, ChevronRight, Activity, TrendingUp, TrendingDown, Minus, Lightbulb, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useSkills } from '../lib/SkillContext';
import { useAppContext } from '../lib/AppContext';
import { startOfWeek, isAfter } from 'date-fns';
import {
  getMomentum,
  getConsistencyScore,
  getLevel,
  getDashboardInsights,
  getSmartRecommendations,
  friendActivity,
} from '../lib/analytics';

// ─── Momentum chip ────────────────────────────────────────────────────────────
function MomentumChip({ skill }) {
  const { direction, percent } = getMomentum(skill);
  if (direction === 'up') return (
    <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
      <TrendingUp className="w-3 h-3" /> +{percent}%
    </span>
  );
  if (direction === 'down') return (
    <span className="flex items-center gap-0.5 text-[11px] font-medium text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
      <TrendingDown className="w-3 h-3" /> −{percent}%
    </span>
  );
  return (
    <span className="flex items-center gap-0.5 text-[11px] font-medium text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> Stable
    </span>
  );
}

// ─── Mini consistency ring ────────────────────────────────────────────────────
function MiniRing({ score }) {
  const r = 10, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : '#f59e0b';
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r={r} fill="none" stroke="#27272a" strokeWidth="3" />
      <circle cx="13" cy="13" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 13 13)" />
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const { skills } = useSkills();
  const { users, currentUser } = useAppContext();
  
  const today = new Date();
  const startOfCurrWeek = startOfWeek(today);

  let totalWeeklyGoal = 0;
  let totalCompletedThisWeek = 0;

  const enrichedSkills = skills.map((skill) => {
    totalWeeklyGoal += Number(skill.weeklyGoal);
    const completedThisWeek = skill.logs
      .filter((log) => !isAfter(startOfCurrWeek, new Date(log.date)))
      .reduce((sum, log) => sum + Number(log.hours), 0);
    totalCompletedThisWeek += completedThisWeek;
    let xp = skill.logs.reduce((sum, log) => sum + Number(log.hours), 0) * 25;
    if (skill.progress > 0) xp += skill.progress * 50;
    return { ...skill, completed: completedThisWeek, streak: Math.floor(skill.logs.length / 7), xp };
  });

  const weeklyProgress = totalWeeklyGoal > 0
    ? Math.min(Math.round((totalCompletedThisWeek / totalWeeklyGoal) * 100), 100)
    : 0;

  const stats = {
    streak: Math.max(...enrichedSkills.map(s => s.streak), 12),
    skills: skills.length,
    weeklyProgress,
  };

  const insights = getDashboardInsights(skills);
  const recommendations = getSmartRecommendations(skills);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Welcome back, Alex.</h1>
          <p className="text-zinc-400 text-sm">Here's your skill growth overview for this week.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Link to="/skills/add">
            <Plus className="w-4 h-4 mr-2" />Add New Skill
          </Link>
        </Button>
      </div>

      {/* Insight banner — slim, non-intrusive */}
      {insights.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/5 border border-blue-500/15">
          <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-sm text-zinc-400">{insights.join('  ·  ')}</p>
        </div>
      )}

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Best Streak</p>
              <h3 className="text-2xl font-bold text-white">{stats.streak} Days</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Active Skills</p>
              <h3 className="text-2xl font-bold text-white">{stats.skills}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Weekly Goal Status</p>
              <h3 className="text-2xl font-bold text-white">{stats.weeklyProgress}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills section — ORIGINAL 2-column interactive grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Skills</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/analytics">View all analytics <ChevronRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enrichedSkills.map(skill => {
            const consistency = getConsistencyScore(skill);
            const { level } = getLevel(skill.xp);
            return (
              <Card key={skill.id} className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors group">
                <Link to={`/skills/${skill.id}`}>
                  <CardContent className="p-6">
                    {/* Title row */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                            {skill.name}
                          </h3>
                          {/* Level */}
                          <span className="text-[11px] font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-full border border-zinc-700">
                            Lv {level}
                          </span>
                          {/* Momentum */}
                          <MomentumChip skill={skill} />
                          {/* Streak flame */}
                          {skill.streak >= 5 && (
                            <span className="flex items-center text-[11px] font-medium text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                              <Flame className="w-3 h-3 mr-0.5" /> {skill.streak}d
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">{skill.category} · {skill.xp.toLocaleString()} XP</p>
                      </div>
                      {/* Consistency ring + weekly hours */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-0.5">
                          <MiniRing score={consistency} />
                          <span className="text-[10px] text-zinc-600">{consistency}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-zinc-300">{skill.completed} / {skill.weeklyGoal} hrs</p>
                          <p className="text-xs text-zinc-500">this week</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Overall Progress</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${skill.progress}%` }} />
                      </div>
                    </div>

                    {/* Behind schedule warning */}
                    {skill.completed < skill.weeklyGoal && (
                      <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center text-xs text-zinc-400 gap-2">
                        <Activity className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>
                          {(skill.weeklyGoal - skill.completed).toFixed(1)}h behind schedule — practice today to stay on track.
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Recommendations + Friend Feed side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" /> Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="text-xs text-zinc-400 leading-relaxed border-l-2 border-zinc-700 pl-3">
                  {rec}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Friend Activity Feed */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Friend Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.filter(u => currentUser.friends.includes(u.id)).map((friend, i) => {
                const actions = [
                  `completed a ${friend.streak} day streak.`,
                  `practiced for ${Math.floor(friend.weeklyHours / 3)} hours today.`,
                  `earned ${Math.floor(friend.xp / 100) * 100} XP recently.`
                ];
                return (
                  <div key={friend.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0">
                      {friend.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-300 leading-snug">
                        <span className="font-semibold text-white">{friend.username}</span> {actions[i % actions.length]}
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">{(i + 1) * 2} hours ago</p>
                    </div>
                  </div>
                );
              })}
              {currentUser.friends.length === 0 && (
                <p className="text-xs text-zinc-500 italic">No recent friend activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
