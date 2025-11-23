import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { SIDEBAR_CATEGORIES } from '../../constants';
import Logo from '../ui/Logo';

const Sidebar: React.FC = () => {
    const { isSidebarOpen } = useAppContext();
    
    const linkClasses = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group border border-transparent";
    // Active state mimics a pressed button or highlighted item in Linear/MacOS
    const activeLinkClasses = "bg-zinc-800 text-white border-white/5 shadow-inner";
    const inactiveLinkClasses = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50";

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-[#050505] border-r border-white/5 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <div className="h-16 flex items-center px-6 flex-shrink-0 border-b border-white/5">
                    <Logo href="/dashboard" textClassName="text-base text-white tracking-tight font-display font-bold" />
                </div>

                <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto scrollbar-none">
                    {SIDEBAR_CATEGORIES.map((category, index) => (
                        <div key={category.title || index}>
                            {category.title && (
                                <h3 className="px-3 text-[10px] font-bold uppercase text-zinc-600 tracking-widest mb-2 font-sans">
                                    {category.title}
                                </h3>
                            )}
                            <div className="space-y-0.5">
                                {category.links.map(link => (
                                    <NavLink
                                        key={link.name}
                                        to={link.href}
                                        className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span className={`transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                                    {link.icon}
                                                </span>
                                                <span>{link.name}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-white/5 bg-zinc-900/20">
                    <div className="rounded-xl p-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors cursor-pointer border border-transparent hover:border-white/5 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-black">
                            M
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate group-hover:text-indigo-300 transition-colors">Marketing Lead</p>
                            <p className="text-[10px] text-zinc-500 truncate">Enterprise Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;