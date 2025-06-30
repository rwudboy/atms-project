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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/interface-adapters/components/ui/sheet";
import { getWorkgroups } from "@/interface-adapters/usecases/workgroup/get-workgroup";
import { addWorkgroup } from "@/interface-adapters/usecases/workgroup/add-workgroup";
import { deleteWorkgroup } from "@/interface-adapters/usecases/workgroup/delete-workgroup";

import { Label } from "@/interface-adapters/components/ui/label";
import { Search, Plus, Trash2, Users, AlertCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import AddUserModal from "@/interface-adapters/components/modals/workgroup/add-workgroup";
import WorkgroupDetailModal from "@/interface-adapters/components/modals/workgroup/view-workgroup";

export default function WorkgroupsPage() {
  const [workgroups, setWorkgroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddWorkgroupSheet, setShowAddWorkgroupSheet] = useState(false);
  const [newWorkgroupName, setNewWorkgroupName] = useState("");
  const [newWorkgroupProject, setNewWorkgroupProject] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workgroupToDelete, setWorkgroupToDelete] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedWorkgroupForUser, setSelectedWorkgroupForUser] = useState(null);

  const [selectedWorkgroupId, setSelectedWorkgroupId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getWorkgroups(searchTerm);
      setWorkgroups(data);
      setLoading(false);
    };

    const delay = setTimeout(fetchData, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleAddWorkgroup = async () => {
    if (!newWorkgroupName || !newWorkgroupProject) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        name: newWorkgroupName,
        project_name: newWorkgroupProject,
      };
      const response = await addWorkgroup(payload);

      if (response?.workgroup) {
        setWorkgroups((prev) => [...prev, response.workgroup]);
        toast.success("Workgroup added successfully");
        setShowAddWorkgroupSheet(false);
        setNewWorkgroupName("");
        setNewWorkgroupProject("");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      toast.error("Failed to add workgroup");
    }
  };

  const handleDeleteWorkgroup = async () => {
    if (!workgroupToDelete?.uuid) return;

    try {
      await deleteWorkgroup(workgroupToDelete.uuid);
      setWorkgroups((prev) =>
        prev.filter((wg) => wg.uuid !== workgroupToDelete.uuid)
      );
      toast.success("Workgroup deleted successfully");
      setShowDeleteDialog(false);
      setConfirmDeleteStep(false);
    } catch (error) {
      toast.error("Failed to delete workgroup");
    }
  };

  const getStatusColor = (status) => {
    // Convert status to lowercase for comparison, but keep original casing logic
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "active":
        return "text-green-600 bg-green-50";
      case "planning":
        return "text-blue-600 bg-blue-50";
      case "on hold":
        return "text-yellow-600 bg-yellow-50";
      case "inactive":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleOpenAddUserModal = (workgroup) => {
    setSelectedWorkgroupForUser(workgroup);
    setShowAddUserModal(true);
  };

  const handleUserAdded = (userEmail, workgroupId) => {
    toast.success(`User ${userEmail} added to workgroup`);
  };

  const handleOpenViewModal = (workgroupId) => {
    setSelectedWorkgroupId(workgroupId);
    setShowDetailModal(true);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Sheet for adding workgroup */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Workgroup Management</CardTitle>
            <CardDescription>Manage and view all workgroup data across your organization.</CardDescription>
          </div>
          <Sheet open={showAddWorkgroupSheet} onOpenChange={setShowAddWorkgroupSheet}>
            <SheetTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Workgroup</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Workgroup</SheetTitle>
                <SheetDescription>Create a new workgroup for your organization.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="workgroup-name">Workgroup Name</Label>
                  <Input id="workgroup-name" value={newWorkgroupName} onChange={(e) => setNewWorkgroupName(e.target.value)} placeholder="Enter workgroup name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" value={newWorkgroupProject} onChange={(e) => setNewWorkgroupProject(e.target.value)} placeholder="Enter project name" />
                </div>
                <Button onClick={handleAddWorkgroup} className="w-full">Create Workgroup</Button>
              </div>
            </SheetContent>
          </Sheet>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Workgroups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by workgroup name or project..." />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workgroup List</CardTitle>
          <CardDescription>{workgroups.length} workgroups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">Loading workgroups...</TableCell>
                </TableRow>
              ) : workgroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">No workgroups found.</TableCell>
                </TableRow>
              ) : (
                workgroups.map((wg) => (
                  <TableRow key={wg.uuid}>
                    <TableCell className="font-medium">{wg.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wg.status)}`}>
                        {(wg.status || "Unknown").toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{wg.member}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenViewModal(wg.uuid)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenAddUserModal(wg)}>
                          <Users className="h-4 w-4 mr-1" />
                          Add User
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => {
                          setWorkgroupToDelete(wg);
                          setShowDeleteDialog(true);
                          setConfirmDeleteStep(false);
                        }}>
                          <Trash2 className="h-4 w-4" />
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

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Workgroup
            </DialogTitle>
            <DialogDescription>
              {confirmDeleteStep ? (
                <>
                  <p className="font-semibold text-red-600">This action cannot be undone.</p>
                  <p>This will permanently delete <strong>{workgroupToDelete?.name}</strong>.</p>
                </>
              ) : (
                <p>Are you sure you want to delete <strong>{workgroupToDelete?.name}</strong>?</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            {!confirmDeleteStep ? (
              <Button variant="destructive" onClick={() => setConfirmDeleteStep(true)}>Delete</Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteWorkgroup}>Yes, Delete Permanently</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      {selectedWorkgroupForUser && (
        <AddUserModal
          open={showAddUserModal}
          onOpenChange={setShowAddUserModal}
          workgroups={workgroups}
          preSelectedWorkgroup={selectedWorkgroupForUser.uuid}
          onUserAdded={handleUserAdded}
        />
      )}

      {/* View Detail Modal */}
      {selectedWorkgroupId && (
        <WorkgroupDetailModal
          workgroupId={selectedWorkgroupId}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
        />
      )}
    </div>
  );
}