"use client";

import { useState, useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/interface-adapters/components/ui/table";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getProjects } from "@/interface-adapters/usecases/project-instance/get-project";

export default function ProjectInstancePage() {
  const [instances, setInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allInstances, setAllInstances] = useState([]);

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const result = await getProjects();
        const projectData = result.data || []; 
        setAllInstances(projectData);
        setInstances(projectData);
      } catch (error) {
        console.error("Error fetching project instances:", error);
        toast.error("Failed to fetch project instances.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstances();
  }, []);

  useEffect(() => {
    const filtered = allInstances.filter((instance) =>
      instance.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setInstances(filtered);
  }, [searchTerm, allInstances]);

  const handleClaim = (instanceName) => {
    toast.success(`You have claimed ${instanceName}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Project Instances</CardTitle>
            <CardDescription>View and claim available project instances.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Project Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or description..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Instance List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : instances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No project instances found
                  </TableCell>
                </TableRow>
              ) : (
                instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>{instance.name}</TableCell>
                    <TableCell>{instance.description || "No description"}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleClaim(instance.name)}>
                        Claim
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
