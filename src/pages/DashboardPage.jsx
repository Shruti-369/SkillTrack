import { Link } from 'react-router-dom';
import { Flame, Target, Zap, Plus, ChevronRight, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

// Mock data
const stats = {
  streak: 12,
  skills: 4,
  weeklyProgress: 68,
};

const skills = [
  { id: 1, name: 'React', category: 'Development', progress: 62, weeklyGoal: 10, completed: 7, streak: 5, xp: 2450 },
  { id: 2, name: 'UI/UX Design', category: 'Design', progress: 35, weeklyGoal: 5, completed: 5, streak: 12, xp: 1200 },
  { id: 3, name: 'TypeScript', category: 'Development', progress: 80, weeklyGoal: 8, completed: 2, streak: 0, xp: 3800 },
];

export function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Welcome back, Alex.</h1>
          <p className="text-zinc-400 text-sm">Here's your skill growth overview for this week.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Link to="/skills/add">
            <Plus className="w-4 h-4 mr-2" />
            Add New Skill
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Current Streak</p>
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Skills</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/analytics">View all analytics <ChevronRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {skills.map(skill => {
            const isLate = skill.completed < skill.weeklyGoal && stats.weeklyProgress > 80; // mock logic
            return (
              <Card key={skill.id} className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors group">
                <Link to={`/skills/${skill.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">{skill.name}</h3>
                          {skill.streak >= 5 && (
                            <span className="flex items-center text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                              <Flame className="w-3 h-3 mr-1" /> {skill.streak}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">{skill.category} • {skill.xp.toLocaleString()} XP</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-zinc-300">
                          {skill.completed} / {skill.weeklyGoal} hrs
                        </p>
                        <p className="text-xs text-zinc-500">this week</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Overall Progress</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>

                    {skill.completed < skill.weeklyGoal && (
                      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center text-xs text-zinc-400 gap-2">
                         <Activity className="w-3.5 h-3.5 text-zinc-500" />
                         <span>{skill.weeklyGoal - skill.completed} hours behind schedule. Practice today to stay on track.</span>
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
