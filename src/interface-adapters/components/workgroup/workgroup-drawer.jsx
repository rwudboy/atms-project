"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/interface-adapters/components/ui/drawer";
import { Input } from "@/interface-adapters/components/ui/input";
import { Button } from "@/interface-adapters/components/ui/button";
import { Label } from "@/interface-adapters/components/ui/label";
import { addWorkgroup } from "@/application-business-layer/usecases/workgroup/add-workgroup";
import { getUsers } from "@/application-business-layer/usecases/user/getUserList";
import { getProject } from "@/application-business-layer/usecases/archive/get-project";
import { useIsMobile } from "@/framework-drivers/hooks/use-mobile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AddWorkgroupDrawer({ onWorkgroupAdded, trigger }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessKey: "",
    uuid: ""
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  // Fetch data before opening drawer
  const handleOpenDrawer = async (open) => {
    if (open && (users.length === 0 || projects.length === 0)) {
      setLoadingData(true);
      setError(null);
      try {
        // Fetch both users and projects concurrently
        const [usersResponse, projectsResponse] = await Promise.all([
          getUsers(),
          getProject()
        ]);

        // Process users data - handle both possible response formats
        if (Array.isArray(usersResponse)) {
          // Direct array response
          const sortedUsers = [...usersResponse].sort((a, b) =>
            a.namaLengkap.localeCompare(b.namaLengkap)
          );
          setUsers(sortedUsers);
        } else if (usersResponse?.user && Array.isArray(usersResponse.user)) {
          // Nested object response
          const sortedUsers = [...usersResponse.user].sort((a, b) =>
            a.namaLengkap.localeCompare(b.namaLengkap)
          );
          setUsers(sortedUsers);
        } else {
          console.error("Unexpected users response format:", usersResponse);
          throw new Error("Failed to load users data: unexpected format");
        }

        // Process projects data - handle both possible response formats
        if (Array.isArray(projectsResponse)) {
          // Direct array response
          const sortedProjects = [...projectsResponse].sort((a, b) =>
            a.nama.localeCompare(b.nama)
          );
          setProjects(sortedProjects);
        } else if (projectsResponse?.data && Array.isArray(projectsResponse.data)) {
          // Nested object response
          const sortedProjects = [...projectsResponse.data].sort((a, b) =>
            a.nama.localeCompare(b.nama)
          );
          setProjects(sortedProjects);
        } else {
          console.error("Unexpected projects response format:", projectsResponse);
          throw new Error("Failed to load projects data: unexpected format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load necessary data. Please try again.");
        toast.error(error.message || "Failed to load users or projects");
        return; // Don't open drawer if data fetch fails
      } finally {
        setLoadingData(false);
      }
    }
    setOpenDrawer(open);
  };

  const handleAddWorkgroup = async () => {
    if (!formData.name || !formData.businessKey || !formData.uuid) {
      toast.warning("Please complete all fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      const result = await addWorkgroup(formData);

      if (result.success) {
        toast.success(result.message || "✅ Workgroup successfully created.");
        onWorkgroupAdded(); 
        setFormData({ name: "", businessKey: "", uuid: "" });
        setOpenDrawer(false);
      } else {
        toast.error(result.message || "❌ Failed to add workgroup.");
        console.error("Error creating workgroup:", result);
      }
    } catch (err) {
      console.error("Caught error:", err);
      toast.error("❌ Failed to add workgroup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when drawer closes
  useEffect(() => {
    if (!openDrawer) {
      setFormData({ name: "", businessKey: "", uuid: "" });
    }
  }, [openDrawer]);

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={handleOpenDrawer}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <div className="w-full max-w-2xl mx-auto px-6 py-4">
          <DrawerHeader>
            <DrawerTitle>Add New Workgroup</DrawerTitle>
            <DrawerDescription>
              Fill out the workgroup details below.
            </DrawerDescription>
          </DrawerHeader>

          {error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                onClick={() => handleOpenDrawer(true)}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading data...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Workgroup Name</Label>
                <Input
                  placeholder="Enter workgroup name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Project</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.businessKey}
                  onChange={(e) =>
                    setFormData({ ...formData, businessKey: e.target.value })
                  }
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.businessKey || index} value={project.businessKey}>
                      {project.nama} - {project.customer}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Manager</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.uuid}
                  onChange={(e) =>
                    setFormData({ ...formData, uuid: e.target.value })
                  }
                >
                  <option value="">Select a user</option>
                  {users
                    .filter((user) => user.Role.includes("manager"))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.namaLengkap} - {user.Role[0]}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          )}

          <DrawerFooter className="mt-4">
            <Button
              onClick={handleAddWorkgroup}
              disabled={loading || loadingData || !!error}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}