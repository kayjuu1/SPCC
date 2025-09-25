import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent} from "@/components/ui/card";
import {Member} from "@/lib/supabase";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {LayoutDashboard, Plus, Users} from 'lucide-react';
import AddMemberDialog from "./AddMemberButton";
import {createColumns} from "@/utils/columns";
import {useMembers} from "@/hooks/useMembers";
import {Button} from "@/components/ui/button";

export default function AdminDashboard() {
    const {members, loading, fetchMembers, deleteMember} = useMembers();
    const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);

    const columns = React.useMemo(() => createColumns(deleteMember), [deleteMember]);

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <LayoutDashboard className="w-8 h-8 text-teal-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <Button
                        onClick={() => setIsAddMemberOpen(true)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Users className="w-12 h-12 text-teal-600 mr-4"/>
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
                {loading ? (
                    <div className="text-center py-8">Loading members...</div>
                ) : (
                    <DataTable data={members} columns={columns}/>
                )}
            </div>

            <AddMemberDialog
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onMemberAdded={fetchMembers}
            />
        </div>
    );
}

export function DataTable({data, columns}: { data: Member[], columns: any[] }) {
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
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-500">
                    Showing {table.getRowModel().rows.length} of {data.length} members
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}