import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {supabase} from "@/supabaseClient.ts";
import {useToast} from "@/hooks/use-toast.ts";

export default function EditMemberDialog({member, refreshData}: {
    member: any;
    refreshData: () => void; //type of refreshData
}) {
    const [open, setOpen] = useState(false);
    const {toast} = useToast();
    const [editedMember, setEditedMember] = useState({...member});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedMember({...editedMember, [e.target.name]: e.target.value});
    };



    const handleSubmit = async () => {
        try {
            const {error} = await supabase.from("members").update(editedMember).eq("id", member.id);
            if (error) throw error;

            toast({description: "Member updated successfully."});
            setOpen(false);
            refreshData(); // table refreshes after update
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 text-white">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
                <DialogHeader>
                    <DialogTitle>Edit Member Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Label>Name</Label>
                    <Input name="name" value={editedMember.name} onChange={handleChange}/>

                    <Label>Date of Birth</Label>
                    <Input  name="dob" value={editedMember.dob} onChange={handleChange}/>

                    <Label>Address</Label>
                    <Input name="address" value={member.address} onChange={handleChange} required/>

                    <Label>Dues Card ID</Label>
                    <Input name="dues_card_id" value={editedMember.dues_card_id} onChange={handleChange}/>

                    <Label>Baptism Date</Label>
                    <Input type="date" name="baptism_date" value={editedMember.baptism_date}
                           onChange={handleChange}/>

                    <Label>Confirmation Date</Label>
                    <Input type="date" name="confirmation_date" value={editedMember.confirmation_date}
                           onChange={handleChange}/>

                    <Label>Contact</Label>
                    <Input name="contact" type="number" value={editedMember.contact} onChange={handleChange} required/>
                    {errors.contact && <p className="text-red-500">{errors.contact}</p>}


                    <Label>Society</Label>
                    <Input name="society" value={editedMember.society} onChange={handleChange}/>

                    <Label>Role</Label>
                    <Input name={"role"} id={"role"} type="text" value={editedMember.role} onChange={handleChange}/>
                    {errors.role && <p className="text-red-500">{errors.role}</p>}


                    <Button variant="outline" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
