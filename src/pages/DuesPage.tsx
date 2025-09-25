import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Checkbox} from "@/components/ui/checkbox";
import {useDues} from "@/hooks/useDues";
import {useMembers} from "@/hooks/useMembers";
import {formatDate} from "@/lib/utils";
import {Calendar, ChevronDown, DollarSign, Plus, RefreshCw, Search} from "lucide-react";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function DuesPage() {
    const {dues, loading, addDues, updateDues} = useDues();
    const {members, recalculateDefaultedStatus} = useMembers();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [recalculating, setRecalculating] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [newDues, setNewDues] = useState({
        amount: "10.00",
        selectedMonths: [] as string[],
        year: new Date().getFullYear().toString(),
        notes: ""
    });
    const [monthsPopoverOpen, setMonthsPopoverOpen] = useState(false);

    // Get date format from settings
    const getDateFormat = () => {
        try {
            const savedSettings = localStorage.getItem('spcc-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                return settings.display?.dateFormat || 'MM/DD/YYYY';
            }
        } catch (error) {
            console.error('Error reading date format:', error);
        }
        return 'MM/DD/YYYY';
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase())
    );

    const handleAddDues = async () => {
        if (!selectedMember || newDues.selectedMonths.length === 0) return;

        try {
            // Calculate amount per month (distribute total amount across selected months)
            const totalAmount = parseFloat(newDues.amount);
            const amountPerMonth = totalAmount / newDues.selectedMonths.length;

            // Add dues for each selected month with distributed amount
            for (const month of newDues.selectedMonths) {
                await addDues({
                    member_id: selectedMember.id,
                    amount: amountPerMonth,
                    month: month,
                    year: parseInt(newDues.year),
                    paid: true, // All new dues records are automatically marked as paid
                    notes: newDues.notes
                });
            }

            setIsAddDialogOpen(false);
            setSelectedMember(null);
            setMemberSearch("");
            setNewDues({
                amount: "10.00",
                selectedMonths: [],
                year: new Date().getFullYear().toString(),
                notes: ""
            });
        } catch (error) {
            console.error("Error adding dues:", error);
        }
    };

    const handleRecalculateDefaulted = async () => {
        setRecalculating(true);
        try {
            await recalculateDefaultedStatus();
        } finally {
            setRecalculating(false);
        }
    };

    const toggleMonth = (month: string) => {
        setNewDues(prev => ({
            ...prev,
            selectedMonths: prev.selectedMonths.includes(month)
                ? prev.selectedMonths.filter(m => m !== month)
                : [...prev.selectedMonths, month]
        }));
    };

    const handlePaymentToggle = async (duesId: string, currentPaid: boolean) => {
        await updateDues(duesId, {
            paid: !currentPaid,
            payment_date: !currentPaid ? new Date().toISOString() : null
        });
    };

    return (
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
                        <Button
                            onClick={handleRecalculateDefaulted}
                            disabled={recalculating}
                            variant="outline"
                            className="ml-2"
                        >
                            {recalculating ? (
                                <div
                                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2"></div>
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2"/>
                            )}
                            Recalculate Defaulted Status
                        </Button>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Dues Record</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Member Search */}
                                <div className="grid gap-2">
                                    <Label>Search Member</Label>
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
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
                                        <Label>Total Amount (GH₵)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={newDues.amount}
                                            onChange={(e) => setNewDues({...newDues, amount: e.target.value})}
                                            placeholder="10.00"
                                        />
                                        {newDues.selectedMonths.length > 1 && (
                                            <p className="text-xs text-gray-500">
                                                ${(parseFloat(newDues.amount) / newDues.selectedMonths.length).toFixed(2)} per
                                                month
                                            </p>
                                        )}
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
                                    <Label>Months</Label>
                                    <Popover open={monthsPopoverOpen} onOpenChange={setMonthsPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={monthsPopoverOpen}
                                                className="justify-between"
                                            >
                                                {newDues.selectedMonths.length === 0
                                                    ? "Select months..."
                                                    : `${newDues.selectedMonths.length} month(s) selected`
                                                }
                                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="max-h-60 overflow-auto p-2">
                                                {months.map((month) => (
                                                    <div key={month}
                                                         className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                                                        <Checkbox
                                                            checked={newDues.selectedMonths.includes(month)}
                                                            onCheckedChange={() => toggleMonth(month)}
                                                        />
                                                        <Label className="flex-1 cursor-pointer">{month}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    {newDues.selectedMonths.length > 0 && (
                                        <div className="text-sm text-gray-600">
                                            Selected: {newDues.selectedMonths.join(', ')}
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Notes</Label>
                                    <Input
                                        value={newDues.notes}
                                        onChange={(e) => setNewDues({...newDues, notes: e.target.value})}
                                        placeholder="Payment notes (optional)"
                                    />
                                </div>

                                <div className="p-3 bg-green-50 rounded border">
                                    <div className="text-sm font-medium text-green-800">
                                        ✓ All dues records will be automatically marked as paid
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddDues}
                                    disabled={!selectedMember || !newDues.amount || newDues.selectedMonths.length === 0 || parseFloat(newDues.amount) <= 0}
                                >
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
                                        <TableCell>GH₵{duesRecord.amount}</TableCell>
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
                                                ? formatDate(duesRecord.payment_date, getDateFormat())
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
    );
}