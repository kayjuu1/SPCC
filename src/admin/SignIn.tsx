import {useEffect, useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useNavigate} from "react-router-dom";
import {Church, LogIn} from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {signIn, isAuthenticated} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleSignIn = async () => {
        setLoading(true);
        setError("");

        const {error} = await signIn(email, password);

        if (error) {
            setError(error.message);
        } else {
            navigate("/admin/dashboard"); // Redirect to dashboard
        }
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSignIn();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div
                            className="mx-auto w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
                            <Church className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Admin Sign In
                        </h1>
                        <p className="text-gray-600">
                            Access the SPCC administration panel
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                placeholder="admin@spcc.org"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <LogIn className="w-4 h-4 mr-2"/>
                                    {loading ? "Signing In..." : "Sign In"}
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Contact your system administrator for access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}