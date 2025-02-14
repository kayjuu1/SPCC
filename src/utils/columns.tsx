import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/types/adminTypes.ts";
import { Button } from "@/components/ui/button.tsx";
import * as React from "react";
import EditMemberDialog from "@/components/EditMemberDialog";
import {fetchMembers} from "@/utils/constants.ts"; // Import the Edit Member Dialog component

export const columns: ColumnDef<Member>[] = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
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
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => <div className="font-medium">{row.getValue("contact")}</div>,
    },
    {
        accessorKey: "defaulted",
        header: "Defaulted",
        cell: ({ row }) => (
            <div className={row.getValue("defaulted") ? "text-red-500" : "text-green-500"}>
                {row.getValue("defaulted") ? "Yes" : "No"}
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <div className="font-medium">{row.getValue("role")}</div>
        ,
    },
    {
        accessorKey: "society",
        header: "Society",
        cell: ({ row }) => <div className="font-medium">{row.getValue("society")}</div>
        ,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const member = row.original;
            return (
                <EditMemberDialog member={member}  refreshData={fetchMembers}/>
            );
        },
    },

];
