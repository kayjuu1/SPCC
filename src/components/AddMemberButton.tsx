import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {supabase} from "@/supabaseClient.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {UserPlus} from "lucide-react";

const memberRoles = [
    "Priest",
    "Catechist",
    "President",
    "Vice-President",
    "Secretary",
    "Vice-Secretary",
    "Treasurer",
    "Society Executive",
    "Member",
];

export default function AddMemberDialog(props: any) {
    const [open, setOpen] = useState(false);
    const {toast} = useToast();
    const [member, setMember] = useState({
        name: "",
        dob: "",
        dues_card_id: "",
        baptized: false,
        baptism_date: "",
        confirmed: false,
        confirmation_date: "",
        contact: "",
        address: "",
        society: "",
        role: "",
        dependents: [] as string[],
        status: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setMember({...member, [e.target.name]: e.target.value});
    };

    const handleCheckboxChange = (name: string, value: boolean) => {
        setMember({...member, [name]: value});
    };

    const handleSubmit = async () => {
        const newErrors: { [key: string]: string } = {};
        if (!member.name.trim()) newErrors.name = "Name is required.";
        if (!member.dob.trim()) newErrors.dob = "Date of Birth is required.";
        if (!member.contact.trim()) newErrors.contact = "Contact is required.";
        if (!member.role.trim()) newErrors.role = "Role is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        const cleanedMember = {
            ...member,
            dob: member.dob || null,
            baptism_date: member.baptism_date || null,
            confirmation_date: member.confirmation_date || null,
            status: member.status || "Active",
        };

        try {
            const {data, error} = await supabase.from("members").insert([cleanedMember]);

            if (error) {
                console.error("Error adding member:", error.message);
                toast({variant: "destructive", description: "Error adding member. Please try again."});
            } else {
                console.log("Member added successfully:", data);
                setOpen(false);
                toast({description: "Member Added Successfully."});
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-700 hover:bg-teal-800 text-white font-medium">
                    <UserPlus className="w-4 h-4 mr-2"/>
                    Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px] p-6">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-semibold text-gray-900">Add New Member</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Fill out the form to add a new member.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Name</Label>
                                <Input
                                    name="name"
                                    value={member.name}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                                <Input
                                    type="date"
                                    name="dob"
                                    value={member.dob}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                                {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Dues Card ID</Label>
                                <Input
                                    name="dues_card_id"
                                    value={member.dues_card_id}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={member.baptized}
                                    onCheckedChange={(value) => handleCheckboxChange("baptized", value === true)}
                                    className="border-gray-300"
                                />
                                <Label className="text-sm font-medium text-gray-700">Baptized</Label>
                            </div>

                            {member.baptized && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Baptism Date</Label>
                                    <Input
                                        type="date"
                                        name="baptism_date"
                                        value={member.baptism_date}
                                        onChange={handleChange}
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Contact</Label>
                                <Input
                                    name="contact"
                                    type="number"
                                    value={member.contact}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                                {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={member.confirmed}
                                    onCheckedChange={(value) => handleCheckboxChange("confirmed", value === true)}
                                    className="border-gray-300"
                                />
                                <Label className="text-sm font-medium text-gray-700">Confirmed</Label>
                            </div>

                            {member.confirmed && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Confirmation Date</Label>
                                    <Input
                                        type="date"
                                        name="confirmation_date"
                                        value={member.confirmation_date}
                                        onChange={handleChange}
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Address</Label>
                                <Input
                                    name="address"
                                    value={member.address}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Society</Label>
                                <Input
                                    name="society"
                                    value={member.society}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Role</Label>
                                <Select
                                    defaultValue={member.role}
                                    onValueChange={(value) => setMember({...member, role: value})}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Role"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {memberRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-medium"
                    >
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}