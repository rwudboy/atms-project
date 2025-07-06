"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import { Search } from "lucide-react";

export default function ProjectInstanceSearch({ searchTerm, onSearchChange }) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}