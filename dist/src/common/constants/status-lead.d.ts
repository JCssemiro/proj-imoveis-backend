export declare const STATUS_LEAD: {
    readonly NEW: 1;
    readonly CONTACTED: 2;
    readonly IN_PROGRESS: 3;
    readonly CLOSED: 4;
};
export type StatusLeadCode = (typeof STATUS_LEAD)[keyof typeof STATUS_LEAD];
export declare function isClosedStatus(status: number): boolean;
