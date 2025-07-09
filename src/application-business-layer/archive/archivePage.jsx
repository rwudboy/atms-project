"use client";

import { useState, useEffect } from "react";
import { getProject } from "@/application-business-layer/usecases/archive/get-project";
import { getTasks } from "@/application-business-layer/usecases/archive/get-task";
import ArchiveView from "@/interface-adapters/components/archive/archiveView";

// Business Functions
const filterArchivesByName = (archives, searchTerm) => {
  if (!searchTerm.trim()) return archives;
  const lower = searchTerm.toLowerCase();
  return archives.filter(archive =>
    archive.nama?.toLowerCase().includes(lower)
  );
};

const formatArchiveStatus = (status) => {
  return status?.toUpperCase() || "UNKNOWN";
};

const getStatusVariant = (status) => {
  return status === "UNLOCKED" ? "success" : "default";
};

const ITEMS_PER_PAGE = 5;

// Page Component
export default function ArchivePage() {
  const [allArchives, setAllArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch the complete list of archives initially
  useEffect(() => {
    const fetchAllArchives = async () => {
      setLoading(true);
      const result = await getProject("");
      const allData = Array.isArray(result) ? result : [];
      setAllArchives(allData);
      setFilteredArchives(allData);
      setLoading(false);
    };

    fetchAllArchives();
  }, []);

  // Local search filtering based on archive name
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    const filtered = filterArchivesByName(allArchives, newSearchTerm);
    setFilteredArchives(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = async (archive) => {
    try {
      const tasks = await getTasks(archive.businessKey);
      setSelectedArchive({
        ...archive,
        tasks
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedArchive(null);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredArchives.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArchives = filteredArchives.slice(startIndex, endIndex);

  return (
    <ArchiveView
      archives={currentArchives}
      searchTerm={searchTerm}
      loading={loading}
      selectedArchive={selectedArchive}
      modalOpen={modalOpen}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={filteredArchives.length}
      onSearchChange={handleSearchChange}
      onView={handleView}
      onCloseModal={handleCloseModal}
      onPageChange={handlePageChange}
      formatArchiveStatus={formatArchiveStatus}
      getStatusVariant={getStatusVariant}
    />
  );
}