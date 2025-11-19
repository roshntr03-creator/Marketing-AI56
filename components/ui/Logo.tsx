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
        <Link to={href} className={`flex items-center gap-2 ${className || ''}`}>
            <LogoIcon className={iconClassName} />
            <span className={`font-bold ${textClassName}`}>{t('app_title')}</span>
        </Link>
    );
};

export default Logo;
