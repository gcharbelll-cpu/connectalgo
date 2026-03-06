import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing environment variables", process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

async function testQuery(table: string) {
    console.log(`Testing table: ${table}...`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
        console.error(`Error querying ${table}:`, error.message);
    } else {
        console.log(`Success! Found ${data.length} rows in ${table}.`);
    }
}

async function run() {
    await testQuery('strategies');
    await testQuery('testimonials');
    await testQuery('faqs');
    await testQuery('admins');
}

run();
