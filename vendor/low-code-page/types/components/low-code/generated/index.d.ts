export declare const convertedComponents: {
    ConfigurableInput: {
        render: import("@puckeditor/core").PuckComponent<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }>;
        label?: string;
        defaultProps?: (Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }) | undefined;
        fields?: import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}> | undefined;
        permissions?: Partial<import("@puckeditor/core").Permissions>;
        inline?: boolean;
        resolveFields?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            fields: import("@puckeditor/core").Fields<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, {}>;
            lastFields: import("@puckeditor/core").Fields<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, {}>;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            metadata: import("@puckeditor/core").ComponentMetadata;
            appState: import("@puckeditor/core").AppState;
            parent: import("@puckeditor/core").ComponentData | null;
        }) => import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}> | Promise<import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}>>) | undefined;
        resolveData?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            metadata: import("@puckeditor/core").ComponentMetadata;
            trigger: import("@puckeditor/core").ResolveDataTrigger;
            parent: import("@puckeditor/core").ComponentData | null;
            root: import("@puckeditor/core").RootData;
        }) => (Omit<Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, "props"> & {
            props?: Partial<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }> | undefined;
        }) | Promise<Omit<Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, "props"> & {
            props?: Partial<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }> | undefined;
        }>) | undefined;
        resolvePermissions?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            lastPermissions: Partial<import("@puckeditor/core").Permissions>;
            permissions: Partial<import("@puckeditor/core").Permissions>;
            appState: import("@puckeditor/core").AppState;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            parent: import("@puckeditor/core").ComponentData | null;
        }) => Promise<Partial<import("@puckeditor/core").Permissions>> | Partial<import("@puckeditor/core").Permissions>) | undefined;
        metadata?: import("@puckeditor/core").ComponentMetadata;
    } & import("@puckeditor/core").ComponentConfigExtensions;
    ConfigurableTable: {
        render: import("@puckeditor/core").PuckComponent<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }>;
        label?: string;
        defaultProps?: (Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }) | undefined;
        fields?: import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}> | undefined;
        permissions?: Partial<import("@puckeditor/core").Permissions>;
        inline?: boolean;
        resolveFields?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            fields: import("@puckeditor/core").Fields<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, {}>;
            lastFields: import("@puckeditor/core").Fields<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, {}>;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            metadata: import("@puckeditor/core").ComponentMetadata;
            appState: import("@puckeditor/core").AppState;
            parent: import("@puckeditor/core").ComponentData | null;
        }) => import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}> | Promise<import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}>>) | undefined;
        resolveData?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            metadata: import("@puckeditor/core").ComponentMetadata;
            trigger: import("@puckeditor/core").ResolveDataTrigger;
            parent: import("@puckeditor/core").ComponentData | null;
            root: import("@puckeditor/core").RootData;
        }) => (Omit<Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, "props"> & {
            props?: Partial<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }> | undefined;
        }) | Promise<Omit<Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, "props"> & {
            props?: Partial<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }> | undefined;
        }>) | undefined;
        resolvePermissions?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            lastPermissions: Partial<import("@puckeditor/core").Permissions>;
            permissions: Partial<import("@puckeditor/core").Permissions>;
            appState: import("@puckeditor/core").AppState;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            parent: import("@puckeditor/core").ComponentData | null;
        }) => Promise<Partial<import("@puckeditor/core").Permissions>> | Partial<import("@puckeditor/core").Permissions>) | undefined;
        metadata?: import("@puckeditor/core").ComponentMetadata;
    } & import("@puckeditor/core").ComponentConfigExtensions;
    WorkflowResearchReport: {
        render: import("@puckeditor/core").PuckComponent<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }>;
        label?: string;
        defaultProps?: (Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }) | undefined;
        fields?: import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}> | undefined;
        permissions?: Partial<import("@puckeditor/core").Permissions>;
        inline?: boolean;
        resolveFields?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            fields: import("@puckeditor/core").Fields<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, {}>;
            lastFields: import("@puckeditor/core").Fields<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, {}>;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            metadata: import("@puckeditor/core").ComponentMetadata;
            appState: import("@puckeditor/core").AppState;
            parent: import("@puckeditor/core").ComponentData | null;
        }) => import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}> | Promise<import("@puckeditor/core").Fields<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, {}>>) | undefined;
        resolveData?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            metadata: import("@puckeditor/core").ComponentMetadata;
            trigger: import("@puckeditor/core").ResolveDataTrigger;
            parent: import("@puckeditor/core").ComponentData | null;
            root: import("@puckeditor/core").RootData;
        }) => (Omit<Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, "props"> & {
            props?: Partial<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }> | undefined;
        }) | Promise<Omit<Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, "props"> & {
            props?: Partial<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }> | undefined;
        }>) | undefined;
        resolvePermissions?: ((data: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
            lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
        }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type">, params: {
            changed: Partial<Record<string, boolean> & {
                id: string;
            }>;
            lastPermissions: Partial<import("@puckeditor/core").Permissions>;
            permissions: Partial<import("@puckeditor/core").Permissions>;
            appState: import("@puckeditor/core").AppState;
            lastData: Omit<import("@puckeditor/core").ComponentData<Record<string, unknown> & {
                lcEvents?: import("../../../lib/low-code/material-kit/types").MaterialEvents;
            }, string, Record<string, import("@puckeditor/core").DefaultComponentProps>>, "type"> | null;
            parent: import("@puckeditor/core").ComponentData | null;
        }) => Promise<Partial<import("@puckeditor/core").Permissions>> | Partial<import("@puckeditor/core").Permissions>) | undefined;
        metadata?: import("@puckeditor/core").ComponentMetadata;
    } & import("@puckeditor/core").ComponentConfigExtensions;
};
