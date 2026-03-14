import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';
import { useSkills } from '../lib/SkillContext';
import { format, subDays } from 'date-fns';

// Distinct color per skill index
const SKILL_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

const streakHistory = [
  { name: 'Jan', streak: 5 },
  { name: 'Feb', streak: 12 },
  { name: 'Mar', streak: 8 },
  { name: 'Apr', streak: 21 },
  { name: 'May', streak: 15 },
  { name: 'Jun', streak: 30 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 shadow-xl">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>{p.name}: {p.value}h</p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsPage() {
  const { skills } = useSkills();
  const today = new Date();

  // ── Per-skill weekly hours (stacked) ──────────────────────────────────────
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayName = format(d, 'EEE');
    const entry = { name: dayName };
    skills.forEach(skill => {
      entry[skill.name] = skill.logs
        .filter(l => l.date === dateStr)
        .reduce((s, l) => s + Number(l.hours), 0);
    });
    return entry;
  });

  // ── Per-skill total hours for pie chart ───────────────────────────────────
  const skillTotals = skills.map((skill, i) => ({
    name: skill.name,
    value: Math.round(
      skill.logs.reduce((s, l) => s + Number(l.hours), 0) +
      (skill.name === 'React' ? 100 : 0) // offset for rich mock data
    ),
    color: SKILL_COLORS[i % SKILL_COLORS.length],
  })).filter(s => s.value > 0);

  const pieData = skillTotals.length > 0
    ? skillTotals
    : [{ name: 'No Data', value: 1, color: '#3f3f46' }];

  // ── Per-skill progress bar data ───────────────────────────────────────────
  const progressData = skills.map((skill, i) => ({
    name: skill.name,
    progress: Number(skill.progress),
    color: SKILL_COLORS[i % SKILL_COLORS.length],
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics</h1>
          <p className="text-zinc-400 text-sm">Deep dive into your learning habits and progress.</p>
        </div>
        <Button variant="outline" className="border-zinc-800 shrink-0">
          <Download className="w-4 h-4 mr-2" />Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Stacked bar: per-skill daily hours ─────────────────────────── */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">This Week's Focus</CardTitle>
            <CardDescription>Hours per skill, per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barSize={12} barGap={2} barCategoryGap="30%">
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                  {skills.map((skill, i) => (
                    <Bar
                      key={skill.id}
                      dataKey={skill.name}
                      fill={SKILL_COLORS[i % SKILL_COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
              {skills.map((skill, i) => (
                <div key={skill.id} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SKILL_COLORS[i % SKILL_COLORS.length] }} />
                  {skill.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Pie chart: per-skill total hours ───────────────────────────── */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Skill Distribution</CardTitle>
            <CardDescription>Total hours invested per skill</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[230px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                    formatter={(val, name) => [`${val}h`, name]}
                  />
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={65} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2 w-full">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-zinc-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.name === 'No Data' ? '0' : item.value}h)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Per-skill progress bars ─────────────────────────────────────── */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Overall Progress per Skill</CardTitle>
            <CardDescription>How far each skill is toward its end goal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {progressData.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-zinc-200">{skill.name}</span>
                  <span className="text-zinc-400">{skill.progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.progress}%`, backgroundColor: skill.color }}
                  />
                </div>
              </div>
            ))}
            {progressData.length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-4">No skills added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* ── Streak history ─────────────────────────────────────────────── */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Streak History</CardTitle>
            <CardDescription>Your highest streak per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streakHistory}>
                  <Tooltip
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <Bar dataKey="streak" radius={[4, 4, 0, 0]}>
                    {streakHistory.map((entry, index) => (
                      <Cell key={index} fill={SKILL_COLORS[index % SKILL_COLORS.length]} />
                    ))}
                  </Bar>
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
