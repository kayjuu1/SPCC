import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/hooks/useAuth";
import {supabase} from "@/lib/supabase";
import {formatDate} from "@/lib/utils";
import {Calendar, Edit, Save, Shield, User} from "lucide-react";
import {toast} from "sonner";

interface AdminProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function ProfilePage() {
    const {user} = useAuth();
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

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

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;

        try {
            const {data, error} = await supabase
                .from('admins')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                throw error;
            }

            setProfile(data);
            setFormData({
                name: data.name,
                email: data.email
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error("Failed to load profile information");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            const {error} = await supabase
                .from('admins')
                .update({
                    name: formData.name,
                    email: formData.email
                })
                .eq('id', profile.id);

            if (error) {
                throw error;
            }

            // Update auth email if changed
            if (formData.email !== profile.email) {
                const {error: authError} = await supabase.auth.updateUser({
                    email: formData.email
                });

                if (authError) {
                    throw authError;
                }
            }

            setProfile(prev => prev ? {...prev, name: formData.name, email: formData.email} : null);
            setEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name,
                email: profile.email
            });
        }
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <User className="w-8 h-8 text-teal-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
                    </div>
                    {!editing && (
                        <Button
                            onClick={() => setEditing(true)}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            <Edit className="w-4 h-4 mr-2"/>
                            Edit Profile
                        </Button>
                    )}
                </div>
                <p className="text-gray-600 mt-2">
                    Manage your account information and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2">
                    <Card className="bg-white rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-teal-600"/>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </Label>
                                    {editing ? (
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                                            {profile?.name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    {editing ? (
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                                            {profile?.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editing && (
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-teal-600 hover:bg-teal-700"
                                    >
                                        {saving ? (
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                            <Save className="w-4 h-4 mr-2"/>
                                        )}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Account Details */}
                <div className="space-y-6">
                    <Card className="bg-white rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-green-600"/>
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Role</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    profile?.role === 'super_admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                            {profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                        </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    profile?.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                            {profile?.status}
                                        </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Member Since</span>
                                <span className="text-sm text-gray-800">
                                            {profile?.created_at ? formatDate(profile.created_at, getDateFormat()) : '-'}
                                        </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                <span className="text-sm text-gray-800">
                                            {profile?.updated_at ? formatDate(profile.updated_at, getDateFormat()) : '-'}
                                        </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Session Information */}
                    <Card className="bg-white rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-orange-600"/>
                                Session Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Session Timeout</span>
                                    <span className="text-sm text-gray-800">30 minutes</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-600">Auto-logout Warning</span>
                                    <span className="text-sm text-gray-800">5 minutes before</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}