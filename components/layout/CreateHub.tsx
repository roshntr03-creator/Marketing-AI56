
import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ALL_TOOLS_ORDER, TOOLS, ToolId } from '../../constants';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const CreateHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useAppContext();

  const handleToggle = () => setIsOpen(!isOpen);

  // Map tool IDs to actual routes defined in App.tsx
  const getToolRoute = (toolId: ToolId) => {
    switch (toolId) {
        case 'ugc-video': return '/ugc-videos';
        case 'promo-video': return '/promo-videos';
        case 'image-generator': return '/image-generator';
        case 'image-editor': return '/image-editor';
        case 'content-generator': return '/content-generator';
        case 'post-assistant': return '/post-assistant';
        case 'campaigns': return '/campaigns';
        case 'competitor-analysis': return '/competitor-analysis';
        case 'prompt-enhancer': return '/prompt-enhancer';
        default: return '/dashboard';
    }
  };

  return (
    <>
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 md:hidden">
         <button
          onClick={handleToggle}
          className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200 bg-primary"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>

      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={handleToggle}
        >
          <div 
            className="fixed bottom-0 left-0 right-0 bg-background-dark-soft border-t border-border-dark rounded-t-2xl p-4 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">{t('create')}</h2>
                <button onClick={handleToggle} className="text-text-primary"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {ALL_TOOLS_ORDER.map((toolId: ToolId) => {
                const tool = TOOLS[toolId];
                return (
                  <Link
                    key={toolId}
                    to={getToolRoute(toolId)}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-white/5"
                  >
                    <div className="bg-background-dark p-3 rounded-full text-primary mb-2 border border-border-dark">
                        {tool.icon}
                    </div>
                    <span className="text-xs text-text-secondary">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateHub;
