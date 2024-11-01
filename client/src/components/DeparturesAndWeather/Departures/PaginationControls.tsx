// PaginationControls.tsx
import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: "next" | "prev") => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev onClick={() => onPageChange("prev")} disabled={currentPage === 1}>
        Previous
      </Pagination.Prev>
      <Pagination.Item active>{`Page ${currentPage} of ${totalPages}`}</Pagination.Item>
      <Pagination.Next onClick={() => onPageChange("next")} disabled={currentPage === totalPages}>
        Next
      </Pagination.Next>
    </Pagination>
  );
};

export default PaginationControls;
