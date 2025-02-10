import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabaseClient";

const memberStatuses = ["Active", "Inactive", "Dead", "Not a Member"];
const memberRoles = ["Priest","Catechist","President","Vice-President","Secretary","Vice-Secretary","Treasurer","Society Executive","Member"];

export default function AddMemberDialog({ onMemberAdded }: { onMemberAdded: () => void }) {
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
        status: "Active",
        defaulted: false,
        dependents: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setMember({ ...member, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (name: string, value: boolean) => {
        setMember({ ...member, [name]: value });
    };

    const handleSubmit = async () => {
        const { error } = await supabase.from("members").insert([member]);
        if (error) {
            console.error("Error adding member:", error);
        } else {
            setOpen(false);
            onMemberAdded();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-700">Add Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Label>Name</Label>
                    <Input name="name" value={member.name} onChange={handleChange} required placeholder="Full Name"/>

                    <Label>Date of Birth</Label>
                    <Input type="date" name="dob" value={member.dob} onChange={handleChange} required />

                    <Label>Dues Card ID</Label>
                    <Input name="dues_card_id" value={member.dues_card_id} onChange={handleChange} />

                    <Label>Baptized</Label>
                    <Checkbox checked={member.baptized} onCheckedChange={(value) => handleCheckboxChange("baptized", value)} />
                    {member.baptized && (
                        <>
                            <Label>Baptism Date</Label>
                            <Input type="date" name="baptism_date" value={member.baptism_date} onChange={handleChange} />
                        </>
                    )}

                    <Label>Confirmed</Label>
                    <Checkbox checked={member.confirmed} onCheckedChange={(value) => handleCheckboxChange("confirmed", value)} />
                    {member.confirmed && (
                        <>
                            <Label>Confirmation Date</Label>
                            <Input type="date" name="confirmation_date" value={member.confirmation_date} onChange={handleChange} />
                        </>
                    )}

                    <Label>Contact</Label>
                    <Input name="contact" value={member.contact} onChange={handleChange} required />

                    <Label>Address</Label>
                    <Input name="address" value={member.address} onChange={handleChange} required />

                    <Label>Society</Label>
                    <Input name="society" value={member.society} onChange={handleChange} />

                    <Label>Role</Label>
                    <Select onValueChange={(value) => setMember({ ...member, role: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {memberRoles.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Label>Status</Label>
                    <Select onValueChange={(value) => setMember({ ...member, status: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {memberStatuses.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Label>Defaulted</Label>
                    <Checkbox checked={member.defaulted} onCheckedChange={(value) => handleCheckboxChange("defaulted", value)} />

                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
