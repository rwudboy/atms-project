"use client";

import { useEffect, useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Input } from "@/interface-adapters/components/ui/input";
import { Textarea } from "@/interface-adapters/components/ui/textarea";
import { Label } from "@/interface-adapters/components/ui/label";
import { getUsers } from "@/interface-adapters/usecases/user/getUserList";
import { DelegateTask } from "@/interface-adapters/usecases/assign-task/delegate-task";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { cn } from "@/interface-adapters/lib/utils"; // Tailwind utility

export default function DelegateTaskDialog({ taskId, open, onOpenChange }) {
  const [searchUser, setSearchUser] = useState("");
  const [comment, setComment] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        if (Array.isArray(res)) {
          setUserList(res);
        } else {
          toast.error("Failed to load user list.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchUsers();
  }, [open]);

  const handleSend = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    const res = await DelegateTask(taskId, {
      userid: selectedUserId,
      deskripsi: comment,
    });

    if (res?.task?.code === 0) {
      toast.success("Task successfully delegated");
      onOpenChange(false); // close modal
      setSearchUser("");
      setComment("");
      setSelectedUserId("");
    } else {
      toast.error(res?.task?.message || "Failed to delegate task");
    }
  };

  const filteredUsers = userList.filter((user) =>
    user.namaLengkap.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Delegation Task
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select a user to delegate this task to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search + User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user-search">Search User</Label>
            <Input
              id="user-search"
              placeholder="Type to search..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <div className="border rounded-md max-h-40 overflow-y-auto mt-2">
              {loading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-muted flex items-center justify-between",
                      selectedUserId === user.id && "bg-muted"
                    )}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <span>{user.namaLengkap}</span>
                    {selectedUserId === user.id && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No user found.
                </div>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <Textarea
            placeholder="Write your comment here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSend} className="px-8">
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
