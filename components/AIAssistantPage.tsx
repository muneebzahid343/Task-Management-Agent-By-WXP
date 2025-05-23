import React, { useState, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import { summarizeTextWithGemini, breakdownProjectWithGemini, suggestTasksFromProjectWithGemini } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { LightBulbIcon, DocumentTextIcon, BrainIcon, PlusIcon, SparklesIcon } from './Icons';
import { TaskPriority, SuggestedTask } from '../types';

interface AIAssistantPageProps {
  apiKey?: string;
  onAddSuggestedTasks: (tasks: SuggestedTask[], priority: TaskPriority, dueDate?: string) => void;
}

type AITool = 'chat' | 'summarizer' | 'project_breakdown' | 'task_suggester';

const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ apiKey, onAddSuggestedTasks }) => {
  const [activeTool, setActiveTool] = useState<AITool>('chat');
  
  const [summarizerInput, setSummarizerInput] = useState('');
  const [summarizerOutput, setSummarizerOutput] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizerError, setSummarizerError] = useState('');

  const [breakdownTopic, setBreakdownTopic] = useState('');
  const [breakdownOutput, setBreakdownOutput] = useState<string[]>([]);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [breakdownError, setBreakdownError] = useState('');

  const [suggesterProjectDesc, setSuggesterProjectDesc] = useState('');
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [isSuggestingTasks, setIsSuggestingTasks] = useState(false);
  const [suggesterError, setSuggesterError] = useState('');

  const handleSummarize = useCallback(async () => {
    if (!apiKey || !summarizerInput.trim()) return;
    setIsSummarizing(true);
    setSummarizerError('');
    setSummarizerOutput('');
    try {
      const summary = await summarizeTextWithGemini(apiKey, summarizerInput);
      setSummarizerOutput(summary);
    } catch (error) {
      console.error("Summarization error:", error);
      setSummarizerError((error as Error).message || 'Failed to summarize text.');
    } finally {
      setIsSummarizing(false);
    }
  }, [apiKey, summarizerInput]);

  const handleBreakdown = useCallback(async () => {
    if (!apiKey || !breakdownTopic.trim()) return;
    setIsBreakingDown(true);
    setBreakdownError('');
    setBreakdownOutput([]);
    try {
      const ideas = await breakdownProjectWithGemini(apiKey, breakdownTopic);
      setBreakdownOutput(ideas);
    } catch (error) {
      console.error("Project breakdown error:", error);
      setBreakdownError((error as Error).message || 'Failed to break down project.');
    } finally {
      setIsBreakingDown(false);
    }
  }, [apiKey, breakdownTopic]);

  const handleSuggestTasks = useCallback(async () => {
    if (!apiKey || !suggesterProjectDesc.trim()) return;
    setIsSuggestingTasks(true);
    setSuggesterError('');
    setSuggestedTasks([]);
    try {
      const tasks = await suggestTasksFromProjectWithGemini(apiKey, suggesterProjectDesc);
      setSuggestedTasks(tasks);
    } catch (error) {
      console.error("Task suggestion error:", error);
      setSuggesterError((error as Error).message || 'Failed to suggest tasks.');
    } finally {
      setIsSuggestingTasks(false);
    }
  }, [apiKey, suggesterProjectDesc, onAddSuggestedTasks]);

  const addAllSuggestedTasks = () => {
    if (suggestedTasks.length > 0) {
      onAddSuggestedTasks(suggestedTasks, TaskPriority.Medium); 
      setSuggestedTasks([]); 
    }
  };


  if (!apiKey) {
    return (
      <div className="text-center p-8 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
        <SparklesIcon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-amber-400 mb-3">AI Assistant Disabled</h2>
        <p className="text-slate-300 max-w-md mx-auto">
          The API key is not configured. Please ensure the API_KEY environment variable is set to use AI features.
        </p>
      </div>
    );
  }
  
  const aiTools: {id: AITool, name: string, icon: JSX.Element, description: string}[] = [
    {id: 'chat', name: 'AI Chat', icon: <SparklesIcon className="w-5 h-5" />, description: "Converse with WXP Agent for insights."},
    {id: 'summarizer', name: 'Summarizer', icon: <DocumentTextIcon className="w-5 h-5" />, description: "Condense long texts into key points."},
    {id: 'project_breakdown', name: 'Project Breakdown', icon: <LightBulbIcon className="w-5 h-5" />, description: "Deconstruct topics into actionable items."},
    {id: 'task_suggester', name: 'Task Suggester', icon: <BrainIcon className="w-5 h-5" />, description: "Generate task ideas from project goals."},
  ];

  const renderToolContent = (tool: AITool) => {
    switch(tool) {
      case 'chat': return <ChatWindow apiKey={apiKey} />;
      case 'summarizer': return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-sky-400 mb-1 flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2.5 text-sky-500"/> Text Summarizer</h3>
          <p className="text-sm text-slate-400 mb-5">Paste text below to get a concise summary from the AI.</p>
          <textarea
            value={summarizerInput}
            onChange={(e) => setSummarizerInput(e.target.value)}
            rows={6}
            placeholder="Paste text here to summarize..."
            className="w-full bg-slate-700/80 border border-slate-600 text-slate-100 rounded-lg p-3.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 mb-4 transition-colors custom-scrollbar placeholder-slate-400"
            disabled={isSummarizing}
            aria-label="Text to summarize"
          />
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || !summarizerInput.trim()}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center transform hover:scale-105 active:scale-100"
          >
            {isSummarizing ? <LoadingSpinner size="sm" /> : <DocumentTextIcon className="w-5 h-5 mr-2" />}
            Summarize Text
          </button>
          {summarizerError && <p className="text-rose-400 mt-4 text-sm p-3 bg-rose-500/10 rounded-md border border-rose-500/30">{summarizerError}</p>}
          {summarizerOutput && (
            <div className="mt-5 p-4 bg-slate-700/50 rounded-lg border border-slate-600/70">
              <h4 className="font-semibold text-slate-200 mb-2 text-md">Summary:</h4>
              <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{summarizerOutput}</p>
            </div>
          )}
        </div>
      );
      case 'project_breakdown': return (
         <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-sky-400 mb-1 flex items-center"><LightBulbIcon className="w-6 h-6 mr-2.5 text-sky-500"/> Project Breakdown</h3>
          <p className="text-sm text-slate-400 mb-5">Enter a topic or project, and the AI will suggest key components or steps.</p>
          <input
            type="text"
            value={breakdownTopic}
            onChange={(e) => setBreakdownTopic(e.target.value)}
            placeholder="Enter a topic or project to break down..."
            className="w-full bg-slate-700/80 border border-slate-600 text-slate-100 rounded-lg p-3.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 mb-4 transition-colors placeholder-slate-400"
            disabled={isBreakingDown}
            aria-label="Topic for project breakdown"
          />
          <button
            onClick={handleBreakdown}
            disabled={isBreakingDown || !breakdownTopic.trim()}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center transform hover:scale-105 active:scale-100"
          >
            {isBreakingDown ? <LoadingSpinner size="sm" /> : <LightBulbIcon className="w-5 h-5 mr-2" />}
            Breakdown Topic
          </button>
          {breakdownError && <p className="text-rose-400 mt-4 text-sm p-3 bg-rose-500/10 rounded-md border border-rose-500/30">{breakdownError}</p>}
          {breakdownOutput.length > 0 && (
            <div className="mt-5 p-4 bg-slate-700/50 rounded-lg border border-slate-600/70">
              <h4 className="font-semibold text-slate-200 mb-2.5 text-md">Breakdown:</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                {breakdownOutput.map((item, index) => (
                  <li key={index} className="pl-1">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
      case 'task_suggester': return (
         <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-sky-400 mb-1 flex items-center"><BrainIcon className="w-6 h-6 mr-2.5 text-sky-500"/> AI Task Suggester</h3>
          <p className="text-sm text-slate-400 mb-5">Describe your project or goal, and AI will generate relevant sub-tasks.</p>
          <textarea
            value={suggesterProjectDesc}
            onChange={(e) => setSuggesterProjectDesc(e.target.value)}
            rows={4}
            placeholder="Describe your project or goal here..."
            className="w-full bg-slate-700/80 border border-slate-600 text-slate-100 rounded-lg p-3.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 mb-4 transition-colors custom-scrollbar placeholder-slate-400"
            disabled={isSuggestingTasks}
            aria-label="Project description for task suggestion"
          />
          <button
            onClick={handleSuggestTasks}
            disabled={isSuggestingTasks || !suggesterProjectDesc.trim()}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center transform hover:scale-105 active:scale-100"
          >
            {isSuggestingTasks ? <LoadingSpinner size="sm" /> : <BrainIcon className="w-5 h-5 mr-2" />}
            Suggest Tasks
          </button>
          {suggesterError && <p className="text-rose-400 mt-4 text-sm p-3 bg-rose-500/10 rounded-md border border-rose-500/30">{suggesterError}</p>}
          {suggestedTasks.length > 0 && (
            <div className="mt-5 p-4 bg-slate-700/50 rounded-lg border border-slate-600/70">
              <div className="flex justify-between items-center mb-3.5">
                <h4 className="font-semibold text-slate-200 text-md">Suggested Tasks:</h4>
                <button
                    onClick={addAllSuggestedTasks}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3.5 rounded-lg shadow-sm transition-colors flex items-center transform hover:scale-105 active:scale-100"
                    aria-label="Add all suggested tasks to task list"
                >
                   <PlusIcon className="w-4 h-4 mr-1.5"/> Add All to My Tasks
                </button>
              </div>
              <ul className="space-y-2.5">
                {suggestedTasks.map((task, index) => (
                  <li key={index} className="p-3.5 bg-slate-700/80 rounded-lg shadow-sm border border-slate-600">
                    <p className="font-medium text-slate-200 text-sm">{task.title}</p>
                    <p className="text-slate-400 text-xs mt-1 whitespace-pre-line">{task.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
      default: return null;
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {aiTools.map(tool => (
            <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-4 rounded-xl transition-all duration-200 ease-in-out group text-left
                            border hover:shadow-xl
                          ${activeTool === tool.id 
                            ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500 shadow-xl scale-[1.02]' 
                            : 'bg-slate-800 border-slate-700 hover:border-sky-500/50 hover:bg-slate-700/50 transform hover:scale-[1.02]'
                          }`}
                aria-pressed={activeTool === tool.id}
            >
                <div className="flex items-center mb-1.5">
                    <span className={`p-1.5 rounded-md mr-2.5 ${activeTool === tool.id ? 'bg-sky-500 text-white' : 'bg-slate-700 text-sky-400 group-hover:bg-sky-500/20'}`}>
                        {React.cloneElement(tool.icon, { className: `w-5 h-5 transition-colors`})}
                    </span>
                    <span className={`font-semibold ${activeTool === tool.id ? 'text-sky-400' : 'text-slate-200 group-hover:text-sky-300'}`}>{tool.name}</span>
                </div>
                <p className={`text-xs ${activeTool === tool.id ? 'text-sky-300/90' : 'text-slate-400 group-hover:text-slate-300'}`}>{tool.description}</p>
            </button>
        ))}
      </div>

      <div className="transition-opacity duration-300 ease-in-out">
        {renderToolContent(activeTool)}
      </div>
    </div>
  );
};

export default AIAssistantPage;