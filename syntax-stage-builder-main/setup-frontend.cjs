#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌐 CodeAcademy Pro - Frontend Setup Script');
console.log('==========================================\n');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function updateApiService() {
    log('🔧 Updating API service configuration...', 'blue');

    const apiServicePath = path.join(__dirname, 'src', 'services', 'ApiService.ts');

    if (fs.existsSync(apiServicePath)) {
        let content = fs.readFileSync(apiServicePath, 'utf8');

        // Update API base URL
        const apiBaseUrl = 'http://localhost:5000/api';
        const updatedContent = content.replace(
            /const API_BASE_URL = ['"][^'"]*['"]/,
            `const API_BASE_URL = '${apiBaseUrl}'`
        );

        fs.writeFileSync(apiServicePath, updatedContent);
        log('✅ API service updated with backend URL', 'green');
    } else {
        log('⚠️  ApiService.ts not found, skipping...', 'yellow');
    }
}

function installDependencies() {
    log('\n📦 Installing frontend dependencies...', 'blue');

    try {
        execSync('npm install', { stdio: 'inherit' });
        log('✅ Frontend dependencies installed successfully', 'green');
        return true;
    } catch (error) {
        log('❌ Failed to install frontend dependencies', 'red');
        return false;
    }
}

function buildFrontend() {
    log('\n🔨 Building frontend for production...', 'blue');

    try {
        execSync('npm run build', { stdio: 'inherit' });
        log('✅ Frontend built successfully', 'green');
        return true;
    } catch (error) {
        log('❌ Frontend build failed', 'red');
        return false;
    }
}

function startDevelopment() {
    log('\n🚀 Starting frontend in development mode...', 'blue');

    try {
        log('✅ Frontend development server starting...', 'green');
        log('🌐 Access your application at: http://localhost:3000', 'yellow');
        log('🔗 Backend API at: http://localhost:5000', 'yellow');

        execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
        log('❌ Failed to start development server', 'red');
    }
}

function showFrontendInfo() {
    log('\n📊 Frontend Setup Complete!', 'blue');
    log('==========================', 'blue');
    log('✅ Frontend configured successfully!', 'green');

    log('\n🔗 Access your application:', 'yellow');
    log('   - Frontend: http://localhost:3000', 'green');
    log('   - Backend API: http://localhost:5000', 'green');
    log('   - Health Check: http://localhost:5000/health', 'green');

    log('\n📋 Development Commands:', 'yellow');
    log('   - Start dev server: npm run dev', 'green');
    log('   - Build for production: npm run build', 'green');
    log('   - Preview build: npm run preview', 'green');

    log('\n🔧 Next Steps:', 'yellow');
    log('1. Ensure your backend is running on port 5000', 'green');
    log('2. Test the AI features in the frontend', 'green');
    log('3. Configure authentication and user management', 'green');
    log('4. Set up payment processing integration', 'green');

    log('\n🎉 Your CodeAcademy Pro frontend is ready!', 'green');
}

async function main() {
    try {
        // Step 1: Install dependencies
        const depsOk = await installDependencies();
        if (!depsOk) {
            process.exit(1);
        }

        // Step 2: Update API service
        updateApiService();

        // Step 3: Build frontend (optional)
        const buildOk = await buildFrontend();
        if (!buildOk) {
            log('⚠️  Build failed, but continuing...', 'yellow');
        }

        // Step 4: Show setup info
        showFrontendInfo();

        // Step 5: Ask if user wants to start development server
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('\nWould you like to start the development server? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                startDevelopment();
            } else {
                log('\n✅ Setup complete! Run "npm run dev" to start the development server.', 'green');
                rl.close();
            }
        });

    } catch (error) {
        log('❌ Frontend setup failed', 'red');
        log(error.message, 'red');
        process.exit(1);
    }
}

// Run the setup script
if (require.main === module) {
    main();
}

module.exports = { main };