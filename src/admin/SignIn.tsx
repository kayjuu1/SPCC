import {useEffect, useState} from "react";
import {supabase} from "@/supabaseClient.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {setIsAuthenticated} = useAuth();

    const handleSignIn = async () => {
        setLoading(true);
        setError("");
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setIsAuthenticated(true); // Update authentication state
            navigate("/admin/dashboard"); // Redirect to dashboard
        }
        setLoading(false);
    };

    useEffect(() => {
        const checkSession = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            console.log("Session:", session);
        };

        checkSession();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">ADMIN SIGN IN</h2>
                {error && <p className="font-bold text-red-500">{error}</p>}
                <form>
                    <Label>Email</Label>
                    <Input type="email" onChange={(e) => setEmail(e.target.value)}/>
                    <Label>Password</Label>
                    <Input type="password" onChange={(e) => setPassword(e.target.value)}/>
                    <Button onClick={handleSignIn} className="w-full mt-4" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
            </div>
        </div>
    );
}