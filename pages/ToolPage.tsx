
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TOOLS, ToolId } from '../constants';

// Dynamically import tool components
const toolComponents: Record<ToolId, React.LazyExoticComponent<React.FC<{}>>> = {
    'ugc-video': React.lazy(() => import('./tools/UgcVideoCreator')),
    'promo-video': React.lazy(() => import('./tools/PromoVideoCreator')),
    'image-generator': React.lazy(() => import('./tools/ImageGenerator')),
    'image-editor': React.lazy(() => import('./tools/ImageEditor')),
    'content-generator': React.lazy(() => import('./tools/ContentGenerator')),
    'post-assistant': React.lazy(() => import('./tools/PostAssistant')),
    'campaigns': React.lazy(() => import('./tools/Campaigns')),
    'competitor-analysis': React.lazy(() => import('./tools/CompetitorAnalysis')),
    'prompt-enhancer': React.lazy(() => import('./tools/PromptEnhancer')),
};


const ToolPage: React.FC = () => {
    const { toolId } = useParams<{ toolId: string }>();

    if (!toolId || !Object.keys(toolComponents).includes(toolId)) {
        return <Navigate to="/" />;
    }

    const toolInfo = TOOLS[toolId as ToolId];
    const ToolComponent = toolComponents[toolId as ToolId];

    return (
        <div className="max-w-3xl mx-auto">
             <div className="mb-6">
                <h1 className="text-3xl font-bold">{toolInfo.name}</h1>
                <p className="text-gray-400">{toolInfo.description}</p>
            </div>
            <React.Suspense fallback={<div className="text-center p-8">Loading tool...</div>}>
                <ToolComponent />
            </React.Suspense>
        </div>
    );
};

export default ToolPage;
