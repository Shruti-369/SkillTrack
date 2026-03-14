import { useState, useMemo } from 'react';
import { Trophy, Clock, Zap, Target } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useAppContext } from '../lib/AppContext';
import { cn } from '../lib/utils';

export function LeaderboardPage() {
  const { currentUser, users } = useAppContext();
  const [sortBy, setSortBy] = useState('xp'); // 'xp', 'hours', 'streak'

  // Combine currentUser with all mock users for the leaderboard
  const allUsers = useMemo(() => {
    return [
      {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        xp: currentUser.xp,
        streak: currentUser.streak,
        weeklyHours: currentUser.totalHours || 15 // mock fallback
      },
      ...users
    ];
  }, [currentUser, users]);

  // Sort logic
  const sortedUsers = useMemo(() => {
    return [...allUsers].sort((a, b) => {
      if (sortBy === 'xp') return b.xp - a.xp;
      if (sortBy === 'hours') return b.weeklyHours - a.weeklyHours;
      if (sortBy === 'streak') return b.streak - a.streak;
      return 0;
    });
  }, [allUsers, sortBy]);

  const getRankBadge = (index) => {
    if (index === 0) return <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-sm border-2 border-yellow-500/50">1</div>;
    if (index === 1) return <div className="w-8 h-8 rounded-full bg-zinc-300/20 text-zinc-300 flex items-center justify-center font-bold text-sm border-2 border-zinc-400/50">2</div>;
    if (index === 2) return <div className="w-8 h-8 rounded-full bg-orange-700/20 text-orange-600 flex items-center justify-center font-bold text-sm border-2 border-orange-700/50">3</div>;
    return <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-sm">{index + 1}</div>;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Leaderboard</h1>
          <p className="text-zinc-400 text-sm">See how you rank against the community.</p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setSortBy('xp')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              sortBy === 'xp' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300"
            )}
          >
            <Zap className="w-4 h-4" /> XP Points
          </button>
          <button
            onClick={() => setSortBy('hours')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              sortBy === 'hours' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300"
            )}
          >
            <Clock className="w-4 h-4" /> Weekly Hours
          </button>
          <button
            onClick={() => setSortBy('streak')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              sortBy === 'streak' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300"
            )}
          >
            <Target className="w-4 h-4" /> Streak
          </button>
        </div>
      </div>

      {/* Podium (Top 3) */}
      <div className="grid grid-cols-3 gap-4 pt-8 pb-4">
        {[1, 0, 2].map((idx) => {
          const user = sortedUsers[idx];
          if (!user) return <div key={idx} />; // Handle fewer than 3 users gracefully

          const isFirst = idx === 0;
          return (
            <Card key={user.id} className={cn(
              "bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center p-6 text-center transform transition-transform",
              isFirst ? "scale-110 z-10 border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.1)]" : "mt-8",
              user.id === currentUser.id && "ring-1 ring-blue-500/50"
            )}>
              {isFirst && <Trophy className="w-8 h-8 text-yellow-500 mb-3" />}
              {!isFirst && <div className={cn("text-lg font-bold mb-3", idx === 1 ? "text-zinc-300" : "text-orange-600")}>
                #{idx + 1}
              </div>}
              
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-300 mb-3 border-2 border-zinc-700">
                {user.avatar}
              </div>
              
              <h3 className="font-bold text-white mb-1">{user.username}</h3>
              
              <div className="flex flex-col gap-1 items-center mt-2">
                {sortBy === 'xp' && <span className="text-yellow-500 font-bold">{user.xp.toLocaleString()} XP</span>}
                {sortBy === 'hours' && <span className="text-blue-400 font-bold">{user.weeklyHours} hrs</span>}
                {sortBy === 'streak' && <span className="text-orange-500 font-bold">{user.streak} days</span>}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full List */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium text-right cursor-pointer" onClick={() => setSortBy('hours')}>Weekly Hours</th>
                <th className="px-6 py-4 font-medium text-right cursor-pointer" onClick={() => setSortBy('streak')}>Streak</th>
                <th className="px-6 py-4 font-medium text-right cursor-pointer" onClick={() => setSortBy('xp')}>Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {sortedUsers.slice(3).map((user, index) => {
                const actualRank = index + 3;
                const isCurrent = user.id === currentUser.id;
                
                return (
                  <tr key={user.id} className={cn(
                    "transition-colors",
                    isCurrent ? "bg-blue-600/10 border-l-2 border-l-blue-500 border-b-transparent" : "hover:bg-zinc-800/30"
                  )}>
                    <td className="px-6 py-4">
                      {getRankBadge(actualRank)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                          {user.avatar}
                        </div>
                        <span className="font-medium text-white flex items-center gap-2">
                          {user.username}
                          {isCurrent && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">YOU</span>}
                        </span>
                      </div>
                    </td>
                    <td className={cn("px-6 py-4 text-right font-medium", sortBy === 'hours' ? 'text-blue-400' : 'text-zinc-400')}>
                      {user.weeklyHours}h
                    </td>
                    <td className={cn("px-6 py-4 text-right font-medium", sortBy === 'streak' ? 'text-orange-500' : 'text-zinc-400')}>
                      {user.streak} <span className="text-xs font-normal opacity-50">days</span>
                    </td>
                    <td className={cn("px-6 py-4 text-right font-bold", sortBy === 'xp' ? 'text-yellow-500' : 'text-zinc-300')}>
                      {user.xp.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
