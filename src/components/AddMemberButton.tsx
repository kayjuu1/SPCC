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
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {supabase} from "@/supabaseClient.ts";

// const memberStatuses = ["Active", "Inactive", "Dead", "Not a Member"];
const memberRoles = ["Priest", "Catechist", "President", "Vice-President", "Secretary", "Vice-Secretary", "Treasurer", "Society Executive", "Member"];

export default function AddMemberDialog(props: any) {
    const [open, setOpen] = useState(false);
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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setMember({...member, [e.target.name]: e.target.value});
    };

    const handleCheckboxChange = (name: string, value: boolean) => {
        setMember({...member, [name]: value});
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async () => {
        // Validate required fields
        const newErrors: { [key: string]: string } = {};
        if (!member.name.trim()) newErrors.name = "Name is required.";
        if (!member.dob.trim()) newErrors.dob = "Date of Birth is required.";
        if (!member.contact.trim()) newErrors.contact = "Contact is required.";
        if (!member.role.trim()) newErrors.role = "Role is required.";

        // If there are errors, update state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Reset errors before submitting
        setErrors({});

        const cleanedMember = {
            ...member,
            dob: member.dob || null,
            baptism_date: member.baptism_date || null,
            confirmation_date: member.confirmation_date || null,
            status: member.status || "Active", // Ensure status is valid
        };

        try {
            const { data, error } = await supabase.from("members").insert([cleanedMember]);

            if (error) {
                console.error("Error adding member:", error.message);
            } else {
                console.log("Member added successfully:", data);
                setOpen(false); // Close dialog after success
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-700">Add Member</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>Fill out the form to add a new member.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Label>Name</Label>
                    <Input name="name" value={member.name} onChange={handleChange} required />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}

                    <Label>Date of Birth</Label>
                    <Input type="date" name="dob" value={member.dob} onChange={handleChange} required/>
                    {errors.dob && <p className="text-red-500">{errors.dob}</p>}

                    <Label>Dues Card ID</Label>
                    <Input name="dues_card_id" value={member.dues_card_id} onChange={handleChange}/>


                    <Label>Baptized</Label>
                    <Checkbox checked={member.baptized}
                              onCheckedChange={(value) => handleCheckboxChange("baptized", value)}/>
                    {member.baptized && (
                        <>
                            <Label>Baptism Date</Label>
                            <Input type="date" name="baptism_date" value={member.baptism_date} onChange={handleChange}/>
                        </>
                    )}

                    <Label>Confirmed</Label>
                    <Checkbox checked={member.confirmed}
                              onCheckedChange={(value) => handleCheckboxChange("confirmed", value)}/>
                    {member.confirmed && (
                        <>
                            <Label>Confirmation Date</Label>
                            <Input type="date" name="confirmation_date" value={member.confirmation_date}
                                   onChange={handleChange}/>
                        </>
                    )}

                    {errors.contact && <p className="text-red-500">{errors.contact}</p>}
                    <Label>Contact</Label>
                    <Input name="contact" type={"number"} value={member.contact} onChange={handleChange} required/>

                    <Label>Address</Label>
                    <Input name="address" value={member.address} onChange={handleChange} required/>

                    <Label>Society</Label>
                    <Input name="society" value={member.society} onChange={handleChange}/>

                    {errors.role && <p className="text-red-500">{errors.role}</p>}
                    <Label>Role</Label>
                    <Select onValueChange={(value) => setMember({...member, role: value})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Role"/>
                        </SelectTrigger>
                        <SelectContent>
                            {memberRoles.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/*<Label>Status</Label>*/}
                    {/*<Select onValueChange={(value) => setMember({...member, status: value})}>*/}
                    {/*    <SelectTrigger>*/}
                    {/*        <SelectValue placeholder="Select Status"/>*/}
                    {/*    </SelectTrigger>*/}
                    {/*    <SelectContent>*/}
                    {/*        {memberStatuses.map((status) => (*/}
                    {/*            <SelectItem key={status} value={status}>{status}</SelectItem>*/}
                    {/*        ))}*/}
                    {/*    </SelectContent>*/}
                    {/*</Select>*/}

                    {/*<Label>Defaulted</Label>*/}
                    {/*<Checkbox checked={member.defaulted}*/}
                    {/*          onCheckedChange={(value) => handleCheckboxChange("defaulted", value)}/>*/}

                    <Button onClick={handleSubmit} className="mt-4">Submit</Button>
                </div>
            </DialogContent>
        </Dialog>

    );
}
