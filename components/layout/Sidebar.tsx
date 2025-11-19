import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { SIDEBAR_CATEGORIES } from '../../constants';
import Logo from '../ui/Logo';

const Sidebar: React.FC = () => {
    const { isSidebarOpen } = useAppContext();
    
    // Base classes
    const linkClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group";
    
    // Active vs Inactive
    const activeLinkClasses = "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]";
    const inactiveLinkClasses = "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent";

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-background-card border-r border-surface-border z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="h-20 flex items-center px-6 border-b border-surface-border flex-shrink-0">
                    <Logo href="/dashboard" iconClassName="w-8 h-8 text-primary" textClassName="text-lg text-white tracking-tight font-display" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                    {SIDEBAR_CATEGORIES.map((category, index) => (
                        <div key={category.title || index}>
                            {category.title && (
                                <h3 className="px-3 text-xs font-bold uppercase text-text-muted tracking-widest mb-3 font-display">
                                    {category.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {category.links.map(link => (
                                    <NavLink
                                        key={link.name}
                                        to={link.href}
                                        className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-white'}`}>
                                                    {link.icon}
                                                </span>
                                                <span>{link.name}</span>
                                                {isActive && (
                                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
                
                {/* Footer / User Mini Profile could go here */}
                <div className="p-4 border-t border-surface-border">
                    <div className="bg-surface-light rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                            US
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">User Account</p>
                            <p className="text-xs text-text-secondary truncate">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;