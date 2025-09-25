import {useState} from "react";
import {supabase} from "@/lib/supabase";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useNavigate} from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setLoading(true);
        setError("");
        const {error} = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setError(error.message);
        } else {
            alert("Check your email for confirmation!");
            navigate("/admin/signin");
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Admin Sign-Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <Label>Email</Label>
                <Input type="email" onChange={(e) => setEmail(e.target.value)}/>
                <Label>Password</Label>
                <Input type="password" onChange={(e) => setPassword(e.target.value)}/>
                <Button onClick={handleSignUp} className="w-full mt-4" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                <p className="mt-3 text-sm">
                    Already have an account? <a href="/admin/signin" className="text-blue-500">Sign In</a>
                </p>
            </div>
        </div>
    );
}
