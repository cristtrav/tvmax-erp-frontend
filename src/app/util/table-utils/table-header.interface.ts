import { NzTableSortOrder, NzTableSortFn } from "ng-zorro-antd/table";

export interface TableHeaderInterface {
    key?: string;
    description: string;
    sortOrder: NzTableSortOrder;
    sortFn: NzTableSortFn | boolean | null;
}