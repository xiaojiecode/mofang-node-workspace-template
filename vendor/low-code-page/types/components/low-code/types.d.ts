import type { Slot } from '@puckeditor/core';
import type { ComponentProps } from 'react';
import type { Badge } from '../ui/badge';
import type { Button } from '../ui/button';
import type { ExecutionData, FeedbackData, ProgressData } from '../../lib/low-code/cockpit-schema';
import type { Binding, ColumnDefinition, Condition } from '../../lib/low-code/schema';
import type { ComponentAppearance } from '../../lib/low-code/schema';
import type { SplitLayoutProps } from '../../lib/low-code/split-layout';
import type { CockpitBinding } from './cockpit-data';
import type { ConfigFieldProps, RecordListFieldProps } from './fields/config-field-types';
import type { UnifiedInputProps } from './fields/unified-input-contract';
import type { UnifiedTableProps } from './table/unified-table-contract';
export type IconProps = {
    icon?: 'none' | 'external' | 'sparkles' | 'plus' | 'check' | 'download' | 'refresh' | 'custom';
    iconImage?: {
        src: string;
        name: string;
    };
    iconPosition?: 'start' | 'end';
    iconSize?: number;
    iconGap?: number;
};
export type BusyProps = {
    busyScope?: 'page' | 'event' | 'none';
    busyEventId?: string;
    busyText?: string;
};
export type BoundTextProps = {
    lines?: number;
    text: string;
    binding?: Binding;
    formatter?: 'text' | 'money';
};
export type FieldProps = {
    fieldId: string;
    placeholder?: string;
    rows?: number;
    step?: number;
};
export type TabItem = {
    value: string;
    label: string;
    countBinding?: Binding;
    eventId?: string;
    disabled?: boolean;
};
export type TableProps = UnifiedTableProps & {
    defaultSelection?: 'none' | 'all';
    headerAppearance?: ComponentAppearance;
    cellAppearance?: ComponentAppearance;
    selectionWidth?: number;
    resetOn?: Binding;
    minWidth?: number;
    density?: 'default' | 'compact';
    layout?: 'fixed' | 'auto';
    selectionDisabledPath?: string;
    tableId: string;
    dataSourceId: string;
    rowKey: string;
    columns: ColumnDefinition[];
    selection: boolean;
    pageSize: number;
};
type MaterialProps = {
    Tabs: BusyProps & {
        itemAppearance?: ComponentAppearance;
        selectedAppearance?: ComponentAppearance;
        countAppearance?: ComponentAppearance;
        itemGap?: number;
        label: string;
        items: TabItem[];
        defaultValue: string;
        binding?: Binding;
        variant: 'default' | 'line' | 'buttons' | 'count';
        eventId: string;
    };
    Section: {
        title: string;
        content: Slot;
    };
    Stack: {
        align?: 'start' | 'center' | 'end' | 'stretch';
        direction: 'row' | 'column';
        gap: number;
        content: Slot;
        justify?: 'start' | 'space-between';
        wrap?: 'wrap' | 'nowrap';
    };
    SplitLayout: SplitLayoutProps;
    Repeater: {
        binding?: Binding;
        gap: number;
        content: Slot;
    };
    ScrollPanel: {
        header: Slot;
        content: Slot;
        footer: Slot;
        variant?: 'card' | 'workspace';
        headerPadding?: number;
        contentPadding?: number;
        footerPadding?: number;
    };
    WorkflowProcess: FeedbackData & CockpitBinding & {
        title: string;
        eventId: string;
    };
    ExecutionResult: ProgressData & CockpitBinding & {
        dataSourceId: string;
        eventId: string;
    };
    ThinkingProcess: ExecutionData & CockpitBinding & {
        footer: Slot;
    };
    Link: IconProps & BusyProps & {
        linkAppearance?: ComponentAppearance;
        text: string;
        href: string;
        binding?: Binding;
        hrefBinding?: Binding;
        eventId: string;
    };
    Form: {
        formId: string;
        content: Slot;
        layout?: 'vertical' | 'grid';
        columns?: number;
        minColumnWidth?: number;
        gap?: number;
    };
    Text: BoundTextProps;
    Image: {
        fit?: 'contain' | 'cover';
        radius?: number;
        border?: boolean;
        src: string;
        binding?: Binding;
        alt: string;
        width: number;
        height: number;
    };
    Badge: BoundTextProps & {
        variant: ComponentProps<typeof Badge>['variant'];
        mappings?: {
            value: string;
            label: string;
            variant: ComponentProps<typeof Badge>['variant'];
        }[];
    };
    TextField: UnifiedInputProps;
    NumberField: FieldProps;
    TextareaField: FieldProps;
    SelectField: FieldProps;
    SwitchField: FieldProps;
    ConfigField: ConfigFieldProps;
    RecordListField: RecordListFieldProps;
    ActionButton: BusyProps & {
        presentation?: 'default' | 'text' | 'menu';
        icon?: 'none' | 'sparkles' | 'plus' | 'check' | 'download' | 'refresh' | 'custom';
        iconImage?: {
            src: string;
            name: string;
        };
        iconPosition?: 'start' | 'end';
        iconSize?: number;
        iconGap?: number;
        disabledOpacity?: number;
        buttonAppearance?: ComponentAppearance;
        menuItems?: {
            label: string;
            eventId: string;
            visibleWhen?: Condition;
            disabledWhen?: Condition;
        }[];
        tone?: 'default' | 'primary' | 'danger';
        fullWidth?: boolean;
        label: string;
        binding?: Binding;
        countBinding?: Binding | null;
        eventId: string;
        variant: ComponentProps<typeof Button>['variant'];
        disabledWhen?: Condition;
    };
    DataTable: TableProps;
    SelectionSummary: {
        tableId: string;
        text?: string;
        variant?: 'badge' | 'text';
    };
    Pagination: {
        showTotal?: boolean;
        showPageSize?: boolean;
        showJump?: boolean;
        align?: 'start' | 'center' | 'end';
        paginationAppearance?: ComponentAppearance;
        variant?: 'default' | 'workspace';
        tableId: string;
        dataSourceId: string;
        pageSizeOptions?: number[];
    };
};
export type Materials = {
    [K in keyof MaterialProps]: MaterialProps[K] & {
        displayName?: string;
        visibleWhen?: Condition;
        appearance?: ComponentAppearance;
    };
};
export {};
