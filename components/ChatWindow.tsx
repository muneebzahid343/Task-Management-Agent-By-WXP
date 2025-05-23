import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { GEMINI_TEXT_MODEL_NAME } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon as BotIcon } from './Icons';


interface ChatWindowProps {
  apiKey: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(() => {
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        chatRef.current = ai.chats.create({
          model: GEMINI_TEXT_MODEL_NAME,
          config: {
            systemInstruction: 'You are WXP Agent, a helpful and friendly AI work assistant. Provide concise, actionable advice related to productivity, task management, project planning, and creative thinking. Use markdown for formatting when appropriate (e.g., lists, bold text). Be friendly and slightly informal.',
          },
        });
        setError(null);
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (e) {
        console.error("Failed to initialize chat:", e);
        setError("Failed to initialize AI chat. Please check API key and configuration. You might need to refresh the page after setting the API key if it was missing.");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]); 

  useEffect(() => {
    initializeChat();
     // Set a default greeting message from AI
    setMessages([{
        id: 'initial-greeting',
        sender: 'ai',
        text: "Hello! I'm WXP Agent. How can I assist you with your work today?",
        timestamp: Date.now()
    }]);
  }, [initializeChat]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessageText = input.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const stream = await chatRef.current.sendMessageStream({ message: userMessageText });
      let aiResponseText = '';
      const aiMessageId = (Date.now() + 1).toString();
      
      const initialAiMessage: ChatMessage = {
        id: aiMessageId,
        sender: 'ai',
        text: '', 
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, initialAiMessage]);

      for await (const chunk of stream) { 
        aiResponseText += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
        ));
      }
       setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: aiResponseText || "Sorry, I couldn't generate a response this time." } : msg
      ));

    } catch (e) {
      console.error("AI chat error:", e);
      const errorMessage = (e instanceof Error ? e.message : String(e)) || "An error occurred while communicating with the AI.";
      setError(errorMessage);
      const errorAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Oops! I encountered an issue: ${errorMessage}`,
        timestamp: Date.now()
      };
      setMessages(prev => {
        // If the last message was an empty AI placeholder for this response, replace it
        const lastMsg = prev[prev.length-1];
        if(lastMsg && lastMsg.sender === 'ai' && lastMsg.text === '') {
            return [...prev.slice(0, -1), errorAiMessage];
        }
        return [...prev, errorAiMessage];
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-350px)] max-h-[700px] min-h-[450px] bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <BotIcon className="w-7 h-7 mr-2.5 text-sky-400 flex-shrink-0 self-start rounded-full p-1 bg-slate-700" />
            )}
            <div className={`max-w-md md:max-w-lg lg:max-w-xl px-4 py-3 rounded-xl shadow-md ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-br-none' 
                  : 'bg-slate-700 text-slate-100 rounded-bl-none'
              }`}
            >
              {/* Removed sender name from bubble top as icon differentiates */}
              {msg.sender === 'ai' && msg.text === '' && isLoading && messages[index-1]?.sender === 'user' ? (
                <div className="flex items-center space-x-2 py-1">
                  <LoadingSpinner size="sm" color="text-slate-300" />
                  <span className="text-xs text-slate-400">WXP Agent is thinking...</span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
              )}
            </div>
             {msg.sender === 'user' && (
              <UserCircleIcon className="w-7 h-7 ml-2.5 text-slate-300 flex-shrink-0 self-start rounded-full p-0.5 bg-slate-600" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (messages.length === 0 || messages[messages.length -1]?.text !== '' || messages[messages.length-1]?.sender === 'user') && (
           <div className="flex items-end justify-start">
              <BotIcon className="w-7 h-7 mr-2.5 text-sky-400 flex-shrink-0 self-start rounded-full p-1 bg-slate-700" />
             <div className="max-w-xs px-4 py-3 rounded-xl shadow bg-slate-700 text-slate-100 flex items-center rounded-bl-none">
                <LoadingSpinner size="sm" color="text-slate-300" /> 
                <span className="text-sm ml-2.5 text-slate-300">WXP Agent is thinking...</span>
             </div>
           </div>
        )}
      </div>
      {error && <p className="text-red-400 p-3 text-sm border-t border-slate-700/70 bg-red-900/20">{error}</p>}
      <div className="p-4 border-t border-slate-700/70 bg-slate-800/90">
        <div className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask WXP Agent..."
            className="flex-1 bg-slate-700/90 border border-slate-600/80 text-slate-100 rounded-lg p-3.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder-slate-400 shadow-inner"
            disabled={isLoading || !chatRef.current}
            aria-label="Chat input"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || !chatRef.current}
            className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Send message"
          >
            {isLoading && messages[messages.length -1]?.sender === 'user' ? <LoadingSpinner size="sm" /> : <PaperAirplaneIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;