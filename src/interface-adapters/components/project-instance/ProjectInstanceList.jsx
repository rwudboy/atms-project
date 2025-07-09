"use client";

import { Button } from "@/interface-adapters/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/interface-adapters/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/interface-adapters/components/ui/table";
import { Eye } from "lucide-react";

export default function ProjectInstanceList({ loading, instances, totalInstances, onClaim, onViewDiagram }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Instance List</CardTitle>
        <CardDescription>
          Showing {instances.length} of {totalInstances} project instances
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
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>
                    {instance.version}
                    {instance.versionTag ? ` (${instance.versionTag})` : ""}
                  </TableCell>
                  <TableCell>{instance.resource}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDiagram(instance)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => onClaim(instance)}>
                        Start
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}