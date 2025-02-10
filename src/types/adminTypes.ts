// src/types/adminTypes.ts
export interface Member {
    id?: number;
    name: string;
    dob: string;
    dues_card_id?: string | null;
    baptized: boolean;
    baptism_date?: string | null;
    confirmed: boolean;
    confirmation_date?: string | null;
    contact: string;
    address: string;
    society: string;
    role: string;
    status: "Active" | "Inactive" | "Dead" | "Not a Member";
    defaulted: boolean;
}
