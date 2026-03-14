import { useState } from 'react';
import { User, Lock, Bell, Moon, Sun, Monitor, Target, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAppContext } from '../lib/AppContext';

export function SettingsPage() {
  const { currentUser, updateSettings } = useAppContext();
  const [activeTab, setActiveTab] = useState('account'); // account, preferences, skills
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [username, setUsername] = useState(currentUser.username);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({ username });
    setSuccessMsg('Settings saved successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Settings</h1>
        <p className="text-zinc-400 text-sm">Manage your account preferences and profile.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'account' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <User className="w-4 h-4" /> Account Settings
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'preferences' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Bell className="w-4 h-4" /> Preferences
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'skills' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Target className="w-4 h-4" /> Skill Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8">
              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-500 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  {successMsg}
                </div>
              )}

              {activeTab === 'account' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2">Public Profile</h2>
                    
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-white border-2 border-zinc-700">
                        {currentUser.avatar}
                      </div>
                      <Button type="button" variant="outline" className="bg-zinc-950 border-zinc-700 text-white">
                        Change Avatar
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2">Security</h2>
                    <Button type="button" variant="outline" className="bg-zinc-950 border-zinc-700 text-white flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Change Password
                    </Button>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === 'preferences' && (
                <form onSubmit={handleSave} className="space-y-8">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2">Appearance</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <button type="button" onClick={() => setTheme('light')} className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors ${theme === 'light' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                        <Sun className="w-6 h-6" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button type="button" onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                        <Moon className="w-6 h-6" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button type="button" onClick={() => setTheme('system')} className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors ${theme === 'system' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                        <Monitor className="w-6 h-6" />
                        <span className="text-sm font-medium">System</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2">Notifications</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                        <div>
                          <div className="font-medium text-white text-sm">Email Notifications</div>
                          <div className="text-xs text-zinc-400 mt-0.5">Receive friend requests and updates via email.</div>
                        </div>
                        <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} className="w-4 h-4 accent-blue-600" />
                      </label>
                      
                      <label className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                        <div>
                          <div className="font-medium text-white text-sm">Push Notifications</div>
                          <div className="text-xs text-zinc-400 mt-0.5">Get notified immediately when someone messages you.</div>
                        </div>
                        <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} className="w-4 h-4 accent-blue-600" />
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                        <div>
                          <div className="font-medium text-white text-sm">Weekly Progress Report</div>
                          <div className="text-xs text-zinc-400 mt-0.5">A summary of your skill growth delivered every Monday.</div>
                        </div>
                        <input type="checkbox" checked={notifications.weeklyReport} onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})} className="w-4 h-4 accent-blue-600" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Preferences
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2">Weekly Goal Settings</h2>
                  <p className="text-sm text-zinc-400 mb-6">You can edit individual skill weekly goals directly from the <a href="/dashboard" className="text-blue-400 hover:underline">Dashboard</a> or the <a href="/analytics" className="text-blue-400 hover:underline">Analytics</a> pages.</p>
                  
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
                    <Target className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-100 mb-1">Stay Consistent</h4>
                      <p className="text-xs text-blue-200/70">Setting realistic weekly goals is better than setting unachievable ones. Try to balance your skill development.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
