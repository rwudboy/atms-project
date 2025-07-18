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
import { UserCheck, Send, Upload, FileText, User } from "lucide-react";
import { getUsers } from "@/application-business-layer/usecases/delegate/user-delegate";
import { DelegateTask } from "@/application-business-layer/usecases/assign-task/delegate-task";
import { toast } from "sonner";
import clsx from "clsx";

export default function DelegateTaskDialog({ taskId, instanceId, open, onOpenChange }) {
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
        // Pass the instanceId to getUsers
        const res = await getUsers(instanceId);
        console.log("Get Users Response:", res);
        console.log("Using Instance ID:", instanceId);
        
        const workgroup = res?.data?.[0];
        setUserList(workgroup?.username_workgroup || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
        setUserList([]);
      } finally {
        setLoading(false);
      }
    };

    if (open && instanceId) {
      fetchUsers();
    }
  }, [open, instanceId]);

  useEffect(() => {
    const filtered = userList.filter((user) =>
      user.username?.toLowerCase().includes(searchUser.toLowerCase())
    );
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
        // file upload not handled here
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
            Select a user from the workgroup to delegate this task to.
            {instanceId && (
              <span className="block text-xs text-muted-foreground mt-1">
                Instance ID: {instanceId}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Search User</Label>
            <Input
              placeholder="Search by username..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Select User <span className="text-destructive">*</span></Label>
            <div className="grid gap-3 max-h-72 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading users...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelected = selectedUserId === user.id;
                  return (
                    <Card
                      key={user.id}
                      className={clsx(
                        "p-3 border transition-all duration-200",
                        "hover:cursor-pointer hover:border-primary hover:shadow-sm",
                        isSelected ? "border-primary bg-primary/10 ring-2 ring-primary/20" : ""
                      )}
                      onClick={() => handleUserSelection(user.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.fullName}</p>
                        </div>
                        <Badge className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800">
                          <User className="h-3 w-3 mr-1" />
                          Member
                        </Badge>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {instanceId ? "No users found." : "No instance ID available."}
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="text-xs text-muted-foreground mt-1">
                <UserCheck className="h-3 w-3 inline mr-1" />
                Selected: {selectedUser.username}
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