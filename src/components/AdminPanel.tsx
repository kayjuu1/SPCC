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
import {Users, LayoutDashboard} from 'lucide-react';
import AddMemberDialog from "./AddMemberModal";
import {columns} from "@/utils/columns.tsx";
import SideBar from "@/components/SideBar.tsx";
import AddMemberButton from "@/components/AddMemberButton.tsx";
import NavBar from "@/components/NavBar.tsx";

export default function AdminDashboard() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    const loadMembers = async () => {
        const {data, error} = await supabase.from("members").select("id, name, status, contact, role, society");
        if (error) {
            console.error("Error fetching members:", error);
        } else {
            setMembers(data as Member[]);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar/>
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <LayoutDashboard className="w-8 h-8 text-blue-600 mr-3"/>
                                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                            </div>
                            <AddMemberButton onClick={() => setIsAddMemberOpen(true)}/>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="w-12 h-12 text-blue-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Members</p>
                                        <p className="text-3xl font-bold text-gray-800">{members.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Members Table Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Members Overview</h2>
                        <DataTable data={members}/>
                    </div>

                    <AddMemberDialog
                        isOpen={isAddMemberOpen}
                        onClose={() => setIsAddMemberOpen(false)}
                        onMemberAdded={loadMembers}
                    />
                </div>
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
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-gray-50">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-semibold text-gray-600">
                                    {header.isPlaceholder ? null : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-8 text-gray-500"
                            >
                                No members found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </button>
            </div>
        </div>
    );
}