// Define Member Status Type
export type MemberStatus = "Active" | "Inactive" | "Dead" | "Not a Member";

// Define Member Type
export type MemberData = {
    id: string;
    name: string;
    status: MemberStatus;
    defaulted: boolean;
};

// Function to fetch members from Supabase
import { supabase } from "@/supabaseClient.ts";

export const fetchMembers = async (): Promise<MemberData[]> => {
    const { data, error } = await supabase.from("members").select("id, name, status, defaulted");
    if (error) {
        console.error("Error fetching members:", error);
        return [];
    }
    return data as MemberData[];
};
