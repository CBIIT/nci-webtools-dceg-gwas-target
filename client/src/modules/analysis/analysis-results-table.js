import { useState } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function AnalysisResultsTable({ data, columns }) {
  const [sorting, setSorting] = useState([{ id: "P", desc: false }]);
  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 25 } },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="table-responsive" tabIndex={0} role="region" aria-label="Analysis results">
        <Table striped hover>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} className={header.column.columnDef.className}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer" : ""}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                        role={header.column.getCanSort() ? "button" : undefined}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()(e);
                          }
                        }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className="bi bi-sort-up ms-1" />,
                          desc: <i className="bi bi-sort-down ms-1" />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cell.column.columnDef.className}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <small>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </small>
        <div className="d-flex flex-wrap">
          <Form.Select
            size="sm"
            aria-label="table-pagination"
            className="w-auto me-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}>
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Select>
          <Pagination className="mb-0" size="sm">
            <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className="d-none d-md-inline-block">First</span>
              <span className="d-inline-block d-md-none">&lt;&lt;</span>
            </Pagination.First>
            <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="d-none d-md-inline-block">Previous</span>
              <span className="d-inline-block d-md-none">&lt;</span>
            </Pagination.Prev>

            <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="d-none d-md-inline-block">Next</span>
              <span className="d-inline-block d-md-none">&gt;</span>
            </Pagination.Next>

            <Pagination.Last
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <span className="d-none d-md-inline-block">Last</span>
              <span className="d-inline-block d-md-none">&gt;&gt;</span>
            </Pagination.Last>
          </Pagination>
        </div>
      </div>
    </>
  );
}
