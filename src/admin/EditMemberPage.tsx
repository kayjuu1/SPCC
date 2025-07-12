import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import { supabase, Member } from "@/lib/supabase";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {toast} from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Calendar,
    User,
    FileText,
    Info,
    Mail,
    MapPin,
    Phone,
    Users,
    UserCircle
} from "lucide-react";

const EditMember = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            if (!id) return;
            
            try {
                const {data, error} = await supabase
                    .from("members")
                    .select("*")
                    .eq("id", id)
                    .single();
                    
            if (error) {
                    throw error;
            } else {
                setMember(data);
            }
            } catch (error) {
                console.error("Error fetching member:", error);
                toast({
                    variant: "destructive",
                    description: "Error fetching member data."
                });
                navigate("/admin/dashboard");
            }
            setLoading(false);
        };

        fetchMember();
    }, [id]);

    const handleChange = (name: string, value: any) => {
        if (!member) return;
        setMember({...member, [name]: value});
    };

    const handleSubmit = async () => {
        if (!member || !id) return;
        
        try {
            const {error} = await supabase
                .from("members")
                .update({
                    name: member.name,
                    dob: member.dob,
                    dues_card_id: member.dues_card_id,
                    baptized: member.baptized,
                    baptism_date: member.baptism_date,
                    confirmed: member.confirmed,
                    confirmation_date: member.confirmation_date,
                    contact: member.contact,
                    address: member.address,
                    society: member.society,
                    role: member.role,
                    status: member.status,
                    defaulted: member.defaulted,
                    dues: member.dues,
                })
                .eq("id", id);
                
            if (error) throw error;

            toast({description: "Member updated successfully."});
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };
    
    const handleDelete = async () => {
        if (!id) return;
        
        if (!window.confirm(`Are you sure you want to delete ${member?.name}? This action cannot be undone.`)) {
            return;
        }
        
        try {
            const {error} = await supabase
                .from("members")
                .delete()
                .eq("id", id);
                
            if (error) throw error;

            toast({description: "Member deleted successfully."});
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error deleting member:", error);
            toast({
                variant: "destructive",
                description: "Failed to delete member."
            });
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-primary h-full p-4 space-y-2">
                <nav className="space-y-2">
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90"
                            onClick={() => navigate("/admin/dashboard")}>
                        <FileText className="mr-2 h-4 w-4"/>
                        All Members
                    </Button>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90">
                        <FileText className="mr-2 h-4 w-4"/>
                        New Members
                    </Button>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90">
                        <FileText className="mr-2 h-4 w-4"/>
                        Deleted Members
                    </Button>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90">
                        <Users className="mr-2 h-4 w-4"/>
                        ADMINS
                    </Button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 bg-background">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{member?.name}</h1>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
                            Go Back
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Member
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Member</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <DetailField
                                    label="Name"
                                    name="name"
                                    value={member?.name || ""}
                                    onChange={(value) => handleChange("name", value)}
                                    icon={<User className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Dues Card ID"
                                    name="dues_card_id"
                                    value={member?.dues_card_id || ""}
                                    onChange={(value) => handleChange("dues_card_id", value)}
                                    icon={<FileText className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Date of Birth"
                                    name="dob"
                                    type="date"
                                    value={member?.dob || ""}
                                    onChange={(value) => handleChange("dob", value)}
                                    icon={<Calendar className="h-4 w-4"/>}
                                />
                                
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4"/>
                                        Baptized
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={member?.baptized || false}
                                            onCheckedChange={(checked) => handleChange("baptized", checked)}
                                        />
                                        <span className="text-sm">Yes, this member is baptized</span>
                                    </div>
                                </div>
                                
                                {member?.baptized && (
                                <DetailField
                                    label="Baptismal Date"
                                    name="baptism_date"
                                    type="date"
                                    value={member?.baptism_date || ""}
                                    onChange={(value) => handleChange("baptism_date", value)}
                                    icon={<Calendar className="h-4 w-4"/>}
                                />
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4"/>
                                        Confirmed
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={member?.confirmed || false}
                                            onCheckedChange={(checked) => handleChange("confirmed", checked)}
                                        />
                                        <span className="text-sm">Yes, this member is confirmed</span>
                                    </div>
                                </div>
                                
                                {member?.confirmed && (
                                <DetailField
                                    label="Confirmation Date"
                                    name="confirmation_date"
                                    type="date"
                                    value={member?.confirmation_date || ""}
                                    onChange={(value) => handleChange("confirmation_date", value)}
                                    icon={<FileText className="h-4 w-4"/>}
                                />
                                )}
                                
                                <DetailField
                                    label="Contact"
                                    name="contact"
                                    value={member?.contact || ""}
                                    onChange={(value) => handleChange("contact", value)}
                                    icon={<Mail className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Address"
                                    name="address"
                                    value={member?.address || ""}
                                    onChange={(value) => handleChange("address", value)}
                                    icon={<UserCircle className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Society"
                                    name="society"
                                    value={member?.society || ""}
                                    onChange={(value) => handleChange("society", value)}
                                    icon={<User className="h-4 w-4"/>}
                                />
                                
                                <DetailField
                                    label="Role"
                                    name="role"
                                    value={member?.role || ""}
                                    onChange={(value) => handleChange("role", value)}
                                    icon={<User className="h-4 w-4"/>}
                                />
                                
                                <DetailField
                                    label="Outstanding Dues ($)"
                                    name="dues"
                                    type="number"
                                    value={member?.dues?.toString() || "0"}
                                    onChange={(value) => handleChange("dues", parseFloat(value) || 0)}
                                    icon={<FileText className="h-4 w-4"/>}
                                />
                                
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-medium">
                                        <Info className="h-4 w-4"/>
                                        Status
                                    </Label>
                                    <Select
                                        value={member?.status || "Active"}
                                        onValueChange={(value) => handleChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Dead">Deceased</SelectItem>
                                            <SelectItem value="Not a Member">Not a Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6"/>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Helper component for detail fields
const DetailField = ({
                         label,
                         name,
                         value,
                         onChange,
                         type = "text",
                         icon,
                     }: {
    label: string,
    name: string,
    value: string,
    onChange: (value: string) => void,
    type?: string,
    icon: React.ReactNode,
}) => (
    <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
            {icon}
            {label}
        </Label>
        <div className="relative">
            <Input
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
            />
        </div>
    </div>
);

export default EditMember;