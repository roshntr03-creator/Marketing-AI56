
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const BottomNav: React.FC = () => {
    const { t } = useAppContext();
    const linkClasses = "flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors duration-200 w-full pt-2 pb-1";
    const activeLinkClasses = "text-brand-primary";

    const getLinkName = (name: string): string => {
        switch (name) {
            case 'Home': return t('home');
            case 'Creations Hub': return t('creations_hub');
            case 'Brand': return t('brand');
            case 'More': return t('more');
            default: return name;
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/80 backdrop-blur-lg border-t border-dark-border z-40 md:hidden">
            <div className="flex justify-around items-center h-16">
                {NAV_LINKS.map((link, index) => (
                    <NavLink
                        key={link.name}
                        to={link.href}
                        className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    >
                        {link.icon}
                        <span className="text-xs mt-1">{getLinkName(link.name)}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
