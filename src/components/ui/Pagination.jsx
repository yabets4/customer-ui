// Pagination.jsx
import React from 'react';

/**
 * A reusable and responsive pagination component.
 * It uses Tailwind CSS for styling and provides navigation controls
 * for moving between pages of data.
 *
 * @param {Object} props - The component props.
 * @param {number} props.currentPage - The current active page number (1-indexed).
 * @param {number} props.totalPages - The total number of available pages.
 * @param {function(number): void} props.onPageChange - Callback function
 * invoked when a page number is clicked.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Helper function to generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Display a maximum of 5 page numbers (e.g., 1, 2, 3, 4, 5 or ..., 8, 9, 10, 11, ...)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if we're at the end of the total pages
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2 py-4 font-inter">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out shadow-sm"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-sm font-medium rounded-md
            ${currentPage === page
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
            transition-all duration-200 ease-in-out shadow-sm`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out shadow-sm"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
