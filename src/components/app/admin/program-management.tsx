"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, CreditCard, Star, Percent } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const programs = [
  {
    name: "Premium Points Program",
    type: "Points",
    status: "Active",
    members: 8234,
    created: "2023-01-15",
  },
  {
    name: "Coffee Stamp Card",
    type: "Stamps",
    status: "Active",
    members: 4512,
    created: "2023-06-01",
  },
  {
    name: "VIP Cashback Rewards",
    type: "Cashback",
    status: "Active",
    members: 1024,
    created: "2022-11-20",
  },
  {
    name: "Summer Promotions",
    type: "Points",
    status: "Draft",
    members: 0,
    created: "2024-05-10",
  },
  {
    name: "Holiday Stampede",
    type: "Stamps",
    status: "Archived",
    members: 7890,
    created: "2022-12-01",
  },
];

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "Points":
            return <Star className="h-4 w-4 text-muted-foreground" />;
        case "Stamps":
            return <CreditCard className="h-4 w-4 text-muted-foreground" />;
        case "Cashback":
            return <Percent className="h-4 w-4 text-muted-foreground" />;
        default:
            return null;
    }
}

export default function ProgramManagement() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Programs</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Program
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Programs</CardTitle>
          <CardDescription>
            Create and manage your loyalty programs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <TypeIcon type={program.type} />
                        {program.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={program.status === 'Active' ? 'default' : program.status === 'Draft' ? 'outline' : 'secondary'}>{program.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {program.created}
                  </TableCell>
                  <TableCell className="text-right">{program.members.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
