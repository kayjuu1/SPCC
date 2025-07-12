import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMembers } from "@/hooks/useMembers";
import { UserPlus, Calendar, Users } from "lucide-react";
import SideBar from "@/components/SideBar";
import AddMemberDialog from "@/components/AddMemberButton";

export default function NewMembersPage() {
    const { members, loading, fetchMembers } = useMembers();
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    // Get members added in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newMembers = members.filter(member => 
        new Date(member.created_at) >= thirtyDaysAgo
    );

    // Get members added in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMembers = members.filter(member => 
        new Date(member.created_at) >= sevenDaysAgo
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <UserPlus className="w-8 h-8 text-green-600 mr-3"/>
                                <h1 className="text-2xl font-bold text-gray-800">New Members</h1>
                            </div>
                            <Button 
                                onClick={() => setIsAddMemberOpen(true)}
                                className="bg-teal-700 hover:bg-teal-800 text-white font-medium"
                            >
                                <UserPlus className="w-4 h-4 mr-2"/>
                                Add Member
                            </Button>
                        </div>
                        <p className="text-gray-600 mt-2">
                            Recently added members and registration overview
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <UserPlus className="w-12 h-12 text-green-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">This Week</p>
                                        <p className="text-3xl font-bold text-gray-800">{recentMembers.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Calendar className="w-12 h-12 text-blue-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
                                        <p className="text-3xl font-bold text-gray-800">{newMembers.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="w-12 h-12 text-purple-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Members</p>
                                        <p className="text-3xl font-bold text-gray-800">{members.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* New Members Table */}
                    <Card className="bg-white rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserPlus className="w-5 h-5 mr-2 text-green-600"/>
                                Recently Added Members (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading new members...</div>
                            ) : newMembers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                                    <p className="text-lg font-medium">No new members</p>
                                    <p className="text-sm">No members have been added in the last 30 days</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Society</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date Added</TableHead>
                                            <TableHead>Days Ago</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {newMembers
                                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                            .map((member) => {
                                                const daysAgo = Math.floor(
                                                    (new Date().getTime() - new Date(member.created_at).getTime()) / (1000 * 60 * 60 * 24)
                                                );
                                                
                                                return (
                                                    <TableRow key={member.id}>
                                                        <TableCell className="font-medium">{member.name}</TableCell>
                                                        <TableCell>{member.contact}</TableCell>
                                                        <TableCell>{member.role}</TableCell>
                                                        <TableCell>{member.society}</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                member.status === 'Active' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {member.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(member.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                daysAgo <= 7 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    <AddMemberDialog
                        isOpen={isAddMemberOpen}
                        onClose={() => setIsAddMemberOpen(false)}
                        onMemberAdded={fetchMembers}
                    />
                </div>
            </main>
        </div>
    );
}