
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Timer, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBugs } from '@/contexts/BugContext';
import { useAuth } from '@/contexts/AuthContext';

const DashboardStats = () => {
  const { bugs, timeLogs } = useBugs();
  const { user } = useAuth();

  const isManager = user?.role === 'manager';
  const userBugs = isManager ? bugs : bugs.filter(bug => bug.assigneeId === user?.id);

  const openBugs = userBugs.filter(bug => bug.status === 'open').length;
  const inProgressBugs = userBugs.filter(bug => bug.status === 'in-progress').length;
  const pendingApproval = userBugs.filter(bug => bug.status === 'pending-approval').length;
  const closedBugs = userBugs.filter(bug => bug.status === 'closed').length;

  const totalTimeLogged = isManager 
    ? timeLogs.reduce((total, log) => total + log.timeSpent, 0)
    : timeLogs
        .filter(log => log.userId === user?.id)
        .reduce((total, log) => total + log.timeSpent, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const stats = [
    {
      title: 'Open Bugs',
      value: openBugs,
      icon: Bug,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'In Progress',
      value: inProgressBugs,
      icon: Timer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Approval',
      value: pendingApproval,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Closed',
      value: closedBugs,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Logged</CardTitle>
          <div className="p-2 rounded-lg bg-indigo-50">
            <Timer className="h-4 w-4 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(totalTimeLogged)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
