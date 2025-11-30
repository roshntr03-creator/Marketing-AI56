
import React, { useState } from 'react';
import { TrashIcon, CpuChipIcon, AdjustmentsHorizontalIcon, TableCellsIcon } from '@heroicons/react/24/outline';

interface NodePropertiesProps {
  node: any;
  onUpdate: (updates: Partial<any>) => void;
  onRemove: () => void;
}

const NodeProperties: React.FC<NodePropertiesProps> = ({ node, onUpdate, onRemove }) => {
  const [activeTab, setActiveTab] = useState('config');

  const updateConfig = (key: string, value: any) => {
      onUpdate({
          data: {
              ...node.data,
              config: {
                  ...node.data.config,
                  [key]: value
              }
          }
      });
  };

  const renderConfigForm = () => {
    const config = node.data.config;
    
    switch (node.type) {
      case 'text_input':
          return (
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Default Value</label>
                      <textarea 
                          value={config.defaultValue}
                          onChange={(e) => updateConfig('defaultValue', e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-sm text-white min-h-[100px]"
                          placeholder="Enter text..."
                      />
                  </div>
              </div>
          );
      case 'llm_processor':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Model</label>
              <select
                value={config.model}
                onChange={(e) => updateConfig('model', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Temperature</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-zinc-400 mt-1">{config.temperature}</div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">System Prompt</label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => updateConfig('systemPrompt', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs"
                rows={4}
                placeholder="You are a helpful assistant..."
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">User Prompt Template</label>
              <textarea
                value={config.userPrompt}
                onChange={(e) => updateConfig('userPrompt', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs"
                rows={4}
                placeholder="Analyze this: {{context}}"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Use {'{{variable}}'} to insert inputs.</p>
            </div>
          </div>
        );
        
      case 'image_generator':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Model</label>
              <select
                value={config.model}
                onChange={(e) => updateConfig('model', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="nano-banana-pro">Nano Banana Pro</option>
                <option value="bytedance/seedream-v4-text-to-image">Seedream v4</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {['1:1', '16:9', '9:16', '4:3'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => updateConfig('aspectRatio', ratio)}
                    className={`p-2 rounded-lg text-xs border transition-colors ${
                      config.aspectRatio === ratio ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={config.promptEnhancement}
                        onChange={(e) => updateConfig('promptEnhancement', e.target.checked)}
                        className="rounded bg-zinc-900 border-white/20"
                    />
                    Auto-Enhance Prompt
                </label>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-zinc-500 text-sm italic p-4 text-center">
            No specific configuration available for this node type.
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold font-display">{node.data.label}</h3>
          <p className="text-zinc-500 text-xs capitalize font-mono">{node.type.replace('_', ' ')}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          title="Delete Node"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* Status Banner */}
      {node.data.result && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Execution Result</span>
                  <span className="text-[10px] text-zinc-500">{node.data.executionTime}ms</span>
              </div>
              <div className="bg-black/40 p-2 rounded overflow-x-auto max-h-32 custom-scrollbar">
                  <pre className="text-[10px] text-emerald-200/80 font-mono whitespace-pre-wrap break-all">
                      {typeof node.data.result === 'object' ? JSON.stringify(node.data.result, null, 2) : String(node.data.result)}
                  </pre>
              </div>
          </div>
      )}
      
      {node.data.error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <span className="text-xs font-bold text-red-400 uppercase block mb-1">Error</span>
              <p className="text-xs text-red-200">{node.data.error}</p>
          </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        {[
            {id: 'config', icon: AdjustmentsHorizontalIcon, label: 'Config'}, 
            {id: 'io', icon: TableCellsIcon, label: 'I/O'}, 
            {id: 'cache', icon: CpuChipIcon, label: 'System'}
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === tab.id ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {activeTab === 'config' && renderConfigForm()}
        
        {activeTab === 'io' && (
          <div className="space-y-6">
            <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Inputs</h4>
                <div className="space-y-2">
                    {Object.entries(node.data.inputs || {}).map(([id, port]: [string, any]) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                        <div>
                        <span className="text-white text-sm block">{port.label}</span>
                        <span className="text-zinc-500 text-[10px] block font-mono">{port.type}</span>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                        port.required ? 'bg-red-500' : 'bg-green-500'
                        }`} title={port.required ? 'Required' : 'Optional'} />
                    </div>
                    ))}
                    {Object.keys(node.data.inputs || {}).length === 0 && <p className="text-zinc-600 text-xs italic">No inputs.</p>}
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Outputs</h4>
                <div className="space-y-2">
                    {Object.entries(node.data.outputs || {}).map(([id, port]: [string, any]) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                        <div>
                        <span className="text-white text-sm block">{port.label}</span>
                        <span className="text-zinc-500 text-[10px] block font-mono">{port.type}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    ))}
                     {Object.keys(node.data.outputs || {}).length === 0 && <p className="text-zinc-600 text-xs italic">No outputs.</p>}
                </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cache' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white text-sm">Enable Caching</span>
              <input
                type="checkbox"
                checked={!!node.data.cacheKey}
                onChange={(e) => onUpdate({ 
                    data: {
                        ...node.data,
                        cacheKey: e.target.checked ? `cache_${node.id}` : undefined 
                    }
                })}
                className="rounded bg-zinc-900 border-white/20"
              />
            </div>
            {node.data.cacheKey && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Cache Key</label>
                <input
                  type="text"
                  value={node.data.cacheKey}
                  onChange={(e) => onUpdate({ 
                      data: { ...node.data, cacheKey: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                />
                <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 px-3 rounded-lg text-xs transition-colors mt-2">
                  Clear Node Cache
                </button>
              </div>
            )}
            <div className="p-3 bg-zinc-900 rounded-lg border border-white/5">
                <p className="text-xs text-zinc-500 mb-1">Node ID</p>
                <code className="text-[10px] text-zinc-300 font-mono">{node.id}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeProperties;
