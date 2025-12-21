const http = require('http');

// Test the health endpoint
function testHealth() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/health',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Test user registration
function testRegistration() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!'
        });

        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Test get courses
function testCourses() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/courses',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Run tests
async function runTests() {
    console.log('🚀 Testing Your API...\n');

    // Test 1: Health Check
    console.log('🏥 Testing Health Check...');
    try {
        const healthResult = await testHealth();
        console.log(`✅ Health Check: ${healthResult.status} - ${JSON.stringify(healthResult.data)}`);
    } catch (error) {
        console.log(`❌ Health Check failed: ${error.message}`);
    }

    // Test 2: Get Courses
    console.log('\n📚 Testing Get Courses...');
    try {
        const coursesResult = await testCourses();
        console.log(`✅ Get Courses: ${coursesResult.status} - ${JSON.stringify(coursesResult.data)}`);
    } catch (error) {
        console.log(`❌ Get Courses failed: ${error.message}`);
    }

    // Test 3: User Registration
    console.log('\n👤 Testing User Registration...');
    try {
        const registrationResult = await testRegistration();
        console.log(`✅ User Registration: ${registrationResult.status} - ${JSON.stringify(registrationResult.data)}`);
    } catch (error) {
        console.log(`❌ User Registration failed: ${error.message}`);
    }

    console.log('\n🎉 API Testing Complete!');
}

runTests();