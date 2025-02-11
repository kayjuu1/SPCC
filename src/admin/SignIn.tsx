import { useState } from "react";
import { supabase } from "@/supabaseClient.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
        } else {
            navigate("/admin/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Admin Sign-In</h2>
                {error && <p className="text-red-500">{error}</p>}
                <Label>Email</Label>
                <Input type="email" onChange={(e) => setEmail(e.target.value)} />
                <Label>Password</Label>
                <Input type="password" onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleSignIn} className="w-full mt-4" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </Button>
                <p className="mt-3 text-sm">
                    Don't have an account? <a href="/admin/signup" className="text-blue-500">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
