import { useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const usePagination = ({ itemsPerPage = 5, maxVisiblePages = 5 } = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getVisiblePageButtons = () => {
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const PaginationControls = () => {
    const visiblePages = getVisiblePageButtons();

    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {visiblePages.map((page) => (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    setData,
    handlePageChange,
    PaginationControls,
  };
};

export default usePagination;