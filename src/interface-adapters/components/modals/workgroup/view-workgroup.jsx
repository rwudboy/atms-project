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
import { Users, User, Shield, X, Loader2 } from "lucide-react"
import { viewWorkgroup } from "@/application-business-layer/usecases/workgroup/view-workgroup"
import { toast } from "sonner"

export default function WorkgroupDetailModal({ workgroupId, open, onOpenChange, onRemoveUser }) {
  const [workgroup, setWorkgroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [removingUsers, setRemovingUsers] = useState(new Set()) // Track which users are being removed

  useEffect(() => {
    if (open && workgroupId) {
      setLoading(true)
      setError(null)
      viewWorkgroup(workgroupId)
        .then((data) => setWorkgroup(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [open, workgroupId])

  const handleRemoveUser = async (userId, username) => {
    if (!onRemoveUser) {
      toast.error("Remove user function not available")
      return
    }

    // Add user to removing set
    setRemovingUsers(prev => new Set(prev).add(userId))

    try {
      await onRemoveUser(workgroupId, userId)
      
      // Remove user from local state on success
      setWorkgroup(prev => ({
        ...prev,
        user: prev.user.filter(user => user.id !== userId)
      }))
      
      toast.success(`${username} removed from workgroup`)
    } catch (error) {
      console.error("Error removing user:", error)
      toast.error("Failed to remove user")
    } finally {
      // Remove user from removing set
      setRemovingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <DialogDescription>Workgroup Details</DialogDescription>
              </div>
            </div>
            {workgroup && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                {workgroup.status?.toUpperCase()}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading workgroup data...</p>
        ) : workgroup ? (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Workgroup Name</h3>
                <p className="text-lg font-semibold">{workgroup.name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Status</h3>
                <Badge variant="outline" className="w-fit">{workgroup.status?.toUpperCase()}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Members ({workgroup.user?.length || 0})
                  </h3>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {workgroup.user?.length > 0 ? (
                  workgroup.user.map((user, index) => {
                    // Handle both string array and object array
                    const userId = user.id || user.uuid || index
                    const username = user.username || user.name || user
                    const isRemoving = removingUsers.has(userId)
                    
                    return (
                      <div key={userId} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={username} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{username}</p>
                          <p className="text-sm text-muted-foreground">Member</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveUser(userId, username)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
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

            <Separator />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}