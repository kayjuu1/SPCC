import {ColumnDef} from "@tanstack/react-table";
import {Member} from "@/types/adminTypes.ts";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import * as React from "react";

export const columns: ColumnDef<Member>[] = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const status = row.getValue("status") as string;
            const statusColors: Record<string, string> = {
                active: "bg-green-500 text-white",
                Inactive: "bg-yellow-500 text-black",
                Dead: "bg-red-500 text-white",
                "Not a Member": "bg-black text-white",
            };

            return (
                <div className={`capitalize font-medium px-2 py-1 rounded ${
                    statusColors[status?.trim() as keyof typeof statusColors] || "bg-gray-500 text-white"
                }`}>
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({row}) => <div className="font-medium">{row.getValue("contact")}</div>,
    },
    {
        accessorKey: "defaulted",
        header: "Defaulted",
        cell: ({row}) => (
            <div className={row.getValue("defaulted") ? "text-red-500" : "text-green-500"}>
                {row.getValue("defaulted") ? "Yes" : "No"}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const member = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(member.id?.toString() as string)}>
                            Copy Member ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Member</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];