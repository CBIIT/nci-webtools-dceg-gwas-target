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

export const geneAnalysisColumns = [
  {
    header: "GENE",
    accessorKey: "GENE",
    className: "text-nowrap",
  },
  {
    header: "CHR",
    accessorKey: "CHR",
    className: "text-nowrap text-end",
  },
  {
    header: "START (hg19)",
    accessorKey: "START",
    className: "text-nowrap text-end",
  },
  {
    header: "STOP (hg19)",
    accessorKey: "STOP",
    className: "text-nowrap text-end",
  },
  {
    header: "NSNPS",
    accessorKey: "NSNPS",
    className: "text-nowrap text-end",
  },
  {
    header: "NPARAM",
    accessorKey: "NPARAM",
    className: "text-nowrap text-end",
  },
  {
    header: "N",
    accessorKey: "N",
    className: "text-nowrap text-end",
  },
  {
    header: "ZSTAT",
    accessorKey: "ZSTAT",
    className: "text-nowrap text-end",
  },
  {
    header: "P",
    accessorKey: "P",
    className: "text-nowrap text-end",
  },
];

export default function AnalysisResultsTable({ results }) {
  const [sorting, setSorting] = useState([{ id: "P", desc: false }]);
  const table = useReactTable({
    data: results.geneAnalysis,
    columns: geneAnalysisColumns,
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
      <Table striped hover responsive>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className={header.column.columnDef.className}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? "cursor-pointer" : ""}
                      onClick={header.column.getToggleSortingHandler()}>
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

      <div className="d-flex justify-content-between">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="d-flex">
          <Form.Select
            size="sm"
            aria-label="table-pagination"
            className="me-1"
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
          <Pagination className="mb-0">
            <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              First
            </Pagination.First>
            <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Pagination.Prev>

            <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Pagination.Next>

            <Pagination.Last
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              Last
            </Pagination.Last>
          </Pagination>
        </div>
      </div>
    </>
  );
}
