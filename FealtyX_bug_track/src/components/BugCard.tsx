
import React from 'react';
import { Bug } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Clock, MoreVertical, User, Calendar, Timer } from 'lucide-react';
import { useBugs } from '@/contexts/BugContext';
import { useAuth } from '@/contexts/AuthContext';

interface BugCardProps {
  bug: Bug;
  onEdit?: (bug: Bug) => void;
  onTimeLog?: (bug: Bug) => void;
}

const BugCard: React.FC<BugCardProps> = ({ bug, onEdit, onTimeLog }) => {
  const { updateBug, deleteBug } = useBugs();
  const { user } = useAuth();

  const getPriorityColor = (priority: Bug['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Bug['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending-approval': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'reopened': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStatusChange = (newStatus: Bug['status']) => {
    updateBug(bug.id, { status: newStatus });
  };

  const canEdit = user?.role === 'developer' && bug.assigneeId === user.id;
  const canApprove = user?.role === 'manager';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{bug.title}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(bug.priority)} variant="outline">
                {bug.priority}
              </Badge>
              <Badge className={getStatusColor(bug.status)} variant="outline">
                {bug.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(bug)}>
                    Edit Bug
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTimeLog?.(bug)}>
                    Log Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                    Mark In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('pending-approval')}>
                    Mark for Approval
                  </DropdownMenuItem>
                </>
              )}
              {canApprove && bug.status === 'pending-approval' && (
                <>
                  <DropdownMenuItem onClick={() => handleStatusChange('closed')}>
                    Approve & Close
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('reopened')}>
                    Reopen Bug
                  </DropdownMenuItem>
                </>
              )}
              {(canEdit || canApprove) && (
                <DropdownMenuItem 
                  onClick={() => deleteBug(bug.id)}
                  className="text-red-600"
                >
                  Delete Bug
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{bug.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Assigned to User #{bug.assigneeId}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created {bug.createdAt.toLocaleDateString()}</span>
          </div>
          
          {bug.deadline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Due {bug.deadline.toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span>{formatTime(bug.timeLogged)} logged</span>
          </div>
        </div>
        
        {bug.tags && bug.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {bug.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BugCard;
