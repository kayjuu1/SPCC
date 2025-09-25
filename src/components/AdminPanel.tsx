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
        <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead 
                                        key={header.id} 
                                        className="font-semibold text-gray-600 px-3 py-3 text-left text-sm whitespace-nowrap"
                                    >
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id} 
                                            className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-8 text-gray-500 text-sm"
                                >
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            data.length
                        )}
                    </span>{' '}
                    of <span className="font-medium">{data.length}</span> members
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 text-sm"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(3, table.getPageCount()) }, (_, i) => {
                            const page = Math.max(0, Math.min(
                                table.getPageCount() - 3,
                                table.getState().pagination.pageIndex - 1
                            )) + i;
                            if (page >= 0 && page < table.getPageCount()) {
                                return (
                                    <Button
                                        key={page}
                                        variant={table.getState().pagination.pageIndex === page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => table.setPageIndex(page)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {page + 1}
                                    </Button>
                                );
                            }
                            return null;
                        })}
                        {table.getPageCount() > 3 && (
                            <span className="px-2 text-sm text-gray-500">...</span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 text-sm"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}