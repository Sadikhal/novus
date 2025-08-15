const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-2 rounded-sm cursor-pointer ${
            currentPage === i ? 'bg-lamaSky' : ''
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-2 rounded-sm ${
                currentPage === 1 ? 'bg-lamaSky' : ''
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-2 rounded-sm ${
                currentPage === totalPages ? 'bg-lamaSky' : ''
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="md:p-4 sm:p-3 p-1 flex items-center justify-between text-gray-500 mt-1">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="py-2 md:px-4 sm:px-3 px-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Prev
      </button>
      <div className="flex items-center gap-1 ml-1 md:ml-0 md:gap-2 text-sm">
        {renderPageNumbers()}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="py-2 md:px-4 sm:px-3 px-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;