
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    console.error("URL:", supabaseUrl);
    console.error("KEY:", supabaseKey ? "Found" : "Missing");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
    const testEmail = `debug_test_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    console.log(`\n--- Testing with Email: ${testEmail} ---`);

    // 1. Signup (Create User)
    console.log("1. creating user...");
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    const userData = {
        name: "Debug User",
        email: testEmail,
        password: hashedPassword,
        role: "student",
        is_active: true
    };

    const { data: user, error: createError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

    if (createError) {
        console.error("❌ user creation failed:", createError);
        return;
    }
    console.log("✅ user created successfully. ID:", user.id);
    console.log("   Stored Hash Length:", user?.password?.length);
    console.log("   Stored Hash:", user?.password);

    // 2. Check Password Verification
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log(`2. password verification check: ${isMatch ? "✅ MATCH" : "❌ MISMATCH"}`);

    if (!isMatch) {
        console.log("   Sent Password for check:", testPassword);
    }

    // 3. Duplicate Signup Check
    console.log("\n3. attempting duplicate signup (same email)...");
    const { data: dupUser, error: dupError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

    if (dupError) {
        console.log("✅ duplicate creation failed (Expected):", dupError.code, dupError.message);
    } else {
        console.log("❌ duplicate creation SUCCEEDED (Not Expected!). User ID:", dupUser.id);
        console.log("   !! This means the 'email' column is NOT unique in the database !!");
    }

    // 4. Get User By Email Check
    console.log("\n4. testing getUserByEmail...");
    const { data: fetchedUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', testEmail)
        .single();

    if (fetchError) {
        if (fetchError.code === 'PGRST116') {
            console.log("❌ getUserByEmail returned NO ROWS (PGRST116)");
        } else {
            console.log("❌ getUserByEmail failed:", fetchError);
        }
    } else {
        console.log("✅ getUserByEmail found user:", fetchedUser.email);
    }

    // Cleanup
    console.log("\n5. cleaning up...");
    await supabase.from('users').delete().eq('email', testEmail);
    console.log("✅ cleanup done.");
}

testAuth();
