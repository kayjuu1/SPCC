import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useMembers} from "@/hooks/useMembers";
import {useDues} from "@/hooks/useDues";
import {useAttendance} from "@/hooks/useAttendance";
import {formatDate} from "@/lib/utils";
import {BarChart3, Calendar, DollarSign, Download, TrendingUp, Users} from "lucide-react";

export default function ReportsPage() {
    const {members} = useMembers();
    const {dues} = useDues();
    const {attendance} = useAttendance();
    const [reportType, setReportType] = useState("overview");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

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

    // Calculate statistics
    // const activeMembers = members.filter(m => m.status === 'Active');
    const totalDuesCollected = dues.filter(d => d.paid).reduce((sum, d) => sum + d.amount, 0);
    const totalOutstanding = dues.filter(d => !d.paid).reduce((sum, d) => sum + d.amount, 0);
    const averageAttendance = attendance.length > 0
        ? Math.round(attendance.reduce((sum, a) => sum + a.total_attendance, 0) / attendance.length)
        : 0;

    // Get unique years from data
    const years = Array.from(new Set([
        ...dues.map(d => d.year.toString()),
        ...attendance.map(a => new Date(a.date).getFullYear().toString())
    ])).sort().reverse();

    const exportToCSV = (data: any[], filename: string) => {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderOverviewReport = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Users className="w-12 h-12 mr-4 opacity-80"/>
                            <div>
                                <p className="text-sm opacity-90">Total Members</p>
                                <p className="text-3xl font-bold">{members.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <DollarSign className="w-12 h-12 mr-4 opacity-80"/>
                            <div>
                                <p className="text-sm opacity-90">Dues Collected</p>
                                <p className="text-3xl font-bold">${totalDuesCollected}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Calendar className="w-12 h-12 mr-4 opacity-80"/>
                            <div>
                                <p className="text-sm opacity-90">Outstanding</p>
                                <p className="text-3xl font-bold">${totalOutstanding}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <TrendingUp className="w-12 h-12 mr-4 opacity-80"/>
                            <div>
                                <p className="text-sm opacity-90">Avg Attendance</p>
                                <p className="text-3xl font-bold">{averageAttendance}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Member Status Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Member Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Count</TableHead>
                                <TableHead>Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {['Active', 'Inactive', 'Dead', 'Not a Member'].map(status => {
                                const count = members.filter(m => m.status === status).length;
                                const percentage = members.length > 0 ? ((count / members.length) * 100).toFixed(1) : '0';
                                return (
                                    <TableRow key={status}>
                                        <TableCell className="font-medium">{status}</TableCell>
                                        <TableCell>{count}</TableCell>
                                        <TableCell>{percentage}%</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    const renderMembersReport = () => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members Report</CardTitle>
                <Button
                    onClick={() => exportToCSV(members, 'members-report')}
                    className="bg-teal-600 hover:bg-teal-700"
                >
                    <Download className="w-4 h-4 mr-2"/>
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Society</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Outstanding Dues</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map(member => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            member.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                                member.status === 'Dead' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                        {member.status}
                                    </span>
                                </TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>{member.society}</TableCell>
                                <TableCell>{member.contact}</TableCell>
                                <TableCell className={member.dues > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                                    ${member.dues}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    const renderDuesReport = () => {
        const yearDues = dues.filter(d => d.year.toString() === selectedYear);
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Dues Report - {selectedYear}</CardTitle>
                    <Button
                        onClick={() => exportToCSV(yearDues, `dues-report-${selectedYear}`)}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        <Download className="w-4 h-4 mr-2"/>
                        Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {yearDues.map(due => (
                                <TableRow key={due.id}>
                                    <TableCell className="font-medium">{due.member_name}</TableCell>
                                    <TableCell>{due.month}</TableCell>
                                    <TableCell>${due.amount}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            due.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {due.paid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {due.payment_date ? formatDate(due.payment_date, getDateFormat()) : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    const renderAttendanceReport = () => {
        const yearAttendance = attendance.filter(a => new Date(a.date).getFullYear().toString() === selectedYear);
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Attendance Report - {selectedYear}</CardTitle>
                    <Button
                        onClick={() => exportToCSV(yearAttendance, `attendance-report-${selectedYear}`)}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        <Download className="w-4 h-4 mr-2"/>
                        Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
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
                            {yearAttendance.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {formatDate(record.date, getDateFormat())}
                                    </TableCell>
                                    <TableCell>{record.adult_males}</TableCell>
                                    <TableCell>{record.adult_females}</TableCell>
                                    <TableCell>{record.male_children}</TableCell>
                                    <TableCell>{record.female_children}</TableCell>
                                    <TableCell className="font-bold">{record.total_attendance}</TableCell>
                                    <TableCell>{record.notes || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BarChart3 className="w-8 h-8 text-blue-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger className="w-48">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overview">Overview</SelectItem>
                                <SelectItem value="members">Members Report</SelectItem>
                                <SelectItem value="dues">Dues Report</SelectItem>
                                <SelectItem value="attendance">Attendance Report</SelectItem>
                            </SelectContent>
                        </Select>
                        {(reportType === 'dues' || reportType === 'attendance') && (
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-32">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                <p className="text-gray-600 mt-2">
                    Comprehensive reports and data analytics for parish management
                </p>
            </div>

            {/* Report Content */}
            {reportType === 'overview' && renderOverviewReport()}
            {reportType === 'members' && renderMembersReport()}
            {reportType === 'dues' && renderDuesReport()}
            {reportType === 'attendance' && renderAttendanceReport()}
        </div>
    );
}