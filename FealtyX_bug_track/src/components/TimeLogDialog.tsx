
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bug } from '@/types';
import { useBugs } from '@/contexts/BugContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TimeLogDialogProps {
  bug: Bug | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TimeLogDialog: React.FC<TimeLogDialogProps> = ({ bug, open, onOpenChange }) => {
  const [timeSpent, setTimeSpent] = useState('');
  const [description, setDescription] = useState('');
  const { addTimeLog } = useBugs();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bug || !timeSpent || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const timeInMinutes = parseInt(timeSpent);
    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid time in minutes",
        variant: "destructive",
      });
      return;
    }

    addTimeLog({
      bugId: bug.id,
      userId: user?.id || '1',
      timeSpent: timeInMinutes,
      description: description.trim(),
    });

    toast({
      title: "Time Logged",
      description: `${timeInMinutes} minutes logged for "${bug.title}"`,
    });

    setTimeSpent('');
    setDescription('');
    onOpenChange(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
        </DialogHeader>
        
        {bug && (
          <div className="mb-4">
            <h3 className="font-medium text-sm text-gray-500">Bug</h3>
            <p className="font-medium">{bug.title}</p>
            <p className="text-sm text-gray-600 mt-1">
              Total time logged: {formatTime(bug.timeLogged)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timeSpent">Time Spent (minutes) *</Label>
            <Input
              id="timeSpent"
              type="number"
              min="1"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="e.g., 60"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Log Time
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeLogDialog;
