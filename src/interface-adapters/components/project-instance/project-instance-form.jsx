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
        setLoading(true);
        const result = await getProjects();
        
        // In case the API returns data in a different format
        // Make sure we're handling the data correctly
        const projectData = Array.isArray(result) ? result : 
                          Array.isArray(result.data) ? result.data : [];
        
        console.log("Fetched project data:", projectData);
        
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
    if (!searchTerm.trim()) {
      setInstances(allInstances);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allInstances.filter((instance) => {
      const nameMatch = instance.name?.toLowerCase().includes(searchTermLower);
      const keyMatch = instance.key?.toLowerCase().includes(searchTermLower);
      const descMatch = instance.description?.toLowerCase().includes(searchTermLower);
      
      return nameMatch || keyMatch || descMatch;
    });
    
    setInstances(filtered);
  }, [searchTerm, allInstances]);

  const handleClaim = (instance) => {
    toast.success(`You have started ${instance.name}`);
    // Additional logic for claiming can go here
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
              placeholder="Search by name or key..."
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
          <CardDescription>
            Showing {instances.length} of {allInstances.length} project instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading project instances...
                  </TableCell>
                </TableRow>
              ) : instances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No project instances found
                  </TableCell>
                </TableRow>
              ) : (
                instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-medium">{instance.name || "Unnamed"}</TableCell>
                    <TableCell>{instance.key}</TableCell>
                    <TableCell>{instance.version} {instance.versionTag ? `(${instance.versionTag})` : ""}</TableCell>
                    <TableCell>{instance.resource}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleClaim(instance)}>
                       Start
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