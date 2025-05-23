import React from 'react';
import { Task, TaskPriority } from '../types';
import { CheckCircleIcon, CircleIcon, TrashIcon, CalendarIcon, PriorityHighIcon, PriorityMediumIcon, PriorityLowIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask, onDeleteTask }) => {
  const { title, description, completed, priority, dueDate, id } = task;

  const isOverdue = !completed && dueDate && new Date(dueDate + 'T00:00:00') < new Date(new Date().toDateString());

  const priorityStyles: Record<TaskPriority, { icon: JSX.Element, color: string, borderColor: string, ringColor: string }> = {
    [TaskPriority.High]: { icon: <PriorityHighIcon className="w-4 h-4 text-rose-400" />, color: 'text-rose-400', borderColor: 'border-rose-500', ringColor: 'ring-rose-500/50' },
    [TaskPriority.Medium]: { icon: <PriorityMediumIcon className="w-4 h-4 text-amber-400" />, color: 'text-amber-400', borderColor: 'border-amber-500', ringColor: 'ring-amber-500/50' },
    [TaskPriority.Low]: { icon: <PriorityLowIcon className="w-4 h-4 text-emerald-400" />, color: 'text-emerald-400', borderColor: 'border-emerald-500', ringColor: 'ring-emerald-500/50' },
  };

  const currentPriorityStyle = priorityStyles[priority];

  const formattedDueDate = dueDate 
    ? new Date(dueDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
    : null;

  return (
    <div 
      className={`p-4 rounded-xl shadow-lg flex items-start space-x-4 transition-all duration-200 ease-in-out relative
                  border ${completed ? 'border-slate-700' : `border-slate-700 hover:border-sky-500/40`}
                  ${completed ? 'bg-slate-800/70 opacity-70' : 'bg-slate-800 hover:bg-slate-700/40'}
                  ${isOverdue ? `ring-2 ${priorityStyles[TaskPriority.High].ringColor} ring-offset-2 ring-offset-slate-950` : ''}
                  border-l-4 ${completed ? 'border-l-slate-600' : currentPriorityStyle.borderColor} `}
      aria-labelledby={`task-title-${id}`}
    >
      <button 
        onClick={() => onToggleTask(id)} 
        className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 rounded-full p-0.5"
        aria-pressed={completed}
        aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}
      >
        {completed ? (
          <CheckCircleIcon className="w-6 h-6 text-emerald-400 transition-transform group-hover:scale-110" />
        ) : (
          <CircleIcon className="w-6 h-6 text-slate-500 group-hover:text-sky-400 transition-colors" />
        )}
      </button>
      
      <div className="flex-grow">
        <h3 
          id={`task-title-${id}`}
          className={`text-lg font-semibold ${completed ? 'line-through text-slate-500' : 'text-slate-100'}`}
        >
          {title}
        </h3>
        {description && (
          <p className={`text-sm mt-1 ${completed ? 'text-slate-600' : 'text-slate-400'} whitespace-pre-line`}>
            {description}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 items-center text-xs">
          <span className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentPriorityStyle.color} bg-slate-700/60 ring-1 ring-inset ${currentPriorityStyle.ringColor.replace('/50','/40')}`}>
            {currentPriorityStyle.icon}
            <span className="ml-1.5">{priority.charAt(0) + priority.slice(1).toLowerCase()} Priority</span>
          </span>
          {formattedDueDate && (
            <span className={`flex items-center ${isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              <CalendarIcon className={`w-4 h-4 mr-1.5 ${isOverdue ? 'text-rose-400' : 'text-slate-500'}`} />
              {formattedDueDate}
              {isOverdue && <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded-full text-[0.65rem] font-bold tracking-wide">OVERDUE</span>}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col space-y-1.5 items-center flex-shrink-0 ml-auto">
        <button
          onClick={() => onDeleteTask(id)}
          className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-full hover:bg-rose-500/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-rose-500"
          aria-label={`Delete task: ${title}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        {/* 
        <button
          // onClick={() => onEditTask(task)} // Future feature
          className="text-slate-500 hover:text-sky-400 transition-colors p-1.5 rounded-full hover:bg-sky-500/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-sky-500"
          aria-label={`Edit task: ${title}`}
        >
          <EditIcon className="w-5 h-5" />
        </button>
        */}
      </div>
    </div>
  );
};

export default TaskItem;