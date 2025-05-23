
import React, { useEffect } from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl'; // Added 2xl for potentially wider modals
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      document.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-modalShow" // Increased z-index
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
      <div 
        className={`bg-slate-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} 
                   transform transition-all border border-slate-700/80
                   flex flex-col max-h-[calc(100vh-4rem)] 
                   overflow-hidden`} // Max height and hidden overflow for internal scrolling
        onClick={(e) => e.stopPropagation()} 
        role="document"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-700 flex-shrink-0">
          <h3 id="modal-title" className="text-xl font-semibold text-sky-400">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-sky-300 p-1.5 rounded-full transition-colors hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-5 md:p-6 custom-scrollbar overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
      {/* Style tag is inside the component, which isn't ideal for global styles but works for component-specific ones or when shadow DOM isn't used.
          Tailwind already handles scrollbar styling if configured. This is a fallback/override. */}
      <style>{`
        body.modal-open { /* Example class to add to body if needed elsewhere */
          overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          /* FIX: Replaced tailwind.theme.extend.colors.slate[700] with static hex value */
          background: #334155; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          /* FIX: Replaced tailwind.theme.extend.colors.slate[500] with static hex value */
          background: #64748b; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          /* FIX: Replaced tailwind.theme.extend.colors.slate[400] with static hex value */
          background: #94a3b8;
        }
         /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          /* FIX: Replaced tailwind.theme.extend.colors.slate[500] and tailwind.theme.extend.colors.slate[700] with static hex values */
          scrollbar-color: #64748b #334155;
        }
      `}</style>
    </div>
  );
};

export default Modal;