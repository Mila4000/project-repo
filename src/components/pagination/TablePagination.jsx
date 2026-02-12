import React from "react";

function TablePagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <ul className="flex -space-x-px text-sm">

        {/* Previous */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-9 h-9 border border-slate-300 rounded-l-md
              text-slate-600 disabled:opacity-40
              hover:bg-slate-300/50 dark:bg-gray-600/20 dark:text-slate-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="m15 19-7-7 7-7" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 border border-slate-300 text-sm font-medium
                ${
                  page === currentPage
                    ? "bg-slate-400/60 text-white"
                    : "text-slate-600 hover:bg-slate-300/50"
                }
                dark:bg-gray-600/20 dark:text-slate-100`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-9 h-9 border border-slate-300 rounded-r-md
              text-slate-600 disabled:opacity-40
              hover:bg-slate-300/50 dark:bg-gray-600/20 dark:text-slate-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </li>

      </ul>
    </div>
  );
}

export default TablePagination;