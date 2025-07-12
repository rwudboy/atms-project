"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog"
import { Button } from "@/interface-adapters/components/ui/button"
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/interface-adapters/components/ui/avatar"
import { Separator } from "@/interface-adapters/components/ui/separator"
import { Users, User, Shield, X, Loader2, Plus } from "lucide-react"
import { viewWorkgroup } from "@/application-business-layer/usecases/workgroup/view-workgroup"
import { toast } from "sonner"

export default function WorkgroupDetailModal({ workgroupId, open, onOpenChange, onRemoveUser, onClose, refetchWorkgroups }) {
  const [workgroup, setWorkgroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [removedUsers, setRemovedUsers] = useState([])
  const [originalUsers, setOriginalUsers] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (open && workgroupId) {
      setLoading(true)
      setError(null)
      viewWorkgroup(workgroupId)
        .then((data) => {
          let workgroupData = null;

          if (data?.workgroup) {
            if (Array.isArray(data.workgroup)) {
              workgroupData = data.workgroup.find(wg => wg.uuid === workgroupId) || data.workgroup[0];
            } else {
              workgroupData = data.workgroup;
            }
          } else if (Array.isArray(data)) {
            workgroupData = data.find(wg => wg.uuid === workgroupId) || data[0];
          } else {
            workgroupData = data;
          }

          setWorkgroup(workgroupData);
          setOriginalUsers(workgroupData?.user || []);
          setUsers(workgroupData?.user || []);
        })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => setLoading(false))
    } else {
      // Reset states when the dialog is closed
      setWorkgroup(null)
      setRemovedUsers([])
      setOriginalUsers([])
      setUsers([])
    }
  }, [open, workgroupId])

  const handleRemoveUser = (userId, username) => {
    setRemovedUsers(prev => [...prev, { id: userId, username }]);
    setUsers(prev => prev.filter(user => user.id !== userId));

    toast.success(`${username} moved to removed list`)
  }

  const handleRevokeRemoval = (userId, username) => {
    setRemovedUsers(prev => prev.filter(user => user.id !== userId));
    setUsers(prev => [...prev, { id: userId, username }]);

    toast.success(`${username} moved back to members list`)
  }

  const handleSaveChanges = async () => {
    if (removedUsers.length === 0) {
      toast.warning("No users to remove")
      return
    }

    try {
      for (const user of removedUsers) {
        await onRemoveUser(workgroupId, user.id)
      }

      toast.success(`${removedUsers.length} user(s) removed successfully`)
      onOpenChange(false)
      refetchWorkgroups()
    } catch (error) {
      toast.error("Failed to remove users")
      console.error("Error removing users:", error)
    }
  }

  const handleClose = () => {
    setUsers(originalUsers)
    setRemovedUsers([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {loading ? "Loading..." : workgroup?.name || "Unknown"}
                </DialogTitle>
                <DialogDescription>
                  {workgroup?.project?.length > 0 ? `View Detail Project` : "No Project"}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {error ? (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <p className="text-xs text-muted-foreground">Workgroup ID: {workgroupId}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p className="text-sm text-muted-foreground">Loading workgroup data...</p>
          </div>
        ) : workgroup ? (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Workgroup Name</h3>
                <p className="text-lg font-semibold">{workgroup.name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Status</h3>
                <Badge variant="outline" className="w-fit bg-green-50 text-green-600">
                  <Shield className="h-3 w-3 text-green-600" />
                  {workgroup.status?.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Project</h3>
                <p className="text-lg font-semibold">
                  {workgroup.project?.length > 0 ? `${workgroup.project[0].name}` : "No Project"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Members ({users.length || 0})
                  </h3>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {users.length > 0 ? (
                  users.map((user, index) => {
                    const userId = user.id
                    const username = user.username
                    const userRole = user.role?.length > 0 ? user.role[0] : "user"

                    return (
                      <div key={userId || index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={username} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {username?.slice(0, 2)?.toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{username || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">Member</p>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-600">
  {user.role?.length > 0 ? user.role : "staff"}  {/* Use the full role value */}
</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveUser(userId, username)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No members in this workgroup</p>
                  </div>
                )}
              </div>
            </div>

            {removedUsers.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-destructive" />
                      <h3 className="text-sm font-medium text-destructive uppercase tracking-wide">
                        Removed Members ({removedUsers.length})
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {removedUsers.map((user, index) => {
                      const userId = user.id
                      const username = user.username

                      return (
                        <div key={userId || index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={username} />
                            <AvatarFallback className="bg-destructive/10 text-destructive font-medium">
                              {username?.slice(0, 2)?.toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{username || "Unknown User"}</p>
                            <p className="text-sm text-destructive">Removed</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleRevokeRemoval(userId, username)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleSaveChanges}
                disabled={removedUsers.length === 0}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workgroup data available</p>
            <p className="text-xs mt-2">Workgroup ID: {workgroupId}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}