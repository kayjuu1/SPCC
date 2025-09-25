import {useCallback, useState} from "react";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {supabase} from "@/lib/supabase";
import {Search, Users} from "lucide-react";

interface SearchResult {
    id: string;
    name: string;
    dues: number;
}

export default function UserSearch() {
    const [search, setSearch] = useState<string>("");
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [selectedMember, setSelectedMember] = useState<SearchResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = useCallback(async () => {
        if (search.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const {data, error} = await supabase
                .from("members")
                .select("id, name, dues")
                .ilike("name", `%${search}%`)
                .limit(10);

            if (error) {
                throw error;
            } else {
                setSuggestions(data || []);
                setErrorMessage(null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Search failed';
            setErrorMessage(errorMessage);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, [search]);

    const handleMemberSelect = (member: SearchResult) => {
        setSelectedMember(member);
        setSearch(member.name);
        setSuggestions([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div
                            className="mx-auto w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            SPCC Member Search
                        </h1>
                        <p className="text-gray-600">
                            Search for members and check outstanding dues
                        </p>
                    </div>

                    <div className="relative mb-4">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                            <Input
                                placeholder="Enter member name..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (e.target.value.length >= 2) {
                                        fetchSuggestions();
                                    } else {
                                        setSuggestions([]);
                                    }
                                }}
                                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                            />
                        </div>

                        {loading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                            </div>
                        )}
                    </div>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {suggestions.length > 0 && (
                        <div
                            className="mb-4 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((member) => (
                                <button
                                    key={member.id}
                                    className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                                    onClick={() => handleMemberSelect(member)}
                                >
                                    <div className="font-medium text-gray-900">{member.name}</div>
                                    <div className="text-sm text-gray-500">
                                        Outstanding dues: ${member.dues}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedMember && (
                        <Card className="border-2 border-teal-200 bg-teal-50">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        {selectedMember.name}
                                    </h2>
                                    <div
                                        className="inline-flex items-center px-4 py-2 rounded-full bg-white border-2 border-teal-200">
                                        <span className="text-sm font-medium text-gray-600 mr-2">
                                            Outstanding Dues:
                                        </span>
                                        <span className={`text-lg font-bold ${
                                            selectedMember.dues > 0 ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            ${selectedMember.dues}
                                        </span>
                                    </div>
                                    {selectedMember.dues === 0 && (
                                        <p className="text-green-600 text-sm mt-2 font-medium">
                                            ✓ All dues are up to date
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            For administrative access, contact your parish administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
