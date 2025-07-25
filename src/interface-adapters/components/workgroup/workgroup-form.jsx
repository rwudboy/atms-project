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
  Search,
  Trash2,
  Users,
  AlertCircle,
  Eye,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import AddUserModal from "@/interface-adapters/components/modals/workgroup/add-workgroup";
import WorkgroupDetailModal from "@/interface-adapters/components/modals/workgroup/view-workgroup";
import { onRemoveUser } from "@/application-business-layer/usecases/workgroup/remove-user";
import { EditWorkgroupModal } from "@/interface-adapters/components/modals/workgroup/edit-workgroup";
import { getWorkgroups } from "@/application-business-layer/usecases/workgroup/get-workgroup";
import { updateWorkgroup } from "@/application-business-layer/usecases/workgroup/update-workgroup";
import { deleteWorkgroup } from "@/application-business-layer/usecases/workgroup/delete-workgroup";
import { useAuth } from "@/interface-adapters/context/AuthContext";

export default function WorkgroupsPage() {
  const { user } = useAuth();
  const [workgroups, setWorkgroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workgroupToDelete, setWorkgroupToDelete] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedWorkgroupForUser, setSelectedWorkgroupForUser] = useState(null);

  const [selectedWorkgroupId, setSelectedWorkgroupId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [workgroupToEdit, setWorkgroupToEdit] = useState(null);

  const userRole = user?.role?.toLowerCase() || "";

  const fetchWorkgroups = async () => {
    setLoading(true);
    const data = await getWorkgroups(searchTerm);
    setWorkgroups(data);
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(fetchWorkgroups, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleRemoveUserFromWorkgroup = async (workgroupId, userId) => {
    try {
      const response = await onRemoveUser(workgroupId, userId);
      if (response) return Promise.resolve();
      else throw new Error("Failed to remove user");
    } catch (error) {
      console.error("Error removing user from workgroup:", error);
      throw error;
    }
  };

  const handleEditWorkgroup = async (updateData) => {
    try {
      const response = await updateWorkgroup(updateData.id, updateData.body);
      if (response) {
        setWorkgroups((prev) =>
          prev.map((wg) =>
            wg.uuid === updateData.id
              ? { ...wg, name: updateData.body.name, status: updateData.body.status }
              : wg
          )
        );
        toast.success("Workgroup updated successfully");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      toast.error("Failed to update workgroup");
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

  const handleOpenViewModal = (workgroupId) => {
    setSelectedWorkgroupId(workgroupId);
    setShowDetailModal(true);
  };

  const handleOpenEditModal = (workgroup) => {
    setWorkgroupToEdit(workgroup);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowDetailModal(false);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Workgroup Management</CardTitle>
            <CardDescription>
              Manage and view all workgroup data across your organization.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Workgroup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by workgroup name..."
            />
          </div>
        </CardContent>
      </Card>

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
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading workgroups...
                  </TableCell>
                </TableRow>
              ) : workgroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No workgroups found.
                  </TableCell>
                </TableRow>
              ) : (
                workgroups.map((wg) => (
                  <TableRow key={wg.uuid}>
                    <TableCell className="font-medium">{wg.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          wg.status
                        )}`}
                      >
                        {(wg.status || "Unknown").toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{wg.member}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenViewModal(wg.uuid)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        {!userRole.includes("staff") && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditModal(wg)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>

                            {userRole === "manager" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenAddUserModal(wg)}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Add User
                              </Button>
                            )}

                            {userRole !== "manager" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setWorkgroupToDelete(wg);
                                  setShowDeleteDialog(true);
                                  setConfirmDeleteStep(false);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                  <p className="font-semibold text-red-600">
                    This action cannot be undone.
                  </p>
                  <p>
                    This will permanently delete{" "}
                    <strong>{workgroupToDelete?.name}</strong>.
                  </p>
                </>
              ) : (
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{workgroupToDelete?.name}</strong>?
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            {!confirmDeleteStep ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmDeleteStep(true)}
              >
                Delete
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteWorkgroup}>
                Yes, Delete Permanently
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditWorkgroupModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setWorkgroupToEdit(null);
        }}
        workgroup={workgroupToEdit}
        onSave={handleEditWorkgroup}
      />

      {selectedWorkgroupForUser && (
        <AddUserModal
          open={showAddUserModal}
          onOpenChange={setShowAddUserModal}
          workgroups={workgroups}
          preSelectedWorkgroup={selectedWorkgroupForUser.uuid}
          refetchWorkgroups={fetchWorkgroups}
        />
      )}

      {selectedWorkgroupId && (
        <WorkgroupDetailModal
          workgroupId={selectedWorkgroupId}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          onRemoveUser={handleRemoveUserFromWorkgroup}
          onClose={handleClose}
          refetchWorkgroups={fetchWorkgroups}
        />
      )}
    </div>
  );
}
