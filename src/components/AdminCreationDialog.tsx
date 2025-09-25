import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Eye, EyeOff, UserPlus} from "lucide-react";
import {CreateAdminRequest} from "@/services/adminService";

interface AdminCreationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateAdmin: (adminData: CreateAdminRequest) => Promise<void>;
    loading?: boolean;
}

export default function AdminCreationDialog({
                                                isOpen,
                                                onClose,
                                                onCreateAdmin,
                                                loading = false
                                            }: AdminCreationDialogProps) {
    const [formData, setFormData] = useState<CreateAdminRequest>({
        name: "",
        email: "",
        password: "",
        role: "admin"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await onCreateAdmin(formData);
            handleClose();
        } catch (error) {
            // Error handling is done in the parent component
            console.error('Failed to create admin:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "admin"
        });
        setErrors({});
        setShowPassword(false);
        onClose();
    };

    const handleInputChange = (field: keyof CreateAdminRequest, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ""}));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <UserPlus className="w-5 h-5 mr-2 text-teal-600"/>
                        Add New Admin
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter full name"
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter email address"
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Enter password"
                                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400"/>
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400"/>
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                            Role
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: 'admin' | 'super_admin') => handleInputChange('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </div>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2"/>
                                Create Admin
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}