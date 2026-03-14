import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { Settings, MapPin, Link as LinkIcon, Calendar, Trophy, Zap, Clock, UserPlus, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { HeatmapGraph } from '../components/ui/heatmap';
import { useAppContext } from '../lib/AppContext';
import { useSkills } from '../lib/SkillContext';

export function ProfilePage() {
  const { currentUser, users, friendRequests, sendFriendRequest } = useAppContext();
  const { skills } = useSkills();

  // In a real app, this page might accept a user ID parameter to view others
  // For now, we view the currentUser's profile
  const profileUser = currentUser; 
  
  // Generate heatmap data from skills logs
  const heatmapData = useMemo(() => {
    const dailyHours = {};
    skills.forEach(skill => {
      skill.logs.forEach(log => {
        if (!dailyHours[log.date]) dailyHours[log.date] = 0;
        dailyHours[log.date] += Number(log.hours);
      });
    });

    return Object.entries(dailyHours).map(([date, hours]) => {
      let level = 0;
      if (hours > 0 && hours <= 1) level = 1;
      else if (hours > 1 && hours <= 2) level = 2;
      else if (hours > 2 && hours <= 4) level = 3;
      else if (hours > 4) level = 4;
      return { date, hours, level };
    });
  }, [skills]);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-24">
      {/* Profile Header */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />
        <CardContent className="px-8 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-zinc-900 bg-zinc-800 flex items-center justify-center text-4xl font-bold text-white shrink-0 shadow-xl">
              {profileUser.avatar}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-white mb-1">{profileUser.username}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Earth</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined 2024</span>
              </div>
            </div>
            <div className="flex gap-3 pb-2 w-full md:w-auto">
              {profileUser.id === currentUser.id ? (
                <Button variant="outline" className="w-full md:w-auto bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white">
                  <Settings className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" /> Add Friend
                </Button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-zinc-800 pt-8">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-zinc-500 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
                <Clock className="w-4 h-4" /> Learning Hours
              </span>
              <span className="text-3xl font-bold text-white">{profileUser.totalHours}</span>
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-zinc-500 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
                <Zap className="w-4 h-4" /> Total XP
              </span>
              <span className="text-3xl font-bold text-yellow-500">{profileUser.xp.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-zinc-500 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
                <Trophy className="w-4 h-4" /> Current Streak
              </span>
              <span className="text-3xl font-bold text-orange-500">{profileUser.streak} days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="space-y-8">
          {/* Tracked Skills */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Tracking Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileUser.skillsTracked.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Achievements</h2>
              <div className="space-y-3">
                {profileUser.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{badge}</h4>
                      <p className="text-[11px] text-zinc-500">Earned in 2026</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Heatmap & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Learning Activity</h2>
                <div className="text-sm text-zinc-400">{heatmapData.length} active days this year</div>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 border-dashed">
                <HeatmapGraph data={heatmapData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
