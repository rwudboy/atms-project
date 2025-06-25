"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/interface-adapters/components/ui/alert";
import { Search, Plus, Trash2 } from "lucide-react";
import {
  getWorkgroups,
  deleteWorkgroup,
} from "@/interface-adapters/usecases/workgroup/workgroup-usecase";
import AddWorkgroupDrawer from "@/interface-adapters/components/workgroup/workgroup-drawer";
import AddUserModal from "@/interface-adapters/components/modals/workgroup/workgroup-modal";
import { toast } from "sonner";

export default function WorkgroupssPage() {
  const router = useRouter();
  const [workgroups, setWorkgroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workgroupToDelete, setWorkgroupToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [fullWorkgroups, setFullWorkgroups] = useState([]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedWorkgroupForUser, setSelectedWorkgroupForUser] = useState(null);

  useEffect(() => {
    const fetchWorkgroups = async () => {
      try {
        const result = await getWorkgroups("");
        setFullWorkgroups(result);
        setWorkgroups(result); // Initialize with full list
      } catch (error) {
        console.error("Error fetching workgroups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkgroups();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const result = await getWorkgroups(searchTerm);
      setWorkgroups(result);
      setLoading(false);
    }, 1000); // 1 second debounce

    return () => clearTimeout(delayDebounce); // Cleanup
  }, [searchTerm]);

  const handleDeleteClick = (uuid) => {
    setWorkgroupToDelete(uuid);
    setShowDeleteDialog(true);
    setDeleteError(null);
    setConfirmDeleteStep(false);
  };

  const handleDeleteWorkgroup = async () => {
    try {
      await deleteWorkgroup(workgroupToDelete);
      setWorkgroups(workgroups.filter((wg) => wg.uuid !== workgroupToDelete));
      setShowDeleteDialog(false);
      setWorkgroupToDelete(null);
      setConfirmDeleteStep(false);
      toast.success("The workgroup has been successfully deleted.");
    } catch (error) {
      setDeleteError("Failed to delete the workgroup.");
      toast.error("There was an error deleting the workgroup.");
    }
  };

  const handleWorkgroupAdded = (newWorkgroup) => {
    toast.success("Add Workgroup success");
    const workgroupData = newWorkgroup.user[0];
    setWorkgroups((prev) => [...prev, workgroupData]);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Workgroup References</CardTitle>
            <CardDescription>
              Manage and view all workgroup data.
            </CardDescription>
          </div>
          <AddWorkgroupDrawer
            onWorkgroupAdded={handleWorkgroupAdded}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Workgroup
              </Button>
            }
          />
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Workgroups</CardTitle>
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
          <CardTitle>Workgroup List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : workgroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No workgroups found
                  </TableCell>
                </TableRow>
              ) : (
                workgroups.map((wg) => (
                  <TableRow key={wg.uuid}>
                    <TableCell className="font-medium">{wg.name}</TableCell>
                    <TableCell>{wg.status || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkgroupForUser(wg.uuid);
                            setShowAddUserModal(true);
                          }}
                        >
                          Add User
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(wg.uuid)}
                        >
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workgroup</DialogTitle>
            <DialogDescription>
              {confirmDeleteStep
                ? "Are you absolutely sure? This will permanently delete the workgroup."
                : "Are you sure you want to delete this workgroup? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setConfirmDeleteStep(false);
              }}
            >
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

      <AddUserModal
        open={showAddUserModal}
        onOpenChange={setShowAddUserModal}
        workgroups={fullWorkgroups}
        preSelectedWorkgroup={selectedWorkgroupForUser}
        onUserAdded={(user, workgroupId) => {
          toast.success(`${user.namaLengkap} added to the workgroup`);
          setShowAddUserModal(false);
        }}
      />
    </div>
  );
}
