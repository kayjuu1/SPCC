import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAttendance } from "@/hooks/useAttendance";
import { Calendar, Plus, Users, TrendingUp } from "lucide-react";
import SideBar from "@/components/SideBar";

export default function AttendancePage() {
    const { attendance, loading, addAttendance } = useAttendance();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newAttendance, setNewAttendance] = useState({
        date: new Date().toISOString().split('T')[0],
        adult_males: "",
        adult_females: "",
        male_children: "",
        female_children: "",
        notes: ""
    });

    const handleAddAttendance = async () => {
        try {
            await addAttendance({
                date: newAttendance.date,
                adult_males: parseInt(newAttendance.adult_males) || 0,
                adult_females: parseInt(newAttendance.adult_females) || 0,
                male_children: parseInt(newAttendance.male_children) || 0,
                female_children: parseInt(newAttendance.female_children) || 0,
                notes: newAttendance.notes
            });
            
            setIsAddDialogOpen(false);
            setNewAttendance({
                date: new Date().toISOString().split('T')[0],
                adult_males: "",
                adult_females: "",
                male_children: "",
                female_children: "",
                notes: ""
            });
        } catch (error) {
            console.error("Error adding attendance:", error);
        }
    };

    const totalAttendance = attendance.reduce((sum, record) => sum + (record.total_attendance || 0), 0);
    const averageAttendance = attendance.length > 0 ? Math.round(totalAttendance / attendance.length) : 0;

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Calendar className="w-8 h-8 text-blue-600 mr-3"/>
                                <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-teal-700 hover:bg-teal-800 text-white font-medium">
                                        <Plus className="w-4 h-4 mr-2"/>
                                        Record Attendance
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Record Service Attendance</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Service Date</Label>
                                            <Input
                                                type="date"
                                                value={newAttendance.date}
                                                onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Adult Males</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={newAttendance.adult_males}
                                                    onChange={(e) => setNewAttendance({...newAttendance, adult_males: e.target.value})}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Adult Females</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={newAttendance.adult_females}
                                                    onChange={(e) => setNewAttendance({...newAttendance, adult_females: e.target.value})}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Male Children</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={newAttendance.male_children}
                                                    onChange={(e) => setNewAttendance({...newAttendance, male_children: e.target.value})}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Female Children</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={newAttendance.female_children}
                                                    onChange={(e) => setNewAttendance({...newAttendance, female_children: e.target.value})}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Notes</Label>
                                            <Input
                                                value={newAttendance.notes}
                                                onChange={(e) => setNewAttendance({...newAttendance, notes: e.target.value})}
                                                placeholder="Optional notes about the service"
                                            />
                                        </div>

                                        <div className="p-3 bg-blue-50 rounded border">
                                            <div className="text-sm font-medium text-blue-800">
                                                Total Attendance: {
                                                    (parseInt(newAttendance.adult_males) || 0) +
                                                    (parseInt(newAttendance.adult_females) || 0) +
                                                    (parseInt(newAttendance.male_children) || 0) +
                                                    (parseInt(newAttendance.female_children) || 0)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddAttendance}>
                                            Record Attendance
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Calendar className="w-12 h-12 text-blue-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Services</p>
                                        <p className="text-3xl font-bold text-gray-800">{attendance.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="w-12 h-12 text-green-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                                        <p className="text-3xl font-bold text-gray-800">{averageAttendance}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <TrendingUp className="w-12 h-12 text-purple-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Attendance</p>
                                        <p className="text-3xl font-bold text-gray-800">{totalAttendance}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading attendance...</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Adult Males</TableHead>
                                            <TableHead>Adult Females</TableHead>
                                            <TableHead>Male Children</TableHead>
                                            <TableHead>Female Children</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Notes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendance.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="font-medium">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>{record.adult_males}</TableCell>
                                                <TableCell>{record.adult_females}</TableCell>
                                                <TableCell>{record.male_children}</TableCell>
                                                <TableCell>{record.female_children}</TableCell>
                                                <TableCell className="font-bold">
                                                    {record.total_attendance}
                                                </TableCell>
                                                <TableCell>{record.notes || '-'}</TableCell>
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