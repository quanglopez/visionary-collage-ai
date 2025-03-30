
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Goal } from '@/contexts/VisionBoardContext';

const CATEGORIES = [
  { id: 'professional', label: 'Professional' },
  { id: 'health', label: 'Health' },
  { id: 'personal', label: 'Personal' },
  { id: 'financial', label: 'Financial' },
  { id: 'relationships', label: 'Relationships' },
];

interface GoalInputProps {
  onAddGoal: (text: string, category?: string) => void;
  goals: Goal[];
  onRemoveGoal: (id: string) => void;
  onUpdateGoal: (id: string, updates: Partial<Omit<Goal, 'id'>>) => void;
}

const GoalInput: React.FC<GoalInputProps> = ({ 
  onAddGoal, 
  goals, 
  onRemoveGoal,
  onUpdateGoal 
}) => {
  const [goalText, setGoalText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const handleAddGoal = () => {
    if (goalText.trim()) {
      onAddGoal(goalText.trim(), selectedCategory);
      setGoalText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddGoal();
    }
  };

  const toggleCategory = (goalId: string, category: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      onUpdateGoal(goalId, { 
        category: goal.category === category ? undefined : category 
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goal-input">Enter your goals</Label>
        <div className="flex gap-2">
          <Input
            id="goal-input"
            placeholder="Type your goal here..."
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <Button onClick={handleAddGoal}>Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedCategory(prev => 
                prev === category.id ? undefined : category.id
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {goals.length > 0 && (
        <div className="border rounded-md p-4 space-y-3">
          <h4 className="text-sm font-medium">Your Goals</h4>
          {goals.map((goal) => (
            <div key={goal.id} className="flex flex-col gap-2 p-3 border rounded-md bg-muted/30">
              <div className="flex justify-between items-start">
                <span className="text-sm">{goal.text}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onRemoveGoal(goal.id)}
                >
                  <X size={14} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={goal.category === category.id ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleCategory(goal.id, category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalInput;
