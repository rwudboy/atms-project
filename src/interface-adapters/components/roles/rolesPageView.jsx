"use client";

import { Button } from "@/interface-adapters/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/interface-adapters/components/ui/card";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/interface-adapters/components/ui/table";
import { Pencil, Eye, Trash2 } from "lucide-react";
import EditRoleModal from "./EditRoleModal";
import ViewRoleModal from "./ViewRoleModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function RolesView({
  roles,
  isLoading,
  modalOpen,
  viewModalOpen,
  deleteModalOpen,
  selectedRole,
  roleToView,
  roleToDelete,
  isDeleting,
  onEdit,
  onView,
  onDelete,
  onUpdateRole,
  onConfirmDelete,
  onCloseModals
}) {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.uuid}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge variant={role.status === "active" ? "success" : "default"}>
                        {role.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{role.member}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onView(role)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEdit(role)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(role)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {modalOpen && selectedRole && (
        <EditRoleModal
          role={selectedRole}
          open={modalOpen}
          onSubmit={onUpdateRole}
          onClose={onCloseModals}
        />
      )}

      {viewModalOpen && roleToView && (
        <ViewRoleModal
          role={roleToView}
          open={viewModalOpen}
          onClose={onCloseModals}
        />
      )}

      {deleteModalOpen && roleToDelete && (
        <DeleteConfirmModal
          open={deleteModalOpen}
          isLoading={isDeleting}
          onConfirm={onConfirmDelete}
          onCancel={onCloseModals}
        />
      )}
    </div>
  );
}
