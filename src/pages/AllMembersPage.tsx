import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useMembers} from "@/hooks/useMembers";
import {Plus, Search, UserCheck, Users, UserX} from "lucide-react";
import AddMemberDialog from "@/components/AddMemberButton";
import {createColumns} from "@/utils/columns";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

export default function AllMembersPage() {
    const {members, loading, fetchMembers, deleteMember} = useMembers();
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // Get items per page from settings
    const getItemsPerPage = () => {
        try {
            const savedSettings = localStorage.getItem('spcc-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                return settings.display?.itemsPerPage || 10;
            }
        } catch (error) {
            console.error('Error reading items per page:', error);
        }
        return 10;
    };

    const columns = React.useMemo(() => createColumns(deleteMember), [deleteMember]);

    const table = useReactTable({
        data: members,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: getItemsPerPage(),
            },
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const activeMembers = members.filter(member => member.status === 'Active');
    const inactiveMembers = members.filter(member => member.status !== 'Active');

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-teal-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">All Members</h1>
                    </div>
                    <Button
                        onClick={() => setIsAddMemberOpen(true)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Member
                    </Button>
                </div>
                <p className="text-gray-600 mt-2">
                    Complete member directory and management
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <UserCheck className="w-12 h-12 text-green-600 mr-4"/>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Members</p>
                                <p className="text-3xl font-bold text-gray-800">{activeMembers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <UserX className="w-12 h-12 text-red-600 mr-4"/>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Inactive Members</p>
                                <p className="text-3xl font-bold text-gray-800">{inactiveMembers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Users className="w-12 h-12 text-yellow-600 mr-4"/>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Outstanding Dues</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    ${members.reduce((total, member) => total + (member.dues || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white rounded-lg shadow-sm mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                            <Input
                                placeholder="Search members by name, contact, role, or society..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {table.getRowModel().rows.length} of {members.length} members
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Members Table */}
            <Card className="bg-white rounded-lg shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-teal-600"/>
                        Member Directory
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading members...</div>
                    ) : (
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
                                    Showing {table.getRowModel().rows.length} of {members.length} members
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
                    )}
                </CardContent>
            </Card>

            <AddMemberDialog
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onMemberAdded={fetchMembers}
            />
        </div>
    );
}