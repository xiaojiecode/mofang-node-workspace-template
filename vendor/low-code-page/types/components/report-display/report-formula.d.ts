import type { RefObject } from 'react';
export declare function ReportFormula({ reportId, formulaOpen, setFormulaOpen, formulaDialog }: {
    reportId: string;
    formulaOpen: boolean;
    setFormulaOpen: (open: boolean) => void;
    formulaDialog: RefObject<HTMLDivElement | null>;
}): import("react/jsx-runtime").JSX.Element;
