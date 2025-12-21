#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 CodeAcademy Pro - Production Deployment Script');
console.log('================================================\n');

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

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function checkPrerequisites() {
    log('🔍 Checking prerequisites...', 'blue');

    try {
        // Check Node.js version
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        log(`✅ Node.js version: ${nodeVersion}`, 'green');

        // Check npm
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        log(`✅ npm version: ${npmVersion}`, 'green');

        // Check if .env exists
        if (fs.existsSync('.env')) {
            log('✅ .env file exists', 'green');
        } else {
            log('⚠️  .env file not found - will create one', 'yellow');
        }

        return true;
    } catch (error) {
        log('❌ Prerequisites check failed', 'red');
        log('Please ensure Node.js and npm are installed', 'red');
        return false;
    }
}

async function setupEnvironment() {
    log('\n🔧 Setting up environment variables...', 'blue');

    const envPath = '.env';
    let envContent = '';

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Required environment variables
    const requiredVars = [
        'OPENAI_API_KEY',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'STRIPE_SECRET_KEY',
        'STRIPE_PUBLISHABLE_KEY',
        'JWT_SECRET'
    ];

    const missingVars = [];

    for (const varName of requiredVars) {
        if (!envContent.includes(`${varName}=`)) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`, 'yellow');
        log('Please provide the following values:', 'blue');

        for (const varName of missingVars) {
            const value = await question(`${varName}: `);
            envContent += `\n${varName}=${value}`;
        }

        fs.writeFileSync(envPath, envContent);
        log('✅ Environment variables updated', 'green');
    } else {
        log('✅ All required environment variables are set', 'green');
    }
}

async function installDependencies() {
    log('\n📦 Installing dependencies...', 'blue');

    try {
        execSync('npm install', { stdio: 'inherit' });
        log('✅ Dependencies installed successfully', 'green');
        return true;
    } catch (error) {
        log('❌ Failed to install dependencies', 'red');
        return false;
    }
}

async function setupDatabase() {
    log('\n🗄️  Database Setup Instructions', 'blue');
    log('================================', 'blue');
    log('1. Go to https://supabase.com and create a new project', 'yellow');
    log('2. Copy your project URL and API keys', 'yellow');
    log('3. Run the following SQL in your Supabase SQL editor:', 'yellow');
    log('   (The schema is in scripts/supabase-schema.sql)', 'yellow');

    const runSchema = await question('\nWould you like to see the database schema? (y/n): ');

    if (runSchema.toLowerCase() === 'y') {
        const schemaPath = path.join(__dirname, 'scripts', 'supabase-schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            log('\n📋 Database Schema:', 'blue');
            console.log(schema);
        }
    }

    log('\n✅ Database setup instructions provided', 'green');
}

async function testBackend() {
    log('\n🧪 Testing backend...', 'blue');

    try {
        // Start the server in the background
        const server = execSync('node production-ai-server.js', {
            stdio: 'pipe',
            timeout: 10000
        });

        log('✅ Backend server started successfully', 'green');

        // Test health endpoint
        const http = require('http');
        const healthCheck = () => {
            return new Promise((resolve) => {
                const req = http.request('http://localhost:5000/health', (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve(response.status === 'OK');
                        } catch (e) {
                            resolve(false);
                        }
                    });
                });
                req.on('error', () => resolve(false));
                req.setTimeout(5000, () => resolve(false));
                req.end();
            });
        };

        const isHealthy = await healthCheck();
        if (isHealthy) {
            log('✅ Health check passed', 'green');
        } else {
            log('⚠️  Health check failed', 'yellow');
        }

        return true;
    } catch (error) {
        log('❌ Backend test failed', 'red');
        log(error.message, 'red');
        return false;
    }
}

async function setupPM2() {
    log('\n⚙️  Setting up PM2 for production...', 'blue');

    try {
        // Check if PM2 is installed
        execSync('pm2 --version', { stdio: 'pipe' });
        log('✅ PM2 is already installed', 'green');
    } catch (error) {
        log('📦 Installing PM2...', 'yellow');
        execSync('npm install -g pm2', { stdio: 'inherit' });
        log('✅ PM2 installed successfully', 'green');
    }

    // Create PM2 ecosystem file
    const ecosystemConfig = {
        apps: [{
            name: 'codeacademy-pro',
            script: 'production-ai-server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true
        }]
    };

    fs.writeFileSync('ecosystem.config.js', `module.exports = ${JSON.stringify(ecosystemConfig, null, 2)}`);
    log('✅ PM2 ecosystem file created', 'green');
}

async function deployToProduction() {
    log('\n🚀 Deploying to production...', 'blue');

    try {
        // Create logs directory
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }

        // Start with PM2
        execSync('pm2 start ecosystem.config.js --env production', { stdio: 'inherit' });
        log('✅ Application deployed with PM2', 'green');

        // Save PM2 configuration
        execSync('pm2 save', { stdio: 'inherit' });
        log('✅ PM2 configuration saved', 'green');

        // Setup PM2 startup script
        execSync('pm2 startup', { stdio: 'inherit' });
        log('✅ PM2 startup script configured', 'green');

        return true;
    } catch (error) {
        log('❌ Production deployment failed', 'red');
        log(error.message, 'red');
        return false;
    }
}

async function showDeploymentInfo() {
    log('\n📊 Deployment Information', 'blue');
    log('==========================', 'blue');
    log('✅ Backend deployed successfully!', 'green');
    log('\n🔗 Access your application:', 'yellow');
    log('   - Local: http://localhost:5000', 'green');
    log('   - Health Check: http://localhost:5000/health', 'green');
    log('   - API Base: http://localhost:5000/api', 'green');

    log('\n📋 Useful Commands:', 'yellow');
    log('   - View logs: pm2 logs codeacademy-pro', 'green');
    log('   - Restart: pm2 restart codeacademy-pro', 'green');
    log('   - Stop: pm2 stop codeacademy-pro', 'green');
    log('   - Status: pm2 status', 'green');

    log('\n🔧 Next Steps:', 'yellow');
    log('1. Configure your frontend to connect to the backend', 'green');
    log('2. Set up your domain and SSL certificate', 'green');
    log('3. Configure monitoring and alerting', 'green');
    log('4. Set up automated backups', 'green');

    log('\n🎉 Your CodeAcademy Pro backend is now live!', 'green');
}

async function main() {
    try {
        // Step 1: Check prerequisites
        const prereqOk = await checkPrerequisites();
        if (!prereqOk) {
            process.exit(1);
        }

        // Step 2: Setup environment
        await setupEnvironment();

        // Step 3: Install dependencies
        const depsOk = await installDependencies();
        if (!depsOk) {
            process.exit(1);
        }

        // Step 4: Database setup instructions
        await setupDatabase();

        // Step 5: Test backend
        const testOk = await testBackend();
        if (!testOk) {
            log('⚠️  Backend test failed, but continuing with deployment...', 'yellow');
        }

        // Step 6: Setup PM2
        await setupPM2();

        // Step 7: Deploy to production
        const deployOk = await deployToProduction();
        if (!deployOk) {
            process.exit(1);
        }

        // Step 8: Show deployment info
        await showDeploymentInfo();

    } catch (error) {
        log('❌ Deployment failed', 'red');
        log(error.message, 'red');
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Run the deployment script
if (require.main === module) {
    main();
}

module.exports = { main };