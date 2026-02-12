// Configuration Types
export interface Config {
    visualization: VisualizationConfig;
    privacy: PrivacyConfig;
}

export interface VisualizationConfig {
    mode: 'minimal' | 'detailed';
    theme: Theme;
    animationSpeed: number;
    showLabels: boolean;
    gridSize: number;
    snapToGrid: boolean;
}

export interface Theme {
    background: string;
    grid: string;
    text: string;
    nodes: {
        model: string;
        tool: string;
        memory: string;
        process: string;
    };
    connections: {
        data: string;
        call: string;
        response: string;
    };
}

export interface PrivacyConfig {
    sharePatterns: boolean;
    anonymousStats: boolean;
    dataRetention: {
        enabled: boolean;
        duration: number;
    };
}

// Circuit Types
export interface CircuitNode {
    id: string;
    type: 'model' | 'tool' | 'memory' | 'process';
    name: string;
    position: Position;
    config?: Record<string, any>;
    state?: NodeState;
}

export interface Connection {
    id: string;
    source: string;
    target: string;
    type: 'data' | 'call' | 'response';
    config?: Record<string, any>;
    state?: ConnectionState;
}

export interface Position {
    x: number;
    y: number;
}

export interface NodeState {
    active: boolean;
    lastUpdate: number;
    metrics?: Record<string, number>;
}

export interface ConnectionState {
    active: boolean;
    flow: number;
    lastUpdate: number;
}

// Event Types
export interface ModelEvent {
    nodeId: string;
    type: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

export interface ToolEvent {
    nodeId: string;
    tool: string;
    action: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

export interface MemoryEvent {
    nodeId: string;
    operation: 'read' | 'write';
    timestamp: number;
    metadata?: Record<string, any>;
}

// Pattern Types
export interface Pattern {
    name: string;
    nodes: CircuitNode[];
    connections: Connection[];
    metadata: PatternMetadata;
}

export interface PatternMetadata {
    creator: string;
    created: number;
    description?: string;
    tags?: string[];
    isPublic: boolean;
}