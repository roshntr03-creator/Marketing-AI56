
import { NODE_DEFINITIONS } from '../constants/workflowConstants';
import aiService from './aiService';

export class WorkflowExecutionEngine {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private abortControllers = new Map<string, AbortController>();

  async executeWorkflow(workflow: any, inputs: Record<string, any> = {}): Promise<any> {
    const executionId = `exec_${Date.now()}`;
    const abortController = new AbortController();
    this.abortControllers.set(executionId, abortController);

    try {
      // Build execution graph
      const executionGraph = this.buildExecutionGraph(workflow.nodes, workflow.edges);
      
      // Initialize execution state
      let executionState = {
        workflowId: workflow.id,
        executionId,
        status: 'running' as const,
        progress: 0,
        currentNodes: [] as string[],
        results: { ...inputs },
        errors: {} as Record<string, string>,
        startTime: new Date(),
        endTime: null as Date | null
      };

      // Execute each layer
      for (let layerIndex = 0; layerIndex < executionGraph.length; layerIndex++) {
        if (abortController.signal.aborted) {
          throw new Error('Execution aborted');
        }

        const layer = executionGraph[layerIndex];
        executionState.currentNodes = layer;
        executionState.progress = ((layerIndex + 1) / executionGraph.length) * 100;

        // Execute nodes in parallel if they don't depend on each other
        const layerPromises = layer.map(nodeId => 
          this.executeNode(nodeId, workflow, executionState, abortController.signal)
        );

        const results = await Promise.allSettled(layerPromises);
        
        // Process results
        results.forEach((result, index) => {
          const nodeId = layer[index];
          if (result.status === 'fulfilled') {
            executionState.results[nodeId] = result.value;
          } else {
            executionState.errors[nodeId] = result.reason?.message || 'Execution failed';
          }
        });

        // Wait a bit for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return {
        ...executionState,
        status: 'completed' as const,
        endTime: new Date()
      };

    } catch (error) {
      return {
        workflowId: workflow.id,
        executionId,
        status: 'failed' as const,
        progress: 0,
        currentNodes: [],
        results: {},
        errors: { workflow: error instanceof Error ? error.message : 'Unknown error' },
        endTime: new Date()
      };
    } finally {
      this.abortControllers.delete(executionId);
    }
  }

  private async executeNode(
    nodeId: string, 
    workflow: any, 
    executionState: any, 
    signal: AbortSignal
  ): Promise<any> {
    const node = workflow.nodes.find((n: any) => n.id === nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);

    // Check cache
    if (node.data.cacheKey && this.cache.has(node.data.cacheKey)) {
      const cached = this.cache.get(node.data.cacheKey)!;
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data;
      }
    }

    const startTime = Date.now();
    
    try {
      // Gather inputs
      const inputEdges = workflow.edges.filter((e: any) => e.target === nodeId);
      const inputs: Record<string, any> = {};
      
      inputEdges.forEach((edge: any) => {
        if (executionState.results[edge.source]) {
          inputs[edge.targetHandle] = executionState.results[edge.source];
        }
      });

      // Execute based on node type
      let result: any;
      
      switch (node.type) {
        case 'text_input':
          result = node.data.config.defaultValue;
          break;
        case 'llm_processor':
          result = await this.executeLLM(node, inputs, signal);
          break;
        case 'image_generator':
          result = await this.executeImageGeneration(node, inputs, signal);
          break;
        case 'condition':
          result = await this.executeCondition(node, inputs);
          break;
        case 'loop':
          result = await this.executeLoop(node, inputs, executionState, signal);
          break;
        case 'api_call':
          result = await this.executeAPI(node, inputs, signal);
          break;
        case 'viewer':
          result = inputs.data;
          break;
        default:
          result = Object.values(inputs)[0] || null;
          break;
      }

      // Cache result
      if (node.data.cacheKey) {
        this.cache.set(node.data.cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      const executionTime = Date.now() - startTime;
      
      // Update node status object in place for reference
      if (node.data) {
          node.data.status = 'completed';
          node.data.result = result;
          node.data.executionTime = executionTime;
      }

      return result;
      
    } catch (error) {
      if (node.data) {
          node.data.status = 'failed';
          node.data.error = error instanceof Error ? error.message : 'Unknown error';
      }
      throw error;
    }
  }

  private buildExecutionGraph(nodes: any[], edges: any[]): string[][] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Initialize
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });
    
    // Build graph
    edges.forEach(edge => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });
    
    // Topological sort
    const result: string[][] = [];
    let queue = nodes.filter(node => inDegree.get(node.id) === 0).map(node => node.id);
    
    while (queue.length > 0) {
      result.push([...queue]);
      
      const nextQueue: string[] = [];
      queue.forEach(nodeId => {
        graph.get(nodeId)?.forEach(neighborId => {
          inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
          if (inDegree.get(neighborId) === 0) {
            nextQueue.push(neighborId);
          }
        });
      });
      
      queue = nextQueue;
    }
    
    return result;
  }

  abortExecution(executionId: string): void {
    const abortController = this.abortControllers.get(executionId);
    if (abortController) {
      abortController.abort();
    }
  }

  private async executeLLM(node: any, inputs: any, signal: AbortSignal): Promise<string> {
    const { model, systemPrompt, userPrompt } = node.data.config;
    
    let prompt = userPrompt || '';
    Object.entries(inputs).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    
    if (!userPrompt && inputs.context) {
        prompt = inputs.context;
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    return aiService.generateText(fullPrompt, model);
  }

  private async executeImageGeneration(node: any, inputs: any, signal: AbortSignal): Promise<string> {
    const { model, aspectRatio, style, promptEnhancement } = node.data.config;
    
    let prompt = inputs.prompt || node.data.config.prompt || '';
    
    if (promptEnhancement) {
      try {
        const enhanced = await aiService.enhancePrompt(prompt);
        if (enhanced && enhanced.finalPrompt) prompt = enhanced.finalPrompt;
      } catch (e) {
        console.warn("Prompt enhancement failed, using original", e);
      }
    }

    const results = await aiService.generateImage(prompt, aspectRatio, model);
    return results[0];
  }

  private async executeCondition(node: any, inputs: any): Promise<any> {
    const { condition, conditionType } = node.data.config;
    const input = inputs.input;

    let result: any;
    
    switch (conditionType) {
      case 'text_length':
        result = input && input.length > parseInt(condition);
        break;
      case 'number_comparison':
        result = parseFloat(input) > parseFloat(condition);
        break;
      case 'contains':
        result = input && typeof input === 'string' && input.includes(condition);
        break;
      default:
        try {
          if (condition.includes('length')) {
             const limit = parseInt(condition.match(/\d+/)[0] || '0');
             result = input.length > limit;
          } else {
             result = !!input;
          }
        } catch {
          result = false;
        }
    }

    return result ? input : null;
  }

  private async executeLoop(node: any, inputs: any, executionState: any, signal: AbortSignal): Promise<any> {
    const items = inputs.items || [];
    return items; 
  }

  private async executeAPI(node: any, inputs: any, signal: AbortSignal): Promise<any> {
    const { method, url, headers, timeout } = node.data.config;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || 30000);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: (method === 'POST' || method === 'PUT') && inputs.payload ? JSON.stringify(inputs.payload) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw new Error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const workflowEngine = new WorkflowExecutionEngine();
