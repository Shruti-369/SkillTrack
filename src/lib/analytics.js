import { format, subDays, startOfWeek, isAfter, differenceInDays } from 'date-fns';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');

// ─── LEVEL SYSTEM ─────────────────────────────────────────────────────────────
export function getLevel(xp) {
  const level = Math.floor(xp / 500) + 1;
  const currentXp = xp % 500;
  const nextThreshold = 500;
  return { level, currentXp, nextThreshold };
}

// ─── WEEKLY HOURS HELPER ──────────────────────────────────────────────────────
function getHoursForWeek(logs, weeksAgo = 0) {
  const start = startOfWeek(subDays(today, weeksAgo * 7));
  const end = startOfWeek(subDays(today, (weeksAgo - 1) * 7));
  return logs
    .filter(l => {
      const d = new Date(l.date);
      return d >= start && (weeksAgo === 0 ? true : d < end);
    })
    .reduce((sum, l) => sum + Number(l.hours), 0);
}

function getAvgWeeklyHours(logs, weeksToAvg = 4) {
  if (logs.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < weeksToAvg; i++) total += getHoursForWeek(logs, i);
  return total / weeksToAvg;
}

// ─── SKILL PREDICTION ─────────────────────────────────────────────────────────
export function getPrediction(skill) {
  const avg = getAvgWeeklyHours(skill.logs);
  if (avg < 0.5) return null;
  const weeklyGoal = Number(skill.weeklyGoal);
  const progress = Number(skill.progress);
  const estimatedTotalHoursNeeded = weeklyGoal * 12;
  const remaining = estimatedTotalHoursNeeded * (1 - progress / 100);
  const weeksLeft = remaining / avg;
  const monthsLeft = weeksLeft / 4.33;
  if (monthsLeft <= 0.25) return "Almost there! You're very close to your goal.";
  if (monthsLeft < 1) return `At your current pace, you'll reach your goal in about ${Math.round(weeksLeft)} weeks.`;
  return `At your current pace, you'll reach your goal in approximately ${monthsLeft.toFixed(1)} months.`;
}

// ─── CONSISTENCY SCORE (0–100) ────────────────────────────────────────────────
export function getConsistencyScore(skill) {
  const logs = skill.logs;
  if (logs.length === 0) return 0;
  const activeDays = new Set(logs
    .filter(l => differenceInDays(today, new Date(l.date)) <= 30)
    .map(l => l.date)).size;
  const activeDayRatio = Math.min(activeDays / 20, 1);
  const streakDays = Math.min(computeStreak(logs), 30);
  const streakScore = streakDays / 30;
  const weeklyGoal = Number(skill.weeklyGoal);
  let goalHits = 0;
  for (let i = 0; i < 4; i++) {
    if (getHoursForWeek(logs, i) >= weeklyGoal) goalHits++;
  }
  const goalScore = goalHits / 4;
  return Math.round(Math.min((activeDayRatio * 0.4 + streakScore * 0.3 + goalScore * 0.3) * 100, 100));
}

function computeStreak(logs) {
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 0;
  let current = today;
  for (const dateStr of dates) {
    const d = new Date(dateStr);
    if (differenceInDays(current, d) <= 1) { streak++; current = d; }
    else break;
  }
  return streak;
}

// ─── MOMENTUM ─────────────────────────────────────────────────────────────────
export function getMomentum(skill) {
  const logs = skill.logs;
  const thisWeek = logs.filter(l => differenceInDays(today, new Date(l.date)) < 7).reduce((s, l) => s + Number(l.hours), 0);
  const lastWeek = logs.filter(l => { const d = differenceInDays(today, new Date(l.date)); return d >= 7 && d < 14; }).reduce((s, l) => s + Number(l.hours), 0);
  if (lastWeek === 0 && thisWeek === 0) return { direction: 'stable', percent: 0, thisWeek, lastWeek };
  if (lastWeek === 0) return { direction: 'up', percent: 100, thisWeek, lastWeek };
  if (thisWeek === 0) return { direction: 'down', percent: 100, thisWeek, lastWeek };
  const change = ((thisWeek - lastWeek) / lastWeek) * 100;
  return { direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable', percent: Math.abs(Math.round(change)), thisWeek, lastWeek };
}

// ─── BURNOUT ALERTS ───────────────────────────────────────────────────────────
export function getBurnoutAlerts(skill) {
  const alerts = [];
  const logs = skill.logs;
  const todayHours = logs.filter(l => l.date === todayStr).reduce((s, l) => s + Number(l.hours), 0);
  if (todayHours >= 5) alerts.push(`You've studied ${todayHours} hours today on ${skill.name}. Great effort — consider a short break!`);
  let missedDays = 0;
  let checkDay = today;
  while (missedDays < 7) {
    const ds = format(checkDay, 'yyyy-MM-dd');
    if (!logs.some(l => l.date === ds)) { missedDays++; checkDay = subDays(checkDay, 1); }
    else break;
  }
  if (missedDays >= 3) alerts.push(`You've missed ${missedDays} days of ${skill.name}. Even a short 30-minute session today helps.`);
  return alerts;
}

// ─── SMART RECOMMENDATIONS ────────────────────────────────────────────────────
export function getSmartRecommendations(skills) {
  const recommendations = [];
  const startOfCurrWeek = startOfWeek(today);
  skills.forEach(skill => {
    const weeklyGoal = Number(skill.weeklyGoal);
    const completedThisWeek = skill.logs.filter(l => !isAfter(startOfCurrWeek, new Date(l.date))).reduce((s, l) => s + Number(l.hours), 0);
    const gap = weeklyGoal - completedThisWeek;
    if (gap > 0) recommendations.push(`You're ${gap.toFixed(1)}h behind on ${skill.name}. A focused session today will keep you on track.`);
  });
  const dayScores = {};
  skills.forEach(skill => skill.logs.forEach(l => {
    const dayName = format(new Date(l.date), 'EEEE');
    dayScores[dayName] = (dayScores[dayName] || 0) + Number(l.hours);
  }));
  const sortedDays = Object.entries(dayScores).sort((a, b) => b[1] - a[1]);
  if (sortedDays.length >= 2) recommendations.push(`You're most active on ${sortedDays[0][0]}s and ${sortedDays[1][0]}s. Schedule your main sessions on those days.`);
  return recommendations.slice(0, 3);
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
export function getAchievements(skill) {
  const logs = skill.logs;
  const totalHours = logs.reduce((s, l) => s + Number(l.hours), 0);
  const streak = computeStreak(logs);
  const consistency = getConsistencyScore(skill);
  const weeklyGoal = Number(skill.weeklyGoal);
  const completedThisWeek = logs.filter(l => !isAfter(startOfWeek(today), new Date(l.date))).reduce((s, l) => s + Number(l.hours), 0);
  return [
    { id: 'streak7', label: '7-Day Streak', description: 'Practice 7 days in a row', unlocked: streak >= 7, icon: '🔥' },
    { id: 'streak30', label: '30-Day Streak', description: 'Practice 30 days in a row', unlocked: streak >= 30, icon: '⚡' },
    { id: 'hours30', label: '30 Hours', description: 'Log 30 total hours', unlocked: totalHours >= 30, icon: '⏱️' },
    { id: 'hours100', label: '100 Hours', description: 'Log 100 total hours', unlocked: totalHours >= 100, icon: '💯' },
    { id: 'weekGoal', label: 'Goal Crusher', description: 'Complete weekly goal', unlocked: completedThisWeek >= weeklyGoal, icon: '🎯' },
    { id: 'consistency', label: 'Consistency Master', description: 'Achieve 85+ consistency score', unlocked: consistency >= 85, icon: '👑' },
    { id: 'level5', label: 'Level 5', description: 'Reach Level 5', unlocked: totalHours * 25 >= 2000, icon: '🏆' },
  ];
}

// ─── DASHBOARD INSIGHTS ───────────────────────────────────────────────────────
export function getDashboardInsights(skills) {
  const startOfCurrWeek = startOfWeek(today);
  let weeklyHours = 0, weeklyGoalTotal = 0, skillsActive = 0;
  skills.forEach(skill => {
    const completed = skill.logs.filter(l => !isAfter(startOfCurrWeek, new Date(l.date))).reduce((s, l) => s + Number(l.hours), 0);
    weeklyHours += completed;
    weeklyGoalTotal += Number(skill.weeklyGoal);
    if (completed > 0) skillsActive++;
  });
  const gap = weeklyGoalTotal - weeklyHours;
  const insights = [];
  if (weeklyHours > 0) insights.push(`This week you practiced ${weeklyHours.toFixed(1)}h across ${skillsActive} skill${skillsActive !== 1 ? 's' : ''}.`);
  if (gap > 0) insights.push(`You're ${gap.toFixed(1)}h behind your combined weekly goal.`);
  else if (weeklyGoalTotal > 0) insights.push(`You've hit your weekly goals across all skills. Keep it up!`);
  return insights;
}

// ─── FRIEND ACTIVITY FEED (mock) ──────────────────────────────────────────────
export const friendActivity = [
  { id: 1, name: 'Aman', action: 'practiced React for 2 hours', time: '2h ago', avatar: 'A' },
  { id: 2, name: 'Riya', action: 'completed a 10-day streak 🔥', time: '5h ago', avatar: 'R' },
  { id: 3, name: 'Shiz', action: 'reached Level 5 in Python 🏆', time: 'Yesterday', avatar: 'S' },
  { id: 4, name: 'Karan', action: 'logged 3h of UI/UX Design', time: 'Yesterday', avatar: 'K' },
  { id: 5, name: 'Meha', action: 'unlocked the Consistency Master badge 👑', time: '2 days ago', avatar: 'M' },
];
