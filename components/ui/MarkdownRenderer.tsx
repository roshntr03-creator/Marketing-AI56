
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    if (!content) return null;

    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = (key: string | number) => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-3">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    content.split('\n').forEach((line, index) => {
        if (line.startsWith('### ')) {
            flushList(index);
            elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-text-primary">{line.substring(4)}</h3>);
        } else if (line.startsWith('* ')) {
            listItems.push(line.substring(2));
        } else if (line.trim() !== '') {
            flushList(index);
            elements.push(<p key={index} className="my-3 text-text-secondary">{line}</p>);
        }
    });

    flushList('final');

    return <div className={`whitespace-pre-wrap ${className}`}>{elements}</div>;
};

export default MarkdownRenderer;