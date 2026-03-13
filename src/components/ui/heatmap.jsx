import { startOfYear, eachDayOfInterval, endOfYear, format, isSameDay } from 'date-fns';

export function HeatmapGraph({ data }) {
  // Generate days for current year
  const start = startOfYear(new Date());
  const end = endOfYear(new Date());
  const days = eachDayOfInterval({ start, end });

  // Group by weeks for the grid layout (columns = weeks, rows = days of week)
  // Simplified for demo: just flow in a flex container or standard grid
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="inline-flex flex-col gap-2">
        <div className="flex gap-1.5">
          {days.slice(0, 364).reduce((weeks, day, i) => {
            const weekIdx = Math.floor(i / 7);
            if (!weeks[weekIdx]) weeks[weekIdx] = [];
            weeks[weekIdx].push(day);
            return weeks;
          }, []).map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => {
                // Find data for this day
                const dayStr = format(day, 'yyyy-MM-dd');
                const activity = data.find(d => d.date === dayStr);
                const level = activity ? activity.level : 0;
                
                let colorClass = 'bg-zinc-800'; // Level 0
                if (level === 1) colorClass = 'bg-green-900/60';
                else if (level === 2) colorClass = 'bg-green-700';
                else if (level === 3) colorClass = 'bg-green-500';
                else if (level >= 4) colorClass = 'bg-green-400';

                return (
                  <div
                    key={dIdx}
                    title={`${dayStr}: ${activity ? activity.hours : 0} hours`}
                    className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-2 ring-zinc-500 transition-all cursor-pointer`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end text-xs text-zinc-500 gap-2 mt-2">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-zinc-800" />
          <div className="w-3 h-3 rounded-sm bg-green-900/60" />
          <div className="w-3 h-3 rounded-sm bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
