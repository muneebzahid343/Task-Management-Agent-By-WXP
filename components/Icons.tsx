import React from 'react';

interface IconProps {
  className?: string;
}

export const WXPLogoIcon: React.FC<IconProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wxpLogoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor: 'var(--sky-400, #38bdf8)', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'var(--sky-500, #0ea5e9)', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path d="M6 22L10 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Apply Tailwind's sky-400 or sky-500 if CSS variables are not picked up by SVG stroke directly in all contexts. 
        Using CSS variables for theme consistency if possible. Fallback to direct color if needed.
        For direct use with Tailwind: `stroke-sky-400` for the first/last, and a gradient for the middle.
        The linearGradient ID needs to be unique if this icon is used multiple times on one page with different gradients.
        Here, using `url(#wxpLogoGrad)` implies the gradient is defined and usable.
    */}
    <path d="M12.5 22L16.5 6" stroke="url(#wxpLogoGrad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 22L23 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
     {/* Add a small circle element to subtly represent the 'P' or a focal point */}
    <circle cx="14.5" cy="4.5" r="1.5" fill="url(#wxpLogoGrad)" />
  </svg>
);


export const TasksIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a3.004 3.004 0 002.25-2.25M3.75 12h.007v.008H3.75V12zm.375 0a3.004 3.004 0 002.25-2.25M3.75 17.25h.007v.008H3.75v-.008zm.375 0a3.004 3.004 0 002.25-2.25m2.25-15a3.004 3.004 0 00-2.25 2.25m15.75 12.75c0-1.543-.54-2.957-1.432-4.016a4.504 4.504 0 00-1.431-1.259A4.504 4.504 0 0018 9.75c0-1.543.54-2.957 1.432-4.016A4.504 4.504 0 0020.868 4.5c.542.542.868 1.259.868 2.016a4.504 4.504 0 00.868 2.016c.542.542.868 1.259.868 2.016a4.504 4.504 0 00-.868 2.016c-.542.542-.868 1.259-.868 2.016a4.504 4.504 0 00.868 2.016c.542.542.868 1.259.868 2.016" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M17 8.25L18.25 10M12 2.25L10.25 4M13.75 4L12 2.25m0 19.5L10.25 18M13.75 18L12 19.75M4.5 12L2.25 10M4.5 12L6.25 10M19.5 12L21.75 14M19.5 12L17.75 14" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CircleIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.032 3.223.094M7.5 5.25l.470-1.202A1.5 1.5 0 019.107 3h5.786c.473 0 .882.269.997.648l.47 1.202M7.5 5.25h9M12 9v9" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a15.057 15.057 0 01-4.5 0M3.75 16.5A2.25 2.25 0 016 14.25h12A2.25 2.25 0 0119.5 16.5v2.25A2.25 2.25 0 0117.25 21h-10.5A2.25 2.25 0 014.5 18.75v-2.25zM16.125 3.75A2.25 2.25 0 0013.875 6H10.125A2.25 2.25 0 007.875 3.75M12 12.75V6" />
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

export const PriorityLowIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
  </svg>
);

export const PriorityMediumIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
  </svg>
);

export const PriorityHighIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25l7.5-7.5 7.5 7.5" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75h7.5M8.25 3.75c-1.32.525-2.313 1.88-2.313 3.375V9C5.187 9 4.5 9.687 4.5 10.5v3c0 .813.687 1.5 1.5 1.5h1.063C7.5 16.313 8.672 17.25 10.5 17.25h3c1.828 0 3-1.063 3-2.25h1.063c.813 0 1.5-.687 1.5-1.5v-3c0-.813-.687-1.5-1.5-1.5V7.125C18.063 5.63 17.08.275 15.75 3.75M8.25 3.75V1.5M15.75 3.75V1.5M12 6.75h.008v.008H12V6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12c0 .828-.448 1.5-1 1.5H7.875c-.552 0-1-.672-1-1.5V9.75c0-.828.448-1.5 1-1.5H9.5c.552 0 1 .672 1 1.5V12zm3 0c0 .828.448 1.5 1 1.5h1.625c.552 0 1-.672 1-1.5V9.75c0-.828-.448-1.5-1-1.5H14.5c-.552 0-1 .672-1 1.5V12z" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);