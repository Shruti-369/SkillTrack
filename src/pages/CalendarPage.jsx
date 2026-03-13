import { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Mock data: some days have practice
        const hasPractice = Math.random() > 0.6;
        
        days.push(
          <div
            className={`min-h-[100px] p-2 border-r border-b border-zinc-800/50 relative group transition-colors hover:bg-zinc-900/50 ${
              !isSameMonth(day, monthStart)
                ? "bg-zinc-950/40 text-zinc-600"
                : isSameDay(day, new Date())
                ? "bg-blue-950/20 text-blue-400 font-semibold"
                : "bg-zinc-950 text-zinc-300"
            }`}
            key={day}
          >
            <span className="text-sm">{formattedDate}</span>
            {hasPractice && isSameMonth(day, monthStart) && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-950/30 px-1.5 py-1 rounded border border-green-900/50">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>2h Logged</span>
                </div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border border-zinc-800/50 rounded-lg overflow-hidden bg-zinc-950">{rows}</div>;
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-medium text-sm text-zinc-500 py-4 border-b border-zinc-800 bg-zinc-900" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 rounded-t-lg overflow-hidden border border-zinc-800/50 border-b-0">{days}</div>;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Calendar</h1>
          <p className="text-zinc-400 text-sm">View your daily practice sessions and history.</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
           <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-zinc-800">
             <ChevronLeft className="w-5 h-5 text-zinc-400" />
           </Button>
           <span className="text-zinc-100 font-medium px-4 min-w-[140px] text-center">
              {format(currentMonth, "MMMM yyyy")}
           </span>
           <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-zinc-800">
             <ChevronRight className="w-5 h-5 text-zinc-400" />
           </Button>
        </div>
      </div>

      <div className="w-full shadow-2xl shadow-black/50 rounded-lg">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
