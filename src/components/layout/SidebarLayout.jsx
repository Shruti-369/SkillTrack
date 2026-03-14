import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CalendarDays, Settings, LogOut, Code, Users, MessageSquare, Trophy, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Community', path: '/community', icon: Users },
  { name: 'Messages', path: '/messages', icon: MessageSquare },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function SidebarLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-[#09090b] text-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#27272a] bg-[#09090b] flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-[#27272a]">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            SkillTrack
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-[#27272a] text-white font-medium" 
                    : "text-zinc-400 hover:text-white hover:bg-[#27272a]/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-[#27272a]">
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-[#27272a]/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
