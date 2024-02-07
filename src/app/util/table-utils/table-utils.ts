import { NzTableSortOrder } from "ng-zorro-antd/table";
import { TableHeaderInterface } from "./table-header.interface";

export class TableUtils {
    static isSortColumnOrderValid(
        sortColumn: string | null,
        sortOrder: string | null,
        tableHeaders: TableHeaderInterface[]
    ): boolean{
        if(sortColumn != null && !tableHeaders.find(h => h.key == sortColumn)) return false;
        if(sortOrder != null && sortOrder != 'ascend' && sortOrder != 'descend') return false;
        return true;
    }

    static setSortTableHeaders(
        sortKey: string | null,
        sortOrder: NzTableSortOrder,
        tableHeaders: TableHeaderInterface[]
    ): TableHeaderInterface[]{
        return tableHeaders.map(h => {
            return {...h, sortOrder: h.key == sortKey ? sortOrder : null}
        });
    }
}