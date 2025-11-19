import React, { useState } from 'react';
import { ChatBubbleLeftEllipsisIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useAppContext } from '../../contexts/AppContext';
import AICoach from '../AICoach';

const Header: React.FC = () => {
    const { t, toggleSidebar } = useAppContext();
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    return (
        <>
            <header className="bg-background-dark-soft/50 backdrop-blur-sm sticky top-0 z-20 border-b border-border-dark">
                <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    {/* Hamburger Menu for mobile */}
                    <button 
                        onClick={toggleSidebar}
                        className="lg:hidden text-text-secondary hover:text-text-primary"
                        aria-label="Open sidebar"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <div className="flex-1">
                        {/* Can add search or breadcrumbs here in the future */}
                    </div>
                    
                    <button 
                        onClick={() => setIsCoachOpen(true)}
                        className="p-2 rounded-full hover:bg-background-dark-soft transition-colors"
                        aria-label="Open AI Marketing Coach"
                    >
                        <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-text-secondary" />
                    </button>
                </div>
            </header>
            <AICoach isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
        </>
    );
};

export default Header;