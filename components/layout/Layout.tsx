import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppContext } from '../../contexts/AppContext';

const Layout: React.FC = () => {
    const { isSidebarOpen, setSidebarOpen } = useAppContext();
    return (
        <div className="h-screen flex bg-background-dark text-text-primary">
            <Sidebar />
            
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;