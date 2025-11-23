import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

interface LogoProps {
    href: string;
    className?: string;
    textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ href, className, textClassName }) => {
    const { t } = useAppContext();
    return (
        <Link to={href} className={`flex items-center gap-2.5 group ${className || ''}`}>
            <span className={`font-bold tracking-tight font-display ${textClassName}`}>{t('app_title')}</span>
        </Link>
    );
};

export default Logo;