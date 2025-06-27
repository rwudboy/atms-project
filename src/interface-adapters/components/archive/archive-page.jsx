"use client";

import { useState, useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/interface-adapters/components/ui/table";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Search, Eye } from "lucide-react";

import { getProject } from "@/interface-adapters/usecases/archive/get-project";
import { getTasks } from "@/interface-adapters/usecases/archive/get-task"; // Import your getTasks function
import ArchiveDetailModal from "@/interface-adapters/components/modals/archive/archive-modal";

export default function ArchivePage() {
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const result = await getProject(searchTerm);
      setArchives(Array.isArray(result) ? result : []);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleView = async (archive) => {
    // Fetch tasks using the business key from the selected archive
    const tasks = await getTasks(archive.businessKey);
    setSelectedArchive({
      ...archive,
      tasks // Add tasks to the selected archive object
    });
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Archive References</CardTitle>
            <CardDescription>Manage and view all archived projects.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Archives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archive List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Business Key</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : archives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No archives found
                  </TableCell>
                </TableRow>
              ) : (
                archives.map((archive) => (
                  <TableRow key={archive.businessKey}>
                    <TableCell className="font-medium">{archive.nama}</TableCell>
                    <TableCell>{archive.businessKey}</TableCell>
                    <TableCell>{archive.customer}</TableCell>
                    <TableCell>
                     <Badge variant={archive.status === "UNLOCKED" ? "success" : "default"}>
    {archive.status?.toUpperCase()}
  </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleView(archive)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Archive Detail Modal */}
      {selectedArchive && (
        <ArchiveDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          archive={selectedArchive}
        />
      )}
    </div>
  );
}