import React from "react";
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}
interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: (item: any) => React.ReactNode;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  searchable?: boolean;
  onSearch?: (term: string) => void;
}
export function DataTable({
  columns,
  data,
  actions,
  onSort,
  sortKey,
  sortDirection,
  searchable = false,
  onSearch
}: DataTableProps) {
  return <div className="w-full">
      {searchable && <div className="mb-4">
          <div className="relative">
            <input type="text" placeholder="Search..." onChange={e => onSearch?.(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <SearchIcon className="absolute left-3 top-2.5 text-slate-400" size={20} />
          </div>
        </div>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(column => <th key={column.key} className="text-left p-4 font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && onSort && <button onClick={() => onSort(column.key)} className="text-slate-400 hover:text-slate-600">
                        {sortKey === column.key ? sortDirection === "asc" ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} /> : <div className="flex flex-col">
                            <ChevronUpIcon size={16} />
                            <ChevronDownIcon size={16} className="-mt-2" />
                          </div>}
                      </button>}
                  </div>
                </th>)}
              {actions && <th className="w-24"></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                {columns.map(column => <td key={column.key} className="p-4">
                    {item[column.key]}
                  </td>)}
                {actions && <td className="p-4">
                    <div className="flex justify-end">{actions(item)}</div>
                  </td>}
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}