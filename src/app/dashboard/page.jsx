"use client"

import { useState } from "react"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/interface-adapters/components/ui/card"
import { Button } from "@/interface-adapters/components/ui/button"
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/interface-adapters/components/ui/table"
import { Input } from "@/interface-adapters/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/interface-adapters/components/ui/avatar"
import { CheckCircle, Users, AlertTriangle, Calendar, User, ListChecks } from "lucide-react"
import Link from "next/link"

// DataTable Component
function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center py-2">
        <Input
          placeholder="Search tasks..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-12 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mock Data
const unassignedTasks = [
  {
    id: "1",
    title: "Design user interface mockups",
    priority: "High",
    estimatedHours: 8,
    dueDate: "2024-01-15",
    tags: ["Design", "UI/UX"],
  },
  {
    id: "2",
    title: "Implement authentication system",
    priority: "Medium",
    estimatedHours: 12,
    dueDate: "2024-01-20",
    tags: ["Backend", "Security"],
  },
  {
    id: "3",
    title: "API documentation update",
    priority: "Low",
    estimatedHours: 4,
    dueDate: "2024-01-25",
    tags: ["Documentation"],
  },
]

const assignedTasks = [
  {
    id: "4",
    title: "Database schema optimization",
    assignee: "John Doe",
    priority: "High",
    status: "In Progress",
    dueDate: "2024-01-18",
  },
  {
    id: "5",
    title: "Frontend component library",
    assignee: "Jane Smith",
    priority: "Medium",
    status: "Review",
    dueDate: "2024-01-22",
  },
  {
    id: "6",
    title: "Unit test coverage",
    assignee: "Mike Johnson",
    priority: "Low",
    status: "Testing",
    dueDate: "2024-01-30",
  },
  {
    id: "7",
    title: "Performance monitoring setup",
    assignee: "Sarah Wilson",
    priority: "High",
    status: "In Progress",
    dueDate: "2024-01-16",
  },
]

const otherTeamMembers = [
  { name: "Alice Brown", role: "Backend Dev", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Bob White", role: "QA Engineer", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Charlie Green", role: "Product Manager", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Diana Prince", role: "DevOps", avatar: "/placeholder.svg?height=32&width=32" },
]

// Table Columns
const assignedTaskColumns = [
  {
    accessorKey: "title",
    header: "Task Title",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">
            {row
              .getValue("assignee")
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm">{row.getValue("assignee")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <Badge
          variant={
            status === "In Progress"
              ? "default"
              : status === "Review"
                ? "secondary"
                : status === "Testing"
                  ? "outline"
                  : "default"
          }
          className="font-medium"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority")
      return (
        <Badge variant={priority === "High" ? "destructive" : priority === "Medium" ? "default" : "secondary"}>
          {priority}
        </Badge>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="h-3 w-3 text-muted-foreground" />
        {row.getValue("dueDate")}
      </div>
    ),
  },
]

// Main Dashboard Component
export default function DashboardPage() {
  const totalTasks = assignedTasks.length + unassignedTasks.length
  const overdueTasks = 2
  const teamMembers = 1 + otherTeamMembers.length // Rozan + others

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Tasks</CardTitle>
              <CheckCircle className="h-3 w-3 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Overdue</CardTitle>
              <AlertTriangle className="h-3 w-3 text-red-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-xl font-bold">{overdueTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Team Members</CardTitle>
              <Users className="h-3 w-3 text-purple-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-xl font-bold">{teamMembers}</div>
            </CardContent>
          </Card>
        </div>
        {/* Shortcut Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/userProfile" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20 group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    My Profile
                  </CardTitle>
                  <CardDescription className="mt-0">View and manage your personal details.</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/assignTask" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20 group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ListChecks className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    Assign Tasks
                  </CardTitle>
                  <CardDescription className="mt-0">See all tasks assigned to you.</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Workgroup & Team Members Card */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Workgroup
              </CardTitle>
              <CardDescription>Your team and key members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Team Lead */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback className="text-lg">RK</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0">
                    <h4 className="font-bold text-lg">Rozan Kurnia Pratama</h4>
                    <p className="text-sm text-muted-foreground">UI Designer</p>
                  </div>
                </div>
              </div>
              {/* Other Team Members */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">Other Team Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
                  {otherTeamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-sm">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Tasks Table */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0">
                  <CardTitle className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Active Tasks
                  </CardTitle>
                  <CardDescription>Monitor progress of currently assigned tasks</CardDescription>
                </div>
                <Badge variant="outline" className="font-medium text-sm">
                  {assignedTasks.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={assignedTaskColumns} data={assignedTasks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}