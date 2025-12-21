const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedBody = JSON.parse(body);
                    resolve({
                        status: res.statusCode,
                        data: parsedBody
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test functions
async function testHealthCheck() {
    console.log('🏥 Testing Health Check...');
    try {
        const response = await makeRequest('/health');
        console.log(`✅ Health Check: ${response.status} - ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        console.log(`❌ Health Check failed: ${error.message}`);
        return false;
    }
}

async function testUserRegistration() {
    console.log('\n👤 Testing User Registration...');
    try {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!'
        };

        const response = await makeRequest('/api/auth/register', 'POST', userData);
        console.log(`✅ User Registration: ${response.status} - ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.log(`❌ User Registration failed: ${error.message}`);
        return null;
    }
}

async function testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    try {
        const loginData = {
            email: 'test@example.com',
            password: 'Password123!'
        };

        const response = await makeRequest('/api/auth/login', 'POST', loginData);
        console.log(`✅ User Login: ${response.status} - ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.log(`❌ User Login failed: ${error.message}`);
        return null;
    }
}

async function testGetCourses() {
    console.log('\n📚 Testing Get Courses...');
    try {
        const response = await makeRequest('/api/courses');
        console.log(`✅ Get Courses: ${response.status} - ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        console.log(`❌ Get Courses failed: ${error.message}`);
        return false;
    }
}

async function testCommunityPosts() {
    console.log('\n💬 Testing Community Posts...');
    try {
        const response = await makeRequest('/api/community/posts');
        console.log(`✅ Get Community Posts: ${response.status} - ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        console.log(`❌ Get Community Posts failed: ${error.message}`);
        return false;
    }
}

async function testCodeExecution() {
    console.log('\n💻 Testing Code Execution...');
    try {
        const codeData = {
            language: 'javascript',
            code: 'console.log("Hello, World!");',
            testCases: []
        };

        const response = await makeRequest('/api/code-execution/execute', 'POST', codeData);
        console.log(`✅ Code Execution: ${response.status} - ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        console.log(`❌ Code Execution failed: ${error.message}`);
        return false;
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    // Test 1: Health Check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log('❌ Health check failed. Server might not be running.');
        return;
    }

    // Test 2: Get Courses (public endpoint)
    await testGetCourses();

    // Test 3: Community Posts (public endpoint)
    await testCommunityPosts();

    // Test 4: User Registration
    const registrationResult = await testUserRegistration();

    // Test 5: User Login
    if (registrationResult) {
        await testUserLogin();
    }

    // Test 6: Code Execution (requires authentication)
    if (registrationResult) {
        await testCodeExecution();
    }

    console.log('\n🎉 API Testing Complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Run the SQL schema in Supabase dashboard');
    console.log('2. Test authenticated endpoints with JWT tokens');
    console.log('3. Connect your frontend to the backend');
}

// Run the tests
runTests().catch(console.error);