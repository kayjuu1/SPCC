import * as React from "react";
import {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent} from "@/components/ui/card";
import {supabase} from "@/supabaseClient.ts";
import {Member} from "@/types/adminTypes";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import AddMemberDialog from "./AddMemberModal";
import {columns} from "@/utils/columns.tsx";
import SideBar from "@/components/SideBar.tsx";
import AddMemberButton from "@/components/AddMemberButton.tsx";

export default function AdminDashboard() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    // Fetch members from Supabase
    const loadMembers = async () => {
        const {data, error} = await supabase.from("members").select("id, name, status, contact, role, society");
        if (error) {
            console.error("Error fetching members:", error);
        } else {
            setMembers(data as Member[]);
        }
    };

    useEffect(() => {
        loadMembers().then(r => console.log("Members Loaded Successfully.", r));
    }, []);

    //Logout function
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/admin/signin";
    };
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <SideBar/>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                <div className="flex justify-between mb-4">
                    <h1 className="text-xl font-bold mb-4">ADMIN DASHBOARD</h1>
                    <AddMemberButton onMemberAdded={loadMembers}/>
                </div>
                <h1 className="text-2xl font-bold text-center">Members</h1>
                <AddMemberDialog isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)}
                                 onMemberAdded={loadMembers}/>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent>
                            <h3 className="text-lg font-semibold">Total Members</h3>
                            <p className="text-2xl">{members.length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <DataTable data={members}/>
            </main>
        </div>
    );
}

export function DataTable({data}: { data: Member[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="max-w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No members found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
