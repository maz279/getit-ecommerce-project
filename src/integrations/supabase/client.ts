// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bbgppsjmspmymrfowytf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);