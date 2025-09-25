import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useAuth} from "@/hooks/useAuth";
import {supabase} from "@/lib/supabase";
import {AlertTriangle, Bell, Database, RefreshCw, Save, Settings, Shield, Trash2} from "lucide-react";
import {toast} from "sonner";

interface AppSettings {
    notifications: {
        sessionWarnings: boolean;
        adminActions: boolean;
        systemAlerts: boolean;
    };
    security: {
        sessionTimeout: number;
        warningTime: number;
        requirePasswordChange: boolean;
    };
    display: {
        theme: 'light' | 'dark' | 'system';
        itemsPerPage: number;
        dateFormat: string;
    };
    dues: {
        startMonth: string;
        startYear: number;
    };
}

const defaultAppSettings: AppSettings = {
    notifications: {
        sessionWarnings: true,
        adminActions: true,
        systemAlerts: true,
    },
    security: {
        sessionTimeout: 30,
        warningTime: 5,
        requirePasswordChange: false,
    },
    display: {
        theme: 'light',
        itemsPerPage: 10,
        dateFormat: 'MM/DD/YYYY',
    },
    dues: {
        startMonth: 'January',
        startYear: new Date().getFullYear(),
    }
};

const deepMerge = (target: any, source: any): any => {
    const result = {...target};
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

export default function SettingsPage() {
    const {signOut} = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        loadSettings();
        applyTheme();
    }, []);

    useEffect(() => {
        applyTheme();
    }, [settings.display.theme]);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const savedSettings = localStorage.getItem('spcc-settings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                const mergedSettings = deepMerge(defaultAppSettings, parsedSettings);
                setSettings(mergedSettings);
            } else {
                setSettings(defaultAppSettings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            setSettings(defaultAppSettings);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // Save settings to localStorage or API
            localStorage.setItem('spcc-settings', JSON.stringify(settings));

            toast.error("Settings saved successfully");
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const applyTheme = () => {
        const {theme} = settings.display;
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const resetSettings = () => {
        setSettings(defaultAppSettings);
        toast.success("Settings reset to defaults");
    };

    const resetApplicationData = async () => {
        setResetting(true);
        try {
            // Delete all data in order (respecting foreign key constraints)
            await supabase.from('dues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('admin_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('deleted_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('members').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            // Clear localStorage
            localStorage.removeItem('spcc-settings');

            toast.success("System reset successfully. Redirecting to login...");

            // Sign out and redirect
            setTimeout(async () => {
                await signOut();
                window.location.href = '/admin/signin';
            }, 2000);

        } catch (error) {
            console.error('Error resetting system:', error);
            toast.error("Failed to reset system data");
        } finally {
            setResetting(false);
            setResetDialogOpen(false);
        }
    };

    const updateNotificationSetting = (key: keyof AppSettings['notifications'], value: boolean) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const updateSecuritySetting = (key: keyof AppSettings['security'], value: number | boolean) => {
        setSettings(prev => ({
            ...prev,
            security: {
                ...prev.security,
                [key]: value
            }
        }));
    };

    const updateDisplaySetting = (key: keyof AppSettings['display'], value: string | number) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                [key]: value
            }
        }));
    };

    const updateDuesSetting = (key: keyof AppSettings['dues'], value: string | number) => {
        setSettings(prev => ({
            ...prev,
            dues: {
                ...prev.dues,
                [key]: value
            }
        }));
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
                        <Settings className="w-8 h-8 text-teal-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">Application Settings</h1>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={resetSettings}
                            disabled={saving}
                        >
                            <RefreshCw className="w-4 h-4 mr-2"/>
                            Reset to Defaults
                        </Button>
                        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={saving || resetting}
                                >
                                    <Trash2 className="w-4 h-4 mr-2"/>
                                    Reset System
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center text-red-600">
                                        <AlertTriangle className="w-5 h-5 mr-2"/>
                                        Reset Entire System
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        This will permanently delete ALL data including:
                                    </p>
                                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                        <li>All member records</li>
                                        <li>All dues records</li>
                                        <li>All attendance records</li>
                                        <li>All admin logs</li>
                                        <li>All deleted member records</li>
                                        <li>All application settings</li>
                                    </ul>
                                    <p className="text-sm font-medium text-red-600">
                                        This action cannot be undone!
                                    </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setResetDialogOpen(false)}
                                        disabled={resetting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={resetApplicationData}
                                        disabled={resetting}
                                    >
                                        {resetting ? (
                                            <div className="flex items-center">
                                                <div
                                                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Resetting...
                                            </div>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4 mr-2"/>
                                                Yes, Reset Everything
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            onClick={saveSettings}
                            disabled={saving}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <Save className="w-4 h-4 mr-2"/>
                            )}
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </div>
                <p className="text-gray-600 mt-2">
                    Configure application preferences and security settings
                </p>
            </div>

            <div className="space-y-8">
                {/* Notification Settings */}
                <Card className="bg-white rounded-lg shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-blue-600"/>
                            Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Session Warnings</Label>
                                <p className="text-sm text-gray-500">Get notified before your session expires</p>
                            </div>
                            <Switch
                                checked={settings.notifications.sessionWarnings}
                                onCheckedChange={(checked) => updateNotificationSetting('sessionWarnings', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Admin Actions</Label>
                                <p className="text-sm text-gray-500">Notifications for admin activities and changes</p>
                            </div>
                            <Switch
                                checked={settings.notifications.adminActions}
                                onCheckedChange={(checked) => updateNotificationSetting('adminActions', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">System Alerts</Label>
                                <p className="text-sm text-gray-500">Important system notifications and updates</p>
                            </div>
                            <Switch
                                checked={settings.notifications.systemAlerts}
                                onCheckedChange={(checked) => updateNotificationSetting('systemAlerts', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="bg-white rounded-lg shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-green-600"/>
                            Security Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</Label>
                                <Input
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">How long before automatic logout</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Warning Time (minutes)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="15"
                                    value={settings.security.warningTime}
                                    onChange={(e) => updateSecuritySetting('warningTime', parseInt(e.target.value))}
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">Warning before session expires</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Require Password Change</Label>
                                <p className="text-sm text-gray-500">Force password change on next login</p>
                            </div>
                            <Switch
                                checked={settings.security.requirePasswordChange}
                                onCheckedChange={(checked) => updateSecuritySetting('requirePasswordChange', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Display Settings */}
                <Card className="bg-white rounded-lg shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Database className="w-5 h-5 mr-2 text-purple-600"/>
                            Display Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Theme</Label>
                                <Select
                                    value={settings.display.theme}
                                    onValueChange={(value: 'light' | 'dark' | 'system') => updateDisplaySetting('theme', value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Items Per Page</Label>
                                <Select
                                    value={settings.display.itemsPerPage.toString()}
                                    onValueChange={(value) => updateDisplaySetting('itemsPerPage', parseInt(value))}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                                <Select
                                    value={settings.display.dateFormat}
                                    onValueChange={(value) => updateDisplaySetting('dateFormat', value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dues Settings */}
                <Card className="bg-white rounded-lg shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Database className="w-5 h-5 mr-2 text-orange-600"/>
                            Dues Collection Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Start Month</Label>
                                <Select
                                    value={settings.dues.startMonth}
                                    onValueChange={(value) => updateDuesSetting('startMonth', value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-500 mt-1">Month when dues collection starts</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Start Year</Label>
                                <Input
                                    type="number"
                                    min="2020"
                                    max="2030"
                                    value={settings.dues.startYear}
                                    onChange={(e) => updateDuesSetting('startYear', parseInt(e.target.value))}
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">Year when dues collection started</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}