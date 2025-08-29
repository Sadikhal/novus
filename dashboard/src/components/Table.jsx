

import { useState, useMemo } from "react";
import Pagination from "./Pagination";
import { cn } from "../lib/utils";
import { ErrorFallback, Loader } from "./ui/Loaders";

const Table = ({ columns, renderRow, data, error, loading,seller }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const paginationData = useMemo(() => {
    if (!data) return { totalPages: 0, currentItems: [] };
    
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    
    return { totalPages, currentItems };
  }, [data, currentPage, itemsPerPage]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="flex items-center justify-center w-full">
         <ErrorFallback message={error} />
        </div>
      ) : (
        <>
      <div className="w-full overflow-x-scroll">

          <table className="w-full mt-8">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                {columns.map((col,index) => (
                  <th 
              key={index} 
              className={cn(
                "text-nowrap",
                col.className,
                { "hidden": seller && col.accessor === "action" }
              )}
            >
              {col.header}
            </th>
                ))}
              </tr>
            </thead>
            <tbody className="items-start text-start">
              {paginationData.currentItems.length > 0 ? (
                paginationData.currentItems.map(renderRow)
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    </div>
          {paginationData.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={paginationData.totalPages}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Table;