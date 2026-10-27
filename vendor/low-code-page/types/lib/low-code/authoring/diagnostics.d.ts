import type { PagePackage } from '../schema';
import type { AuthoringContext, AuthoringDiagnostic } from './contracts';
export declare function validateAuthoringPackage(input: unknown, context?: AuthoringContext): {
    value?: PagePackage | undefined;
    valid: boolean;
    errors: string[];
    diagnostics: AuthoringDiagnostic[];
};
