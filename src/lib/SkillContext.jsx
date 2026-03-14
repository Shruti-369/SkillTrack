import { createContext, useContext, useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';

const SkillContext = createContext();

export function useSkills() {
  return useContext(SkillContext);
}

// Generate realistic mock logs for the last 150 days
const today = new Date();
const generateMockLogs = () => {
  const logs = [];
  let currentId = 1;
  for (let i = 0; i < 150; i++) {
    // 60% chance to practice on any given day
    if (Math.random() > 0.4) {
      // 1 to 4 hours of practice
      const hours = Math.floor(Math.random() * 4) + 1;
      logs.push({
        id: currentId++,
        date: format(subDays(today, i), 'yyyy-MM-dd'),
        hours,
        notes: `Practice session day ${150 - i}`,
      });
    }
  }
  return logs.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
};

const initialSkills = [
  {
    id: '1',
    name: 'React',
    category: 'Development',
    level: 'Intermediate',
    weeklyGoal: 10,
    endGoal: 'Build 5 React projects',
    targetDate: '2026-12-31',
    progress: 40,
    logs: generateMockLogs(),
    resources: [
      { id: 1, title: 'React Official Docs', url: 'https://react.dev' },
      { id: 2, title: 'Framer Motion Guide', url: 'https://framer.com/motion' }
    ]
  },
  {
    id: '2',
    name: 'UI/UX Design',
    category: 'Design',
    level: 'Beginner',
    weeklyGoal: 5,
    endGoal: 'Master Figma Auto-layout',
    targetDate: '2026-06-30',
    progress: 35,
    logs: [],
    resources: []
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'Development',
    level: 'Advanced',
    weeklyGoal: 8,
    endGoal: 'Contribute to TS compiler',
    targetDate: '2027-01-01',
    progress: 80,
    logs: [],
    resources: []
  }
];

export function SkillProvider({ children }) {
  const [skills, setSkills] = useState(initialSkills);

  const addSkill = (newSkill) => {
    setSkills([{ ...newSkill, id: Date.now().toString(), logs: [], resources: [] }, ...skills]);
  };

  const deleteSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const addLog = (skillId, log) => {
    setSkills(skills.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          logs: [{ ...log, id: Date.now() }, ...s.logs]
        };
      }
      return s;
    }));
  };

  const addResource = (skillId, resource) => {
    setSkills(skills.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          resources: [...s.resources, { ...resource, id: Date.now() }]
        };
      }
      return s;
    }));
  };

  const value = {
    skills,
    addSkill,
    deleteSkill,
    addLog,
    addResource
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
}
