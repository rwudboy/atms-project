"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getRoles } from "@/framework-drivers/api/roles/roles-usecase"
import { viewRoles } from "@/framework-drivers/api/roles/view-roles"
import { deleteRole } from "@/framework-drivers/api/roles/delete-roles"
import { useAuth } from "@/interface-adapters/context/AuthContext";
import RolesView from "@/interface-adapters/components/roles/rolesPageView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/interface-adapters/components/ui/card";
import { ShieldAlert } from "lucide-react";

// Business helpers
const getDescription = (name) => {
  const lower = name.toLowerCase();
  if (lower === "administrator") return "Full system access";
  if (lower === "manager") return "Manage users and settings";
  if (lower === "auditor") return "Read-only auditing access";
  if (lower === "guest") return "Limited guest access";
  return "System access";
};

const groupRoles = (rawRoles) => {
  return rawRoles.reduce((acc, role) => {
    const existing = acc.find((r) => r.name === role.name);
    if (existing) {
      existing.member += role.member;
      if (role.status === "active") {
        existing.status = "active";
      }
    } else {
      acc.push({
        name: role.name,
        uuid: role.uuid,
        status: role.status,
        member: role.member,
        created: new Date().toLocaleDateString(),
        description: getDescription(role.name),
      });
    }
    return acc;
  }, []);
};

// Page component
export default function RolesPage() {
  const { user } = useAuth();
  const isStaff = user?.role?.toLowerCase() === "staff";

  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToView, setRoleToView] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await getRoles();
      const rolesData = response?.workgroup?.role || [];
      setRoles(groupRoles(rolesData));
    } catch (error) {
      toast.error("Failed to load roles.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (role) => {
    try {
      const response = await viewRoles(role.name);
      const userData = response?.workgroup?.user;

      setRoleToView({
        ...role,
        user: {
          name: userData?.name || "Unknown",
          status: userData?.status || "Unknown",
          userName: userData?.userName || [],
          email: userData?.email || [],
        },
      });

      setViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to load role details.");
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleUpdateRole = async ({ id, body }) => {
    try {
      await updateRole(id, body);
      toast.success(`Updated role to "${body.RoleName}"`);
      fetchRoles();
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update role.");
    }
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRole(roleToDelete.uuid);
      toast.success(`Role '${roleToDelete.name}' deleted successfully`);
      fetchRoles();
      setDeleteModalOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete role.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModals = () => {
    setModalOpen(false);
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedRole(null);
    setRoleToView(null);
    setRoleToDelete(null);
  };

  // Access control view
  if (isStaff) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive opacity-75 mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="pt-2">
              Staff members do not have permission to access the Roles page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <RolesView
      roles={roles}
      isLoading={isLoading}
      modalOpen={modalOpen}
      viewModalOpen={viewModalOpen}
      deleteModalOpen={deleteModalOpen}
      selectedRole={selectedRole}
      roleToView={roleToView}
      roleToDelete={roleToDelete}
      isDeleting={isDeleting}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onUpdateRole={handleUpdateRole}
      onConfirmDelete={handleConfirmDelete}
      onCloseModals={handleCloseModals}
    />
  );
}
