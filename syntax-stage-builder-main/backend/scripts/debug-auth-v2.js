
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testAuthCycle() {
    const testEmail = `duplicate_test_${Date.now()}@test.com`;
    const testPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    console.log(`\n🔍 TESTING DUPLICATE SIGNUP SCENARIO`);
    console.log(`📧 Test Email: ${testEmail}`);

    // STEP 1: First Signup (Simulate)
    console.log(`\n[Step 1] Creating First User...`);
    const { data: user1, error: err1 } = await supabase
        .from('users')
        .insert([{
            id: require('crypto').randomUUID(),
            name: "User One",
            email: testEmail,
            password: hashedPassword,
            role: "student",
            is_active: true
        }])
        .select()
        .single();

    if (err1) {
        console.error("❌ Step 1 Failed:", err1.message);
        return;
    }
    console.log("✅ User 1 Created. ID:", user1.id);

    // STEP 2: Check getUserByEmail Logic
    console.log(`\n[Step 2] Checking if User 1 is findable via .eq('email', email)...`);
    const { data: foundUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', testEmail)
        .single();

    if (findError) {
        console.log("❌ Step 2 Failed: Could not find user!", findError);
        // If we can't find it, auth.js logic 'if (existingUser)' will be FALSE, allowing duplicates.
    } else {
        console.log("✅ Step 2 Success: Found user:", foundUser.id);
    }

    // STEP 3: Attempt Second Signup (Duplicate)
    console.log(`\n[Step 3] Creating Second User (Duplicate Email)...`);
    const { data: user2, error: err2 } = await supabase
        .from('users')
        .insert([{
            id: require('crypto').randomUUID(),
            name: "User Two (Duplicate)",
            email: testEmail, // SAME EMAIL
            password: hashedPassword,
            role: "student",
            is_active: true
        }])
        .select()
        .single();

    if (err2) {
        console.log("✅ Step 3 Blocked (Good): Database prevented duplicate.", err2.message);
    } else {
        console.log("❌ Step 3 SUCCEEDED (BAD): Duplicate created!");
        console.log("   User 1 ID:", user1.id);
        console.log("   User 2 ID:", user2.id);
        console.log("   ⚠️ CRITICAL: The 'users' table is missing a UNIQUE constraint on 'email'.");
    }

    // CLEANUP
    console.log(`\n[Cleanup] Deleting test users...`);
    await supabase.from('users').delete().eq('email', testEmail);
    console.log("✅ Cleanup complete.");
}

testAuthCycle();
