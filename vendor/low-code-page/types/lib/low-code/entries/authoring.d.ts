/** Portable authoring API. No React, DOM, CSS, storage, network or business host. */
export { createAuthoringPackage, inspectPackage } from '../authoring/describe';
export { describeCatalog, catalogEntries } from '../authoring/catalog';
export { applyOperations } from '../authoring/operations';
export { validateAuthoringPackage } from '../authoring/diagnostics';
export { operationsSchema, authoringError } from '../authoring/contracts';
export type { AuthoringContext, AuthoringDiagnostic, AuthoringOperation, CatalogQuery } from '../authoring/contracts';
export type { PagePackage } from '../schema';
