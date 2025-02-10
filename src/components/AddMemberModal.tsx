import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Member } from "@/types/adminTypes";

export default function AddMemberModal({ isOpen, onClose, onMemberAdded }: { isOpen: boolean; onClose: () => void; onMemberAdded: () => void; }) {
    const [formData, setFormData] = useState<Partial<Member>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { error } = await supabase.from("members").insert([formData]);
        if (error) {
            console.error("Error adding member:", error);
        } else {
            onMemberAdded();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Name</Label>
                        <Input name="name" onChange={handleChange} />

                        <Label>Date of Birth</Label>
                        <Input type="date" name="dob" onChange={handleChange} />

                        <Label>Annual Dues Card (if applicable)</Label>
                        <Input name="annualDuesCard" onChange={handleChange} />

                        <Label>Baptism Date</Label>
                        <Input type="date" name="baptismDate" onChange={handleChange} />

                        <Label>Confirmation Date</Label>
                        <Input type="date" name="confirmationDate" onChange={handleChange} />

                        <Label>Contact Information</Label>
                        <Input name="contactInfo" onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Residential Address</Label>
                        <Input name="address" onChange={handleChange} />

                        <Label>Dependents</Label>
                        <Input name="dependents" onChange={handleChange} />

                        <Label>Member’s Society</Label>
                        <Input name="society" onChange={handleChange} />

                        <Label>Member’s Role</Label>
                        <Input name="role" onChange={handleChange} />

                        <Label>Has Member Defaulted?</Label>
                        <select name="defaulted" onChange={handleChange} className="border rounded p-2 w-full">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} className="bg-teal-700">Add Member</Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
