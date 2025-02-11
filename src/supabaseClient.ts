import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nkhloixigavgstakkizl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raGxvaXhpZ2F2Z3N0YWtraXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDc0NDYsImV4cCI6MjA1NDY4MzQ0Nn0.KAhNB46GvBUUVK3h297-lzY7QsWbS3Tmd2mikME7yBk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
