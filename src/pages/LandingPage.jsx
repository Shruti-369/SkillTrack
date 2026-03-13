import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Target, Flame, GitCommit, ArrowRight, Code } from 'lucide-react';
import { Button } from '../components/ui/button';

const features = [
  {
    title: 'Skill progress tracking',
    description: 'Monitor your improvement over time with detailed analytics and xp points.',
    icon: Activity,
  },
  {
    title: 'Weekly learning goals',
    description: 'Set hourly targets for each skill and stay accountable every week.',
    icon: Target,
  },
  {
    title: 'Habit streaks',
    description: 'Build consistency by maintaining daily practice streaks for your configured habits.',
    icon: Flame,
  },
  {
    title: 'Contribution heatmap',
    description: 'Visualize your daily efforts with a beautiful github-style activity graph.',
    icon: GitCommit,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code className="w-5 h-5 text-white" />
          </div>
          SkillTrack
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Log in
          </Link>
          <Button asChild className="bg-white text-black hover:bg-zinc-200">
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            Now in public beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
            Track Your Skills. <br /> Build Consistency.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The minimal, focused tracker for developers and creatives. 
            Set weekly goals, monitor your streaks, and visualize your growth with beautiful analytics.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              <Link to="/login">
                Start Tracking Free 
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-5xl mx-auto mt-24 relative"
        >
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 aspect-video">
             <div className="w-full h-full border border-zinc-800/50 rounded-lg bg-zinc-900/50 flex p-6 gap-6 mockup-img">
                <div className="w-48 border-r border-zinc-800/50 hidden md:flex flex-col gap-2 pr-6">
                  <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
                  <div className="h-8 w-full bg-zinc-800/80 rounded" />
                  <div className="h-8 w-full bg-zinc-800/30 rounded" />
                  <div className="h-8 w-full bg-zinc-800/30 rounded" />
                </div>
                <div className="flex-1 flex flex-col gap-6">
                   <div className="h-8 w-48 bg-zinc-800 rounded" />
                   <div className="flex gap-4">
                     <div className="h-24 flex-1 bg-zinc-800/50 rounded-lg border border-zinc-800/50" />
                     <div className="h-24 flex-1 bg-zinc-800/50 rounded-lg border border-zinc-800/50" />
                     <div className="h-24 flex-1 bg-zinc-800/50 rounded-lg border border-zinc-800/50" />
                   </div>
                   <div className="flex-1 w-full bg-zinc-800/30 rounded-lg border border-zinc-800/50 p-4 flex flex-col gap-2">
                     <div className="h-4 w-32 bg-zinc-700 rounded mb-4" />
                     <div className="flex gap-1">
                        {Array.from({length: 40}).map((_, i) => (
                           <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-blue-500/80' : 'bg-zinc-800'}`} />
                        ))}
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="w-full max-w-5xl mx-auto mt-32 grid md:grid-cols-2 gap-12 text-left">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-400 font-medium">
            <Code className="w-4 h-4" />
            SkillTrack © 2026
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300">Twitter</a>
            <a href="#" className="hover:text-zinc-300">GitHub</a>
            <a href="#" className="hover:text-zinc-300">Privacy</a>
            <a href="#" className="hover:text-zinc-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
