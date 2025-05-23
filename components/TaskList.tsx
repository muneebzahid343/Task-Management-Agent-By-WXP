import React, { useState, useMemo } from 'react';
import { Task, TaskPriority } from '../types';
import TaskItem from './TaskItem';
import Modal from './Modal';
import { PlusIcon, ChevronDownIcon } from './Icons';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, description: string, priority: TaskPriority, dueDate?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

type SortKey = 'createdAt' | 'dueDate' | 'priority';
type FilterKey = 'all' | 'active' | 'completed' | TaskPriority;

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false); // false for desc (newest first)
  const [filterKey, setFilterKey] = useState<FilterKey>('all');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskDescription.trim(), newTaskPriority, newTaskDueDate || undefined);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority(TaskPriority.Medium);
      setNewTaskDueDate('');
      setIsModalOpen(false);
    }
  };

  const priorityOrder: Record<TaskPriority, number> = {
    [TaskPriority.High]: 3,
    [TaskPriority.Medium]: 2,
    [TaskPriority.Low]: 1,
  };
  
  const filteredAndSortedTasks = useMemo(() => {
    let processedTasks = [...tasks];

    // Filtering
    if (filterKey === 'active') {
      processedTasks = processedTasks.filter(task => !task.completed);
    } else if (filterKey === 'completed') {
      processedTasks = processedTasks.filter(task => task.completed);
    } else if (Object.values(TaskPriority).includes(filterKey as TaskPriority)) {
      processedTasks = processedTasks.filter(task => task.priority === filterKey);
    }

    // Sorting
    processedTasks.sort((a, b) => {
      let compareA: any;
      let compareB: any;

      switch (sortKey) {
        case 'dueDate':
          compareA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          compareB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'priority':
          compareA = priorityOrder[a.priority];
          compareB = priorityOrder[b.priority];
          break;
        case 'createdAt':
        default:
          compareA = a.createdAt;
          compareB = b.createdAt;
          break;
      }
      
      if (sortKey === 'dueDate' && (compareA === Infinity || compareB === Infinity)) {
        if (compareA === Infinity && compareB !== Infinity) return 1; 
        if (compareA !== Infinity && compareB === Infinity) return -1; 
      }

      if (compareA < compareB) return sortAsc ? -1 : 1;
      if (compareA > compareB) return sortAsc ? 1 : -1;
      
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });
   
    processedTasks.sort((a,b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1: -1;
        }
        // If completion status is the same, use the previously established sort order
        // This logic is implicitly handled by the previous sort if it's stable.
        // If not stable, or to be explicit, you might need to re-apply the primary sort criteria here for tie-breaking.
        // For simplicity, assuming the JS sort is stable enough or the previous sort covers this.
        return 0; 
    })

    return processedTasks;
  }, [tasks, sortKey, sortAsc, filterKey, priorityOrder]);

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'dueDate' || key === 'priority'); 
    }
  };
  
  const sortOptions: {key: SortKey, label: string}[] = [
    { key: 'createdAt', label: 'Creation Date'},
    { key: 'dueDate', label: 'Due Date'},
    { key: 'priority', label: 'Priority'}
  ];

  const filterOptions: {key: FilterKey, label: string}[] = [
    { key: 'all', label: 'All Tasks'},
    { key: 'active', label: 'Active'},
    { key: 'completed', label: 'Completed'},
    { key: TaskPriority.High, label: 'High Priority'},
    { key: TaskPriority.Medium, label: 'Medium Priority'},
    { key: TaskPriority.Low, label: 'Low Priority'},
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 border-b border-slate-700/80">
        <h2 className="text-2xl font-semibold text-slate-100">My Tasks</h2>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
           {/* Filter Dropdown */}
           <div className="relative">
            <select
                value={filterKey}
                onChange={(e) => setFilterKey(e.target.value as FilterKey)}
                className="appearance-none bg-slate-700/70 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 pr-8 transition-colors"
                aria-label="Filter tasks"
            >
                {filterOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
            </select>
            <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"/>
           </div>
           {/* Sort Dropdown */}
           <div className="relative">
            <select
                value={sortKey}
                onChange={(e) => handleSortChange(e.target.value as SortKey)}
                className="appearance-none bg-slate-700/70 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 pr-8 transition-colors"
                aria-label="Sort tasks by"
            >
                {sortOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
            </select>
             <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"/>
           </div>
           <button 
            onClick={() => setSortAsc(!sortAsc)}
            className="p-2.5 bg-slate-700/70 border border-slate-600 text-slate-300 hover:bg-slate-600/80 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label={`Sort order: ${sortAsc ? 'Ascending' : 'Descending'}`}
           >
            {sortAsc ? '↑ Asc' : '↓ Desc'}
           </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105 active:scale-100 animate-buttonPressOnActive"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-xl shadow-inner border border-slate-700/50">
          <svg className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-slate-300">No tasks here</h3>
          <p className="mt-1.5 text-sm text-slate-500">
            {filterKey !== 'all' ? "No tasks match your current filters." : "Get started by adding a new task!"}
          </p>
           <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center mx-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add First Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task" size="lg">
        <form onSubmit={handleAddTask} className="space-y-5">
          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-slate-300 mb-1.5">Title <span className="text-rose-400">*</span></label>
            <input
              type="text"
              id="taskTitle"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400"
              placeholder="e.g., Finalize project report"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              id="taskDescription"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 custom-scrollbar"
              placeholder="Add more details about the task..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="taskPriority" className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                <select
                id="taskPriority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                >
                {Object.values(TaskPriority).map(p => (
                    <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                ))}
                </select>
            </div>
            <div>
                <label htmlFor="taskDueDate" className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
                <input
                type="date"
                id="taskDueDate"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                min={new Date().toISOString().split('T')[0]} 
                />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-700 mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-600/80 hover:bg-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskList;