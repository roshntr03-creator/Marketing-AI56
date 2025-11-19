import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from './LogoIcon';
import { useAppContext } from '../../contexts/AppContext';

interface LogoProps {
    href: string;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ href, className, iconClassName, textClassName }) => {
    const { t } = useAppContext();
    return (
        <Link to={href} className={`flex items-center gap-2.5 group ${className || ''}`}>
            <div className="relative flex items-center justify-center">
                <div className="absolute -inset-3 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <LogoIcon className={`relative z-10 ${iconClassName}`} />
            </div>
            <span className={`font-bold tracking-tight font-display ${textClassName}`}>{t('app_title')}</span>
        </Link>
    );
};

export default Logo;