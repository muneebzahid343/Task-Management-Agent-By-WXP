import React, { useMemo } from 'react';
import { Task, TaskPriority } from '../types';
import { CalendarIcon, CheckCircleIcon, CircleIcon, TasksIcon, PriorityHighIcon, PriorityMediumIcon, PriorityLowIcon } from './Icons'; 

interface DashboardPageProps {
  tasks: Task[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    const today = new Date();
    today.setHours(0,0,0,0); 
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999); 

    const upcomingTasks = tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate + 'T00:00:00') >= today && 
        new Date(task.dueDate + 'T00:00:00') <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) 
    ).sort((a,b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    
    const overdueTasksCount = tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate + 'T00:00:00') < today
    ).length;


    const tasksByPriority = {
      [TaskPriority.High]: tasks.filter(t => !t.completed && t.priority === TaskPriority.High).length,
      [TaskPriority.Medium]: tasks.filter(t => !t.completed && t.priority === TaskPriority.Medium).length,
      [TaskPriority.Low]: tasks.filter(t => !t.completed && t.priority === TaskPriority.Low).length,
    };

    return { totalTasks, completedTasks, activeTasks, upcomingTasks, overdueTasks: overdueTasksCount, tasksByPriority };
  }, [tasks]);

  const priorityColors: Record<TaskPriority, string> = {
    [TaskPriority.High]: 'bg-rose-500',
    [TaskPriority.Medium]: 'bg-amber-500',
    [TaskPriority.Low]: 'bg-emerald-500',
  };
  const priorityTextColors: Record<TaskPriority, string> = {
    [TaskPriority.High]: 'text-rose-300',
    [TaskPriority.Medium]: 'text-amber-300',
    [TaskPriority.Low]: 'text-emerald-300',
  };
  const priorityIcons: Record<TaskPriority, JSX.Element> = {
    [TaskPriority.High]: <PriorityHighIcon className={`w-5 h-5 ${priorityTextColors[TaskPriority.High]}`} />,
    [TaskPriority.Medium]: <PriorityMediumIcon className={`w-5 h-5 ${priorityTextColors[TaskPriority.Medium]}`} />,
    [TaskPriority.Low]: <PriorityLowIcon className={`w-5 h-5 ${priorityTextColors[TaskPriority.Low]}`} />,
  };


  const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element, details?: string, iconBgColor?: string }> = 
    ({ title, value, icon, details, iconBgColor = 'bg-slate-700' }) => (
    <div className="bg-slate-800 p-5 rounded-xl shadow-xl border border-slate-700 hover:border-sky-500/30 transition-all duration-200 transform hover:scale-[1.02]">
      <div className="flex items-center space-x-4">
        <div className={`p-3.5 rounded-lg ${iconBgColor} shadow-inner`}>
         {icon}
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
      </div>
      {details && <p className="text-xs text-slate-500 mt-2.5 pl-1">{details}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={<TasksIcon className="w-7 h-7 text-sky-400" />} iconBgColor="bg-sky-500/10" />
        <StatCard title="Active Tasks" value={stats.activeTasks} icon={<CircleIcon className="w-7 h-7 text-amber-400" />} iconBgColor="bg-amber-500/10" details={stats.overdueTasks > 0 ? `${stats.overdueTasks} task${stats.overdueTasks > 1 ? 's' : ''} overdue` : 'All caught up!'} />
        <StatCard title="Completed Tasks" value={stats.completedTasks} icon={<CheckCircleIcon className="w-7 h-7 text-emerald-400" />} iconBgColor="bg-emerald-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tasks by Priority */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-5">Active Tasks by Priority</h3>
          {stats.activeTasks > 0 ? (
            <div className="space-y-4">
              {(Object.keys(stats.tasksByPriority) as TaskPriority[]).map(priority => {
                const count = stats.tasksByPriority[priority];
                const percentage = stats.activeTasks > 0 ? (count / stats.activeTasks * 100) : 0;
                // if (count === 0) return null; // Show even if 0 for completeness if others have count

                return (
                  <div key={priority}>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className={`flex items-center font-medium ${priorityTextColors[priority]}`}>
                        {React.cloneElement(priorityIcons[priority], {className: `w-4 h-4 ${priorityTextColors[priority]}`})}
                        <span className="ml-2">{priority.charAt(0) + priority.slice(1).toLowerCase()}</span>
                      </span>
                      <span className="font-medium text-slate-300">{count} Tasks ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 shadow-inner">
                      <div 
                        className={`${priorityColors[priority]} h-3 rounded-full transition-all duration-700 ease-out`} 
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${priority} priority tasks progress`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <p className="text-slate-400 text-center py-6 text-sm">No active tasks to display priority for.</p>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-3 bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-5">Upcoming Deadlines (Next 7 Days)</h3>
          {stats.upcomingTasks.length > 0 ? (
            <ul className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {stats.upcomingTasks.map(task => (
                <li key={task.id} className="flex items-center justify-between p-3.5 bg-slate-700/60 rounded-lg shadow-sm border border-slate-600/70 hover:border-sky-500/40 transition-colors">
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-slate-200">{task.title}</p>
                    <p className={`text-xs mt-0.5 ${new Date(task.dueDate! + 'T00:00:00') < new Date(new Date().toDateString()) ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                      <CalendarIcon className="w-3.5 h-3.5 mr-1 inline-block -mt-px" />
                      Due: {new Date(task.dueDate! + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-3 flex-shrink-0
                      ${ task.priority === TaskPriority.High ? 'bg-rose-500/20 text-rose-300 ring-1 ring-inset ring-rose-500/30' :
                         task.priority === TaskPriority.Medium ? 'bg-amber-500/20 text-amber-300 ring-1 ring-inset ring-amber-500/30' :
                         'bg-emerald-500/20 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                      }`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3"/>
                <p className="text-slate-400 text-sm">No upcoming deadlines in the next 7 days.</p>
                <p className="text-xs text-slate-500 mt-1">Looks like you're on top of things!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;