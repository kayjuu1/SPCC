import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeletedMembers } from "@/hooks/useDeletedMembers";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import SideBar from "@/components/SideBar";

export default function DeletedMembersPage() {
    const { deletedMembers, loading, restoreMember, permanentlyDelete } = useDeletedMembers();

    const handleRestore = async (deletedMember: any) => {
        if (window.confirm(`Are you sure you want to restore ${deletedMember.member_data.name}?`)) {
            await restoreMember(deletedMember);
        }
    };

    const handlePermanentDelete = async (id: string, memberName: string) => {
        if (window.confirm(`Are you sure you want to permanently delete ${memberName}? This action cannot be undone.`)) {
            await permanentlyDelete(id);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center">
                            <Trash2 className="w-8 h-8 text-red-600 mr-3"/>
                            <h1 className="text-2xl font-bold text-gray-800">Deleted Members</h1>
                        </div>
                        <p className="text-gray-600 mt-2">
                            Manage deleted members - restore or permanently remove them
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Trash2 className="w-12 h-12 text-red-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Deleted Members</p>
                                        <p className="text-3xl font-bold text-gray-800">{deletedMembers.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-12 h-12 text-yellow-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Awaiting Action</p>
                                        <p className="text-3xl font-bold text-gray-800">{deletedMembers.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Deleted Members Table */}
                    <Card className="bg-white rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Trash2 className="w-5 h-5 mr-2 text-red-600"/>
                                Deleted Members Archive
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading deleted members...</div>
                            ) : deletedMembers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                                    <p className="text-lg font-medium">No deleted members</p>
                                    <p className="text-sm">All members are currently active</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Society</TableHead>
                                            <TableHead>Deleted Date</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {deletedMembers.map((deletedMember) => (
                                            <TableRow key={deletedMember.id}>
                                                <TableCell className="font-medium">
                                                    {deletedMember.member_data.name}
                                                </TableCell>
                                                <TableCell>{deletedMember.member_data.contact}</TableCell>
                                                <TableCell>{deletedMember.member_data.role}</TableCell>
                                                <TableCell>{deletedMember.member_data.society}</TableCell>
                                                <TableCell>
                                                    {new Date(deletedMember.deleted_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {deletedMember.reason || 'No reason provided'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                                            onClick={() => handleRestore(deletedMember)}
                                                        >
                                                            <RotateCcw className="w-4 h-4 mr-1" />
                                                            Restore
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handlePermanentDelete(
                                                                deletedMember.id, 
                                                                deletedMember.member_data.name
                                                            )}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Delete Forever
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}