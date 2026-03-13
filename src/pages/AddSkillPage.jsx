import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export function AddSkillPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate save
    navigate('/dashboard');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto w-full space-y-8 pb-24">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Create a Skill</h1>
        <p className="text-zinc-400 text-sm">Start tracking a new technical skill or habit.</p>
      </div>

      <Card className="bg-zinc-950 border-zinc-800">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1.5">Skill Name</label>
                <Input placeholder="e.g. React, UI Design, Python" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Category</label>
                  <select className="flex h-10 w-full flex-col rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="languages">Languages</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Current Level</label>
                  <select className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1.5">Weekly Goal (Hours)</label>
                <Input type="number" min="1" max="100" placeholder="e.g. 10" required />
                <p className="text-xs text-zinc-500 mt-1.5">How many hours per week do you want to practice?</p>
              </div>

              <div className="pt-4 border-t border-zinc-800/50">
                <h3 className="text-lg font-medium text-zinc-100 mb-4">Milestone</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 block mb-1.5">End Goal</label>
                    <Input placeholder="e.g. Build 5 React projects" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-300 block mb-1.5">Target Date</label>
                    <Input type="date" required className="text-zinc-400 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/50">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Skill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
