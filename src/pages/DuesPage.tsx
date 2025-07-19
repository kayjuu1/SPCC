import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useDues } from "@/hooks/useDues";
import { useMembers } from "@/hooks/useMembers";
import { DollarSign, Plus, Search, Calendar } from "lucide-react";
import SideBar from "@/components/SideBar";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DuesPage() {
    const { dues, loading, addDues, updateDues, fetchDues } = useDues();
    const { members } = useMembers();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [newDues, setNewDues] = useState({
        amount: "",
        month: "",
        year: new Date().getFullYear().toString(),
        paid: false,
        notes: ""
    });

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase())
    );

    const handleAddDues = async () => {
        if (!selectedMember) return;
        
        try {
            await addDues({
                member_id: selectedMember.id,
                amount: parseFloat(newDues.amount),
                month: newDues.month,
                year: parseInt(newDues.year),
                paid: newDues.paid,
                notes: newDues.notes
            });
            
            setIsAddDialogOpen(false);
            setSelectedMember(null);
            setMemberSearch("");
            setNewDues({
                amount: "",
                month: "",
                year: new Date().getFullYear().toString(),
                paid: false,
                notes: ""
            });
        } catch (error) {
            console.error("Error adding dues:", error);
        }
    };

    const handlePaymentToggle = async (duesId: string, currentPaid: boolean) => {
        await updateDues(duesId, { 
            paid: !currentPaid,
            payment_date: !currentPaid ? new Date().toISOString() : null
        });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <DollarSign className="w-8 h-8 text-green-600 mr-3"/>
                                <h1 className="text-2xl font-bold text-gray-800">Dues Management</h1>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-teal-700 hover:bg-teal-800 text-white font-medium">
                                        <Plus className="w-4 h-4 mr-2"/>
                                        Add Dues Record
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Dues Record</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        {/* Member Search */}
                                        <div className="grid gap-2">
                                            <Label>Search Member</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    placeholder="Type member name..."
                                                    value={memberSearch}
                                                    onChange={(e) => setMemberSearch(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            {memberSearch && filteredMembers.length > 0 && (
                                                <div className="max-h-40 overflow-y-auto border rounded-md">
                                                    {filteredMembers.slice(0, 5).map((member) => (
                                                        <div
                                                            key={member.id}
                                                            className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setMemberSearch(member.name);
                                                            }}
                                                        >
                                                            <div className="font-medium">{member.name}</div>
                                                            <div className="text-sm text-gray-500">{member.contact}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {selectedMember && (
                                                <div className="p-2 bg-blue-50 rounded border">
                                                    <div className="font-medium text-blue-800">
                                                        Selected: {selectedMember.name}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Amount ($)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={newDues.amount}
                                                    onChange={(e) => setNewDues({...newDues, amount: e.target.value})}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Year</Label>
                                                <Input
                                                    type="number"
                                                    value={newDues.year}
                                                    onChange={(e) => setNewDues({...newDues, year: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Month</Label>
                                            <Select value={newDues.month} onValueChange={(value) => setNewDues({...newDues, month: value})}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {months.map((month) => (
                                                        <SelectItem key={month} value={month}>
                                                            {month}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Notes</Label>
                                            <Input
                                                value={newDues.notes}
                                                onChange={(e) => setNewDues({...newDues, notes: e.target.value})}
                                                placeholder="Optional notes"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={newDues.paid}
                                                onCheckedChange={(checked) => setNewDues({...newDues, paid: checked === true})}
                                            />
                                            <Label>Mark as paid</Label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddDues} disabled={!selectedMember || !newDues.amount || !newDues.month}>
                                            Add Dues Record
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <DollarSign className="w-12 h-12 text-green-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Collected</p>
                                        <p className="text-3xl font-bold text-gray-800">
                                            ${dues.filter(d => d.paid).reduce((sum, d) => sum + d.amount, 0)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Calendar className="w-12 h-12 text-red-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Outstanding</p>
                                        <p className="text-3xl font-bold text-gray-800">
                                            ${dues.filter(d => !d.paid).reduce((sum, d) => sum + d.amount, 0)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dues Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dues Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading dues...</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Month</TableHead>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Payment Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dues.map((duesRecord) => (
                                            <TableRow key={duesRecord.id}>
                                                <TableCell className="font-medium">
                                                    {duesRecord.member_name || 'Unknown Member'}
                                                </TableCell>
                                                <TableCell>{duesRecord.month}</TableCell>
                                                <TableCell>{duesRecord.year}</TableCell>
                                                <TableCell>${duesRecord.amount}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        duesRecord.paid 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {duesRecord.paid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {duesRecord.payment_date 
                                                        ? new Date(duesRecord.payment_date).toLocaleDateString()
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant={duesRecord.paid ? "outline" : "default"}
                                                        onClick={() => handlePaymentToggle(duesRecord.id, duesRecord.paid)}
                                                    >
                                                        {duesRecord.paid ? 'Mark Unpaid' : 'Mark Paid'}
                                                    </Button>
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