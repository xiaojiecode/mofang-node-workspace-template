import { type ReactNode } from 'react';
import type { HostAdapter, PagePackage } from '../../lib/low-code/schema';
export declare function PageRenderer({ definition, host, mode, children }: {
    definition: PagePackage;
    host: HostAdapter;
    mode?: 'interactive' | 'design';
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
