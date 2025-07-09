"use client";

import { useState, useMemo } from "react";

export default function usePagination(items, itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() =>
    Math.max(1, Math.ceil(items.length / itemsPerPage)),
    [items.length, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    currentItems,
    totalItems: items.length,
    handlePageChange,
    resetPage
  };
}