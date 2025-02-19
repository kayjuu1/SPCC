import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {supabase} from "@/supabaseClient.ts";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {toast} from "@/hooks/use-toast";
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
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            if (!id) return;
            const {data, error} = await supabase.from("members").select("*").eq("id", id).single();
            if (error) {
                toast({description: "Error fetching member data."});
                return;
            } else {
                setMember(data);
            }
            setLoading(false);
        };

        fetchMember();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMember({...member, [e.target.name]: e.target.value});
    };

    const handleSubmit = async () => {
        try {
            const {error} = await supabase.from("members").update(member).eq("id", id);
            if (error) throw error;

            toast({description: "Member updated successfully."});
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };
    const handleDelete = async () => {
        try {
            const {error} = await supabase.from("members").delete().eq("id", id);
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
                                    onChange={handleChange}
                                    icon={<User className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Dues Card ID"
                                    name="id"
                                    value={member?.dues_card_id || ""}
                                    onChange={handleChange}
                                    icon={<FileText className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Date of Birth"
                                    name="date of birth"
                                    type="date"
                                    value={member?.dob || ""}
                                    onChange={handleChange}
                                    icon={<Calendar className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Baptismal Date"
                                    name="Date of Baptism"
                                    type="date"
                                    value={member?.baptism_date || ""}
                                    onChange={handleChange}
                                    icon={<Calendar className="h-4 w-4"/>}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <DetailField
                                    label="Confirmation Date"
                                    name="Date of Confirmation"
                                    value={member?.confirmation_date || ""}
                                    onChange={handleChange}
                                    icon={<FileText className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Contact"
                                    name="contact"
                                    value={member?.contact || ""}
                                    onChange={handleChange}
                                    icon={<Mail className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Address"
                                    name="Address"
                                    value={member?.address || ""}
                                    onChange={handleChange}
                                    icon={<UserCircle className="h-4 w-4"/>}
                                />
                                <DetailField
                                    label="Society"
                                    name="society"
                                    value={member?.society || ""}
                                    onChange={handleChange}
                                    icon={<User className="h-4 w-4"/>}
                                />
                            </div>
                        </div>

                        <Separator className="my-6"/>

                        {/*<Button variant="ghost" onClick={handleCancel}>Cancel</Button>*/}
                        <Button onClick={handleSubmit}>Save Changes</Button>

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
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    icon: React.ReactNode,
    required?: boolean
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
                onChange={onChange}
                className="w-full"
            />
        </div>
    </div>
);

export default EditMember;