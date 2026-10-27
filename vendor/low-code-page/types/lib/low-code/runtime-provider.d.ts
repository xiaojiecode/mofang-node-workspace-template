import type { ReactNode } from 'react';
import type { HostAdapter, PagePackage, RuntimeScope } from './schema';
export declare function PageRuntimeProvider({ definition, host, mode, children }: {
    definition: PagePackage;
    host: HostAdapter;
    mode?: 'interactive' | 'design';
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function ScopeProvider({ value, children }: {
    value: RuntimeScope;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
