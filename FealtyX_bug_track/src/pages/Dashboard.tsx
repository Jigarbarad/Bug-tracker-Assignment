
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import BugCard from '@/components/BugCard';
import CreateBugDialog from '@/components/CreateBugDialog';
import TimeLogDialog from '@/components/TimeLogDialog';
import { useBugs } from '@/contexts/BugContext';
import { Bug } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Bug as BugIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { bugs } = useBugs();
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [timeLogOpen, setTimeLogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const isManager = user?.role === 'manager';
  const userBugs = isManager ? bugs : bugs.filter(bug => bug.assigneeId === user?.id);

  const filteredBugs = userBugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleTimeLog = (bug: Bug) => {
    setSelectedBug(bug);
    setTimeLogOpen(true);
  };

  const handleEdit = (bug: Bug) => {
    // This would open an edit dialog - for now just console log
    console.log('Edit bug:', bug);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isManager ? 'All Bugs & Tasks' : 'My Assigned Tasks'}
          </h2>
          <p className="text-gray-600">
            {isManager 
              ? 'Monitor and manage all bugs across the team' 
              : 'Track your assigned bugs and log your time'
            }
          </p>
        </div>

        <DashboardStats />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending-approval">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CreateBugDialog />
        </div>

        {filteredBugs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <BugIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No bugs found</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : isManager 
                    ? 'No bugs have been created yet'
                    : 'No bugs assigned to you yet'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBugs.map((bug) => (
              <BugCard
                key={bug.id}
                bug={bug}
                onEdit={handleEdit}
                onTimeLog={handleTimeLog}
              />
            ))}
          </div>
        )}
      </main>

      <TimeLogDialog
        bug={selectedBug}
        open={timeLogOpen}
        onOpenChange={setTimeLogOpen}
      />
    </div>
  );
};

export default Dashboard;
