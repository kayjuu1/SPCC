export interface Member {
  id: string;
  name: string;
  dob: string | null;
  dues_card_id: string | null;
  baptized: boolean;
  baptism_date: string | null;
  confirmed: boolean;
  confirmation_date: string | null;
  contact: string | null;
  address: string | null;
  society: string | null;
  role: string | null;
  status: 'Active' | 'Inactive' | 'Dead' | 'Not a Member';
  defaulted: boolean;
  dependents: string[];
  dues: number;
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  created_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DeletedMember {
  id: string;
  original_member_id: string;
  member_data: Member;
  deleted_by: string;
  deleted_at: string;
  reason?: string;
}

export interface UserSearchResult {
  id: string;
  name: string;
  dues: number;
}