
import { NodeType, NodePort } from '../types/workflow';

export const NODE_DEFINITIONS: Record<string, {
    label: string;
    category: string;
    icon: string;
    color: string;
    inputs: Record<string, NodePort>;
    outputs: Record<string, NodePort>;
    config: any;
}> = {
    text_input: {
      label: 'Text Input',
      category: 'input',
      icon: '📝',
      color: 'from-amber-500 to-orange-500',
      inputs: {},
      outputs: {
        text: { id: 'text', label: 'Text Output', type: 'text', required: true }
      },
      config: { placeholder: 'Enter text...', defaultValue: '' }
    },
    llm_processor: {
      label: 'AI Processor',
      category: 'ai',
      icon: '🧠',
      color: 'from-blue-500 to-indigo-500',
      inputs: {
        context: { id: 'context', label: 'Context', type: 'text', required: true }
      },
      outputs: {
        response: { id: 'response', label: 'AI Response', type: 'text', required: true }
      },
      config: { 
        model: 'gemini-2.5-flash',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: 'You are a helpful AI assistant.',
        userPrompt: '{{context}}'
      }
    },
    image_generator: {
      label: 'Image Generator',
      category: 'ai',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      inputs: {
        prompt: { id: 'prompt', label: 'Prompt', type: 'text', required: true }
      },
      outputs: {
        image: { id: 'image', label: 'Generated Image', type: 'image', required: true }
      },
      config: {
        model: 'nano-banana-pro',
        aspectRatio: '1:1',
        quality: 'high',
        style: 'realistic',
        promptEnhancement: true
      }
    },
    condition: {
      label: 'Conditional Logic',
      category: 'logic',
      icon: '🔀',
      color: 'from-green-500 to-emerald-500',
      inputs: {
        input: { id: 'input', label: 'Input', type: 'any', required: true }
      },
      outputs: {
        true: { id: 'true', label: 'True Branch', type: 'any', required: true },
        false: { id: 'false', label: 'False Branch', type: 'any', required: true }
      },
      config: {
        condition: 'input.length > 100',
        conditionType: 'text_length'
      }
    },
    loop: {
      label: 'Iterator',
      category: 'logic',
      icon: '🔄',
      color: 'from-cyan-500 to-teal-500',
      inputs: {
        items: { id: 'items', label: 'Items to Process', type: 'array', required: true }
      },
      outputs: {
        item: { id: 'item', label: 'Current Item', type: 'any', required: true },
        index: { id: 'index', label: 'Index', type: 'number', required: true },
        isLast: { id: 'isLast', label: 'Is Last Item', type: 'boolean', required: true }
      },
      config: {
        maxIterations: 100,
        batchSize: 1,
        parallelProcessing: false
      }
    },
    api_call: {
      label: 'API Call',
      category: 'integration',
      icon: '🌐',
      color: 'from-violet-500 to-purple-500',
      inputs: {
        payload: { id: 'payload', label: 'Request Data', type: 'object', required: false }
      },
      outputs: {
        response: { id: 'response', label: 'API Response', type: 'object', required: true },
        status: { id: 'status', label: 'Status Code', type: 'number', required: true }
      },
      config: {
        method: 'GET',
        url: 'https://api.example.com/data',
        headers: {},
        auth: { type: 'none' },
        timeout: 30000
      }
    },
    viewer: {
      label: 'Results Viewer',
      category: 'output',
      icon: '👁️',
      color: 'from-orange-500 to-red-500',
      inputs: {
        data: { id: 'data', label: 'Data to Display', type: 'any', required: true }
      },
      outputs: {},
      config: {
        displayType: 'auto',
        format: 'pretty',
        exportOptions: ['json', 'csv', 'txt']
      }
    }
  };
