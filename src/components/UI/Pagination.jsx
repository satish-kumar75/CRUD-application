import React from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const Pagination = ({ table }) => (
  <div className="flex justify-between items-center gap-4">
    <div className="flex items-center gap-2">
      <select
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-1 text-slate-300"
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
      >
        {[10, 25, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <span className="text-slate-400">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
    </div>
    <div className="flex gap-2">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        variant="secondary"
        size="sm"
        icon={<ChevronLeft className="h-5 w-5 md:hidden" />}
      >
        <span className="hidden md:inline">Previous</span>
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        variant="secondary"
        size="sm"
        icon={<ChevronRight className="h-5 w-5 md:hidden" />}
      >
        <span className="hidden md:inline">Next</span>
      </Button>
    </div>
  </div>
);

Pagination.propTypes = {
  table: PropTypes.object.isRequired,
};

export default Pagination;
