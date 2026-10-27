import type { Config } from '@puckeditor/core';
import type { Materials } from './types';
type Names = 'SplitLayout' | 'ScrollPanel' | 'WorkflowProcess' | 'ExecutionResult' | 'ThinkingProcess' | 'Link';
export declare const nodeMaterials: Pick<Config<Materials>['components'], Names>;
export {};
