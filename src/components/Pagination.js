import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <li key={i} className={currentPage === i ? 'active' : ''}>
          <button onClick={() => onPageChange(i)}>{i}</button>
        </li>
      );
    }
    return paginationItems;
  };

  return (
    <div className="pagination">
      <ul>{renderPaginationItems()}</ul>
    </div>
  );
};

export default Pagination;
