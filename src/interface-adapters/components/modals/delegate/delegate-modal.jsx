"use client";

import { useEffect, useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Label } from "@/interface-adapters/components/ui/label";
import { Card } from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import { Textarea } from "@/interface-adapters/components/ui/textarea";
import {
  User,
  UserCheck,
  Crown,
  Shield,
  Send,
  Upload,
  FileText,
} from "lucide-react";
import { getUsers } from "@/application-business-layer/usecases/user/getUserList";
import { DelegateTask } from "@/application-business-layer/usecases/assign-task/delegate-task";
import { toast } from "sonner";
import clsx from "clsx";

const getRoleIcon = (role) => {
  switch (role) {
    case "admin": return <Crown className="h-3 w-3" />;
    case "manager": return <Shield className="h-3 w-3" />;
    case "user": return <UserCheck className="h-3 w-3" />;
    default: return <User className="h-3 w-3" />;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case "admin": return "bg-red-100 text-red-800";
    case "manager": return "bg-blue-100 text-blue-800";
    case "user": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function DelegateTaskDialog({ taskId, open, onOpenChange }) {
  const [searchUser, setSearchUser] = useState("");
  const [comment, setComment] = useState("");
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (open) {
      setSearchUser("");
      setComment("");
      setSelectedUserId("");
      setSelectedFile(null);
    }
  }, [open]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        const userData = res.user || res || [];
        setUserList(Array.isArray(userData) ? userData : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
        setUserList([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchUsers();
  }, [open]);

  useEffect(() => {
    const filtered = userList.filter((user) => {
      const query = searchUser.toLowerCase();
      return (
        user.namaLengkap?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  }, [searchUser, userList]);

  const handleUserSelection = (userId) => {
    setSelectedUserId(userId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSend = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await DelegateTask(taskId, {
        userid: selectedUserId,
        deskripsi: comment,
        // Add file handling here if needed
      });

      if (res?.task?.code === 0) {
        toast.success("Task successfully delegated");
        onOpenChange(false);
        setSearchUser("");
        setComment("");
        setSelectedUserId("");
        setSelectedFile(null);
      } else {
        toast.error(res?.task?.message || "Failed to delegate task");
      }
    } catch (error) {
      console.error("Error delegating task:", error);
      toast.error("Failed to delegate task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchUser("");
    setComment("");
    setSelectedUserId("");
    setSelectedFile(null);
    onOpenChange(false);
  };

  const selectedUser = userList.find((user) => user.id === selectedUserId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5 text-primary" />
            <span>User Delegation Task</span>
          </DialogTitle>
          <DialogDescription>
            Select a user to delegate this task to and provide additional details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Search User</Label>
            <Input
              placeholder="Search by name or email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Select User <span className="text-destructive">*</span></Label>
            <div className="grid gap-3 max-h-72 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isLocked = user.status === "locked";
                  const isSelected = selectedUserId === user.id;
                  return (
                    <Card
                      key={user.id}
                      className={clsx(
                        "p-3 border transition-all duration-200",
                        isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:cursor-pointer hover:border-primary hover:shadow-sm",
                        isSelected && !isLocked
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : ""
                      )}
                      onClick={() => {
                        if (!isLocked) handleUserSelection(user.id);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{user.namaLengkap}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground italic">{user.posisi}</p>
                          {isLocked && (
                            <Badge variant="destructive" className="mt-1 text-xs">
                              🔒 Locked
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {Array.isArray(user.Role) &&
                            user.Role.map((role, index) => (
                              <Badge
                                key={`${user.id}-${role}-${index}`}
                                className={`text-[10px] px-2 py-0.5 flex items-center gap-1 ${getRoleColor(role)}`}
                              >
                                {getRoleIcon(role)}
                                <span className="capitalize">{role}</span>
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No users matched your search.</p>
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="text-xs text-muted-foreground mt-1">
                <UserCheck className="h-3 w-3 inline mr-1" />
                Selected: {selectedUser.namaLengkap}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Attach File (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={handleFileChange}
                className="flex-1"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
              <Button variant="outline" size="sm" onClick={() => document.querySelector('input[type="file"]').click()}>
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            {selectedFile && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <FileText className="h-3 w-3" />
                <span>{selectedFile.name}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSubmitting || !selectedUserId}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Delegating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Send</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}