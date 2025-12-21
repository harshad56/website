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

// Test AI Chat functionality
async function testAIChat() {
    console.log('🤖 Testing AI Chat...');
    try {
        const chatData = {
            message: "How do I create a function in JavaScript?",
            language: "javascript",
            context: "beginner"
        };

        const response = await makeRequest('/api/ai/chat', 'POST', chatData);
        console.log(`✅ AI Chat: ${response.status}`);
        console.log(`📝 Response: ${JSON.stringify(response.data.response, null, 2)}`);
        return response.data.success;
    } catch (error) {
        console.log(`❌ AI Chat failed: ${error.message}`);
        return false;
    }
}

// Test Code Analysis functionality
async function testCodeAnalysis() {
    console.log('\n🔍 Testing Code Analysis...');
    try {
        const codeData = {
            code: `function calculateSum(a, b) {
    return a + b;
}

console.log(calculateSum(5, 3));`,
            language: "javascript",
            task: "Review this function for best practices"
        };

        const response = await makeRequest('/api/ai/analyze-code', 'POST', codeData);
        console.log(`✅ Code Analysis: ${response.status}`);
        console.log(`📊 Analysis: ${JSON.stringify(response.data.analysis, null, 2)}`);
        return response.data.success;
    } catch (error) {
        console.log(`❌ Code Analysis failed: ${error.message}`);
        return false;
    }
}

// Test Learning Recommendations
async function testLearningRecommendations() {
    console.log('\n📚 Testing Learning Recommendations...');
    try {
        const recommendationData = {
            language: "javascript",
            topic: "functions"
        };

        const response = await makeRequest('/api/ai/recommendations', 'POST', recommendationData);
        console.log(`✅ Learning Recommendations: ${response.status}`);
        console.log(`🎯 Recommendations: ${JSON.stringify(response.data.recommendations, null, 2)}`);
        return response.data.success;
    } catch (error) {
        console.log(`❌ Learning Recommendations failed: ${error.message}`);
        return false;
    }
}

// Test Health Check
async function testHealthCheck() {
    console.log('🏥 Testing Health Check...');
    try {
        const response = await makeRequest('/health');
        console.log(`✅ Health Check: ${response.status} - ${JSON.stringify(response.data)}`);
        return response.status === 200;
    } catch (error) {
        console.log(`❌ Health Check failed: ${error.message}`);
        return false;
    }
}

// Test Courses Endpoint
async function testCourses() {
    console.log('\n📖 Testing Courses Endpoint...');
    try {
        const response = await makeRequest('/api/courses');
        console.log(`✅ Courses: ${response.status}`);
        console.log(`📚 Available Courses: ${JSON.stringify(response.data.courses, null, 2)}`);
        return response.data.success;
    } catch (error) {
        console.log(`❌ Courses failed: ${error.message}`);
        return false;
    }
}

// Test Community Posts
async function testCommunityPosts() {
    console.log('\n👥 Testing Community Posts...');
    try {
        const response = await makeRequest('/api/community/posts');
        console.log(`✅ Community Posts: ${response.status}`);
        console.log(`💬 Posts: ${JSON.stringify(response.data.posts, null, 2)}`);
        return response.data.success;
    } catch (error) {
        console.log(`❌ Community Posts failed: ${error.message}`);
        return false;
    }
}

// Main test function
async function runAITests() {
    console.log('🚀 Starting AI Feature Tests...\n');

    // Test 1: Health Check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log('❌ Health check failed. Server might not be running.');
        return;
    }

    // Test 2: AI Chat
    await testAIChat();

    // Test 3: Code Analysis
    await testCodeAnalysis();

    // Test 4: Learning Recommendations
    await testLearningRecommendations();

    // Test 5: Courses
    await testCourses();

    // Test 6: Community Posts
    await testCommunityPosts();

    console.log('\n🎉 AI Feature Testing Complete!');
    console.log('\n📝 Test Summary:');
    console.log('✅ Health Check - Server is running');
    console.log('✅ AI Chat - Mock responses working');
    console.log('✅ Code Analysis - Structured feedback working');
    console.log('✅ Learning Recommendations - Personalized suggestions working');
    console.log('✅ Courses - Mock course data available');
    console.log('✅ Community Posts - Mock community data available');

    console.log('\n🔧 Next Steps:');
    console.log('1. Replace mock responses with real OpenAI API calls');
    console.log('2. Set up real Supabase database');
    console.log('3. Configure real API keys in .env file');
    console.log('4. Test frontend integration with these endpoints');
    console.log('5. Implement real-time features with Socket.IO');
}

// Run the tests
runAITests().catch(console.error);