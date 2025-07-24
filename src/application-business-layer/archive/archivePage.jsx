"use client";

import { useState, useEffect } from "react";
import { getProject } from "@/application-business-layer/usecases/archive/get-project";
import { getTasks } from "@/application-business-layer/usecases/archive/get-task";
import ArchiveView from "@/interface-adapters/components/archive/archiveView";
import { useAuth } from "@/interface-adapters/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/interface-adapters/components/ui/card";
import {ShieldAlert } from "lucide-react";


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
  return status === "active" ? "success" : "default";
};

const ITEMS_PER_PAGE = 5;

// Page Component
export default function ArchivePage() {
  const { user } = useAuth();
  const isStaff = user?.role?.toLowerCase() === "staff";
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

   // Show access denied for staff users with the same style as customer page
  if (isStaff) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive opacity-75 mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="pt-2">
              Staff members do not have permission to access the Archive page. 
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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