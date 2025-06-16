
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bug, TimeLog } from '@/types';

interface BugContextType {
  bugs: Bug[];
  timeLogs: TimeLog[];
  addBug: (bug: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'timeLogged'>) => void;
  updateBug: (id: string, updates: Partial<Bug>) => void;
  deleteBug: (id: string) => void;
  addTimeLog: (timeLog: Omit<TimeLog, 'id' | 'loggedAt'>) => void;
  getBugsByAssignee: (assigneeId: string) => Bug[];
  getTotalTimeByBug: (bugId: string) => number;
}

const BugContext = createContext<BugContextType | undefined>(undefined);

// Mock data
const mockBugs: Bug[] = [
  {
    id: '1',
    title: 'Login page responsive design issues',
    description: 'The login form is not properly responsive on mobile devices. Needs fixing for better UX.',
    priority: 'high',
    status: 'in-progress',
    assigneeId: '1',
    createdBy: '2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    deadline: new Date('2024-01-20'),
    tags: ['UI', 'Mobile'],
    timeLogged: 120,
  },
  {
    id: '2',
    title: 'Database connection timeout',
    description: 'Users experiencing slow response times due to database connection issues.',
    priority: 'critical',
    status: 'open',
    assigneeId: '3',
    createdBy: '2',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    deadline: new Date('2024-01-18'),
    tags: ['Backend', 'Performance'],
    timeLogged: 45,
  },
  {
    id: '3',
    title: 'Add dark mode toggle',
    description: 'Implement dark mode functionality across the application.',
    priority: 'medium',
    status: 'pending-approval',
    assigneeId: '1',
    createdBy: '1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-17'),
    tags: ['Feature', 'UI'],
    timeLogged: 240,
  },
];

const mockTimeLogs: TimeLog[] = [
  {
    id: '1',
    bugId: '1',
    userId: '1',
    timeSpent: 60,
    description: 'Initial investigation and setup',
    loggedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    bugId: '1',
    userId: '1',
    timeSpent: 60,
    description: 'Fixed responsive issues',
    loggedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    bugId: '3',
    userId: '1',
    timeSpent: 180,
    description: 'Implemented dark mode functionality',
    loggedAt: new Date('2024-01-17'),
  },
];

export const BugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);

  const addBug = (bugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'timeLogged'>) => {
    const newBug: Bug = {
      ...bugData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      timeLogged: 0,
    };
    setBugs(prev => [newBug, ...prev]);
  };

  const updateBug = (id: string, updates: Partial<Bug>) => {
    setBugs(prev => prev.map(bug => 
      bug.id === id ? { ...bug, ...updates, updatedAt: new Date() } : bug
    ));
  };

  const deleteBug = (id: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== id));
    setTimeLogs(prev => prev.filter(log => log.bugId !== id));
  };

  const addTimeLog = (logData: Omit<TimeLog, 'id' | 'loggedAt'>) => {
    const newLog: TimeLog = {
      ...logData,
      id: Date.now().toString(),
      loggedAt: new Date(),
    };
    setTimeLogs(prev => [newLog, ...prev]);
    
    // Update total time logged for the bug
    updateBug(logData.bugId, {
      timeLogged: getTotalTimeByBug(logData.bugId) + logData.timeSpent
    });
  };

  const getBugsByAssignee = (assigneeId: string) => {
    return bugs.filter(bug => bug.assigneeId === assigneeId);
  };

  const getTotalTimeByBug = (bugId: string) => {
    return timeLogs
      .filter(log => log.bugId === bugId)
      .reduce((total, log) => total + log.timeSpent, 0);
  };

  return (
    <BugContext.Provider value={{
      bugs,
      timeLogs,
      addBug,
      updateBug,
      deleteBug,
      addTimeLog,
      getBugsByAssignee,
      getTotalTimeByBug,
    }}>
      {children}
    </BugContext.Provider>
  );
};

export const useBugs = () => {
  const context = useContext(BugContext);
  if (context === undefined) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};
