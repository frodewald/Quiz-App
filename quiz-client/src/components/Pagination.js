import React from 'react';

const Pagination = ({ totalRecords, recordsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    if (currentPage > 4) {
      pageNumbers.push("...");
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 3) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="d-flex justify-content-center my-4 pagination-button">
      <button
        className="btn btn-outline-primary me-2"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pageNumbers.map((number, index) => (
        <button
          key={index}
          className={`btn btn-outline-primary me-2 ${currentPage === number ? 'active' : ''}`}
          onClick={() => typeof number === "number" && handlePageClick(number)}
          disabled={typeof number !== "number"}
        >
          {number}
        </button>
      ))}

      <button
        className="btn btn-outline-primary ms-2"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
