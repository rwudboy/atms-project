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
import { Users, User, Shield } from "lucide-react"
import { viewWorkgroup } from "@/interface-adapters/usecases/workgroup/view-workgroup"

export default function WorkgroupDetailModal({ workgroupId, open, onOpenChange }) {
  const [workgroup, setWorkgroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
                {workgroup.status}
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
                <Badge variant="outline" className="w-fit">{workgroup.status}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Members ({workgroup.user?.length || 0})
                </h3>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {workgroup.user?.map((username, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
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
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                ))}
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
