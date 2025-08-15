const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  if (totalPages <= 1) return null;

  pages.push(1);

  let start = Math.max(2, currentPage - 2);
  let end = Math.min(totalPages - 1, currentPage + 2);

  if (currentPage - 1 <= 3) {
    end = Math.min(5, totalPages - 1);
  }

  if (totalPages - currentPage <= 2) {
    start = Math.max(2, totalPages - 4);
  }

  if (start > 2) pages.push('...');
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push('...');

  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-[#006c88] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Pagination;
