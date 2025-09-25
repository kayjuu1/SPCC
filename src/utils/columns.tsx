import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/lib/supabase";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

export const createColumns = (onDelete: (id: string) => void): ColumnDef<Member>[] => [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const status = row.getValue("status") as string;
            const statusColors: Record<string, string> = {
                Active: "bg-green-500 text-white",
                Inactive: "bg-yellow-500 text-black",
                Dead: "bg-red-500 text-white",
                "Not a Member": "bg-black text-white",
            };

            return (
                <div
                    className={`capitalize font-medium px-2 py-1 rounded ${
                        statusColors[status] || "bg-gray-500 text-white"
                    }`}
                >
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
        accessorKey: "dues",
        header: "Outstanding Dues",
        cell: ({row}) => {
            const dues = row.getValue("dues") as number;
            return (
                <div className={`font-medium ${dues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${dues}
                </div>
            );
        },
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
        accessorKey: "role",
        header: "Role",
        cell: ({row}) => <div className="font-medium">{row.getValue("role")}</div>,
    },
    {
        accessorKey: "society",
        header: "Society",
        cell: ({row}) => <div className="font-medium">{row.getValue("society")}</div>,
    },
    {
        header: "Actions",
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const member = row.original;
            const EditButtonWrapper = () => {
                const navigate = useNavigate();
                
                const handleDelete = async () => {
                    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
                        onDelete(member.id);
                    }
                };
                
                return (
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/members/edit/${member.id}`)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                );
            };
            return <EditButtonWrapper/>;
        },
    }
];