import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nkhloixigavgstakkizl.supabase.co";  // Replace with your URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raGxvaXhpZ2F2Z3N0YWtraXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDc0NDYsImV4cCI6MjA1NDY4MzQ0Nn0.KAhNB46GvBUUVK3h297-lzY7QsWbS3Tmd2mikME7yBk";  // Replace with your API Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
