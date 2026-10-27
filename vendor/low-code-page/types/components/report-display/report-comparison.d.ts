import type { Category, SortKey } from './report-model';
export declare function ReportComparison({ reportId, currentCategory, sortedCategories, sortKey, setSortKey, chooseCategory }: {
    reportId: string;
    currentCategory: Category;
    sortedCategories: Category[];
    sortKey: SortKey;
    setSortKey: (key: SortKey) => void;
    chooseCategory: (id: string) => void;
}): import("react/jsx-runtime").JSX.Element;
