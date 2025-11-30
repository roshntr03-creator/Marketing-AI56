
export interface NodePort {
  id: string;
  label: string;
  type: 'text' | 'image' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  required: boolean;
  defaultValue?: any;
}

export type NodeType = 
  | 'text_input' | 'image_input' | 'number_input' | 'boolean_input'
  | 'llm_processor' | 'text_analyzer' | 'summarizer' | 'translator'
  | 'image_generator' | 'image_editor' | 'image_analyzer'
  | 'video_generator' | 'video_editor'
  | 'classifier' | 'condition' | 'router'
  | 'loop' | 'batch_processor'
  | 'database_query' | 'api_call' | 'webhook'
  | 'calculator' | 'data_transformer'
  | 'viewer' | 'exporter' | 'notification';

export interface Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    config: Record<string, any>;
    outputs?: Record<string, NodePort>;
    inputs?: Record<string, NodePort>;
    status: 'idle' | 'running' | 'completed' | 'failed' | 'skipped';
    result?: any;
    error?: string;
    executionTime?: number;
    cacheKey?: string;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  dataType?: string;
  animated?: boolean;
  isActive?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  tags: string[];
  thumbnail?: string;
  statistics: {
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
  };
}

export interface ExecutionState {
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentNodes: string[];
  results: Record<string, any>;
  errors: Record<string, string>;
  startTime?: Date;
  endTime?: Date;
  executionId: string;
}
