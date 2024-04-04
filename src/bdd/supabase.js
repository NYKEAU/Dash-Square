import { createClient } from '../../node_modules/@supabase/supabase-js';

const supabaseUrl = 'https://xqxkgpbmrijjzyjlguou.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeGtncGJtcmlqanp5amxndW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNDQzNDIsImV4cCI6MjAyNzgyMDM0Mn0.wRY95qfzU4RXYpEGZm0Lpboh-Fs4BC6d5JpTCmUETy0';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
