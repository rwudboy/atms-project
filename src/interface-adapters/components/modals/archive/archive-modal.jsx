"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/interface-adapters/components/ui/dialog"
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Button } from "@/interface-adapters/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/interface-adapters/components/ui/card"
import { Separator } from "@/interface-adapters/components/ui/separator"
import { Skeleton } from "@/interface-adapters/components/ui/skeleton"
import { Eye, Calendar, User, Clock, ArrowRight, Download, FileText, ImageIcon, File } from "lucide-react"
import { getTasks } from "@/framework-drivers/api/archive/get-task"
import { getToken } from "@/framework-drivers/token/tokenService"
import { toast } from "sonner"

export default function ArchiveDetailModal({ isOpen, onClose, archive }) {
    const [detailData, setDetailData] = useState([])
    const [archiveData, setArchiveData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchDetail = async () => {
            if (!archive?.businessKey) return

            const token = getToken()
            if (!token) {
                toast.error("Authentication required")
                return
            }

            setIsLoading(true)
            try {
                console.log("Fetching tasks for business key:", archive.businessKey)
                const response = await getTasks(archive.businessKey)
                console.log("API Response:", response)

                if (response?.status && response?.data) {
                    setDetailData(response.data.task || [])
                    setArchiveData(response.data)
                } else {
                    setDetailData([])
                    setArchiveData(null)
                }
            } catch (error) {
                console.error("Error fetching tasks:", error)
                setDetailData([])
                setArchiveData(null)
                toast.error("Failed to fetch task details")
            }
            setIsLoading(false)
        }

        if (isOpen && archive) {
            fetchDetail()
        }

        // Reset state when modal closes
        if (!isOpen) {
            setDetailData([])
            setArchiveData(null)
        }
    }, [isOpen, archive])

    const handleDownload = (task) => {
        try {
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/atribut/${task.id}/download`

            // Optionally show a toast before download starts
            toast.success(`Download started for task: ${task.id}`)

            // Open the download URL in a new tab or initiate it directly
            window.open(downloadUrl, '_blank') // or remove '_blank' to download in same tab

            // Optionally show a toast after trigger (note: doesn't guarantee download finished)
            toast.success("File download triggered")
        } catch (error) {
            console.error("Error triggering file download:", error)
            toast.error("Failed to start file download: " + error.message)
        }
    }

    const getFileIcon = (fileType) => {
        const extension = fileType?.split('.').pop()?.toLowerCase()
        switch (extension) {
            case "pdf":
            case "docx":
            case "xlsx":
            case "pptx":
                return <FileText className="h-4 w-4" />
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
                return <ImageIcon className="h-4 w-4" />
            default:
                return <File className="h-4 w-4" />
        }
    }

    const formatTimeStamp = (timestamp) => {
        if (!timestamp) return "Not set"
        
        const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp)
        
        if (isNaN(date.getTime())) {
            return "Invalid date"
        }
        
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const SkeletonTaskCard = () => (
        <Card className="border-l-4 border-l-muted">
            <CardContent className="pt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            <Card className="bg-muted/30 border-dashed">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Skeleton className="h-4 w-4" />
                                        <div className="flex-1">
                                            <Skeleton className="h-3 w-full mb-1" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    // Check if tasks are null or empty
    const hasNoTasks = !isLoading && (!detailData || detailData.length === 0)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-none w-[80vw] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Archive Details: {archiveData?.nama || archive?.nama || archive?.name || "Loading..."}
                    </DialogTitle>
                    <DialogDescription>
                        Business Key: <Badge variant="outline">{archiveData?.businessKey || archive?.businessKey}</Badge>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Customer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold">
                                    {archiveData?.customer || archive?.customer || "Not specified"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant={archive.status === "active" ? "success" : "default"}>
                                    {archive.status?.toUpperCase()}
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Project Tasks & Details
                        </h3>

                        <div className="space-y-4">
                            {isLoading ? (
                                // Show skeleton cards while loading
                                <>
                                    <SkeletonTaskCard />
                                    <SkeletonTaskCard />
                                </>
                            ) : hasNoTasks ? (
                                <>
                                    <Card className="border-l-4 border-l-muted shadow-sm">
                                        <CardContent className="pt-4">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-base">No task detail</h4>
                                                    <Badge variant="secondary" className="text-xs">
                                                        No task
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Owner:</span>
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Created:</span>
                                                        <span>-</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                                                        <File className="h-4 w-4 text-muted-foreground" />
                                                        Attachments
                                                    </h5>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                        <Card className="bg-muted/30 border-dashed min-h-[160px]">
                                                            <CardContent className="p-3 h-full flex items-center justify-center text-sm text-muted-foreground">
                                                                No file uploaded
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                detailData.map((task, index) => (
                                    <Card key={task.id} className="border-l-4 border-l-primary">
                                        <CardContent className="pt-4">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-semibold text-base">
                                                                {task.taskname || task.name}
                                                            </h4>
                                                            <Badge variant="secondary" className="text-xs">
                                                                Task #{index + 1}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    Owner:
                                                                </span>
                                                                <span>{task.createBy || "Unknown"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    Created:
                                                                </span>
                                                                <span>{formatTimeStamp(task.createAt)}</span>
                                                            </div>
                                                            {task.followUp && (
                                                                <div className="flex items-center gap-2">
                                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">
                                                                        Follow Up:
                                                                    </span>
                                                                    <span>{formatTimeStamp(task.followUp)}</span>
                                                                </div>
                                                            )}
                                                            {task.delegation && (
                                                                <div className="flex items-center gap-2">
                                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">
                                                                        Delegation:
                                                                    </span>
                                                                    <Badge variant="outline">
                                                                        {task.delegation}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {task.value && (
                                                            <div>
                                                                <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                                                                    <File className="h-4 w-4" />
                                                                    Attachments
                                                                </h5>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                                    <Card className="bg-muted/30 border-dashed">
                                                                        <CardContent className="p-3">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                {getFileIcon(task.value)}
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-medium text-xs truncate">
                                                                                        {task.value.split('/').pop()}
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground truncate">
                                                                                        {task.value}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleDownload(task)}
                                                                                className="w-full flex items-center gap-2 h-8"
                                                                            >
                                                                                <Download className="h-3 w-3" />
                                                                                Download
                                                                            </Button>
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}