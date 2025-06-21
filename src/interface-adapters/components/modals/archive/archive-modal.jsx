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
import { Eye, Calendar, User, Clock, ArrowRight, Download, FileText, ImageIcon, File } from "lucide-react"
import { getTasks } from "@/interface-adapters/usecases/archive/get-task"

export default function ArchiveDetailModal({ isOpen, onClose, archive }) {
    const [detailData, setDetailData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchDetail = async () => {
            if (!archive?.businessKey) return
            setIsLoading(true)
            const tasks = await getTasks(archive.businessKey)
            setDetailData(tasks)
            setIsLoading(false)
        }

        if (isOpen) {
            fetchDetail()
        }
    }, [isOpen, archive])

    const handleDownload = async (file) => {
        try {
            let content = "Mock file content for " + file.name
            let mimeType = "application/octet-stream"

            const blob = new Blob([content], { type: mimeType })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading file:", error)
        }
    }

    const getFileIcon = (fileType) => {
        switch (fileType) {
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

    const formatDate = (dateString) => {
        if (!dateString) return "Not set"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-none w-[80vw] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Archive Details: {archive?.name}
                    </DialogTitle>
                    <DialogDescription>
                        Business Key: <Badge variant="outline">{archive?.businessKey}</Badge>
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
                                    {archive?.customer || "Not specified"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge
                                    variant={archive?.status === "Active" ? "default" : "secondary"}
                                >
                                    {archive?.status || "Unknown"}
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

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-muted-foreground">
                                    Loading project details...
                                </p>
                            </div>
                        ) : detailData.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No project details found
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {detailData.map((task, index) => (
                                    <Card key={task.id} className="border-l-4 border-l-primary">
                                        <CardContent className="pt-4">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-base mb-2">
                                                            {task.name}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    Owner:
                                                                </span>
                                                                <span>{task.owner || "Unassigned"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    Assignee:
                                                                </span>
                                                                <span>{task.assignee || "Unassigned"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    Created:
                                                                </span>
                                                                <span>{formatDate(task.created)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    Due Date:
                                                                </span>
                                                                <span>{formatDate(task.due_date)}</span>
                                                            </div>
                                                            {task.followUp && (
                                                                <div className="flex items-center gap-2">
                                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">
                                                                        Follow Up:
                                                                    </span>
                                                                    <span>{formatDate(task.followUp)}</span>
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
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            Task #{index + 1}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}
