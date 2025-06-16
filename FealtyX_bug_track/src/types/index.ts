
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'manager';
  avatar?: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'pending-approval' | 'closed' | 'reopened';
  assigneeId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  tags?: string[];
  timeLogged: number; // in minutes
}

export interface TimeLog {
  id: string;
  bugId: string;
  userId: string;
  timeSpent: number; // in minutes
  description: string;
  loggedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
