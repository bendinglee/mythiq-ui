#!/usr/bin/env node

/**
 * Mythiq Platform Comprehensive Health Testing Suite
 * Enterprise-grade health monitoring with advanced Node.js features
 * Version: 2.0
 * Description: Advanced health checking for all Mythiq platform services
 */

const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');

// =============================================================================
// CONFIGURATION AND CONSTANTS
// =============================================================================

const SCRIPT_NAME = 'Mythiq Health Checker (Node.js)';
const SCRIPT_VERSION = '2.0';
const SCRIPT_AUTHOR = 'Manus AI';

// Default configuration
const DEFAULT_CONFIG = {
    timeout: 30000,
    retries: 3,
    verbose: false,
    ciMode: false,
    outputFormat: 'console',
    concurrency: 5,
    performanceThreshold: 5000
};

// Service URLs configuration
const SERVICE_URLS = {
    frontend: 'https://mythiq-ui-production.up.railway.app',
    agent: 'https://mythiq-agent-production.up.railway.app',
    assistant: 'https://mythiq-assistant-production.up.railway.app',
    gameMaker: 'https://mythiq-game-maker-production.up.railway.app',
    mediaCreator: 'https://mythiq-media-creator-production.up.railway.app',
    audioCreator: 'https://mythiq-audio-creator-production.up.railway.app',
    videoCreator: 'https://mythiq-video-creator-production.up.railway.app',
    gateway: 'https://mythiq-gateway-production.up.railway.app',
    selfLearningAI: 'https://mythiq-self-learning-ai-production.up.railway.app'
};

// Test result tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    startTime: null,
    endTime: null,
    details: []
};

// Configuration from environment variables or defaults
const config = {
    timeout: parseInt(process.env.TEST_TIMEOUT) || DEFAULT_CONFIG.timeout,
    retries: parseInt(process.env.TEST_RETRIES) || DEFAULT_CONFIG.retries,
    verbose: process.env.TEST_VERBOSE === 'true' || DEFAULT_CONFIG.verbose,
    ciMode: process.env.CI === 'true' || DEFAULT_CONFIG.ciMode,
    outputFormat: process.env.TEST_OUTPUT_FORMAT || DEFAULT_CONFIG.outputFormat,
    concurrency: parseInt(process.env.TEST_CONCURRENCY) || DEFAULT_CONFIG.concurrency,
    performanceThreshold: parseInt(process.env.TEST_PERFORMANCE_THRESHOLD) || DEFAULT_CONFIG.performanceThreshold
};

// Colors for console output (disabled in CI mode)
const colors = config.ciMode ? {
    red: '', green: '', yellow: '', blue: '', purple: '', cyan: '', white: '', bold: '', reset: ''
} : {
    red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m',
    purple: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m', bold: '\x1b[1m', reset: '\x1b[0m'
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Print colored message with timestamp
 */
function printMessage(color, message) {
    if (config.outputFormat === 'json') return;
    
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

/**
 * Logging functions
 */
const logger = {
    verbose: (msg) => config.verbose && printMessage(colors.cyan, `VERBOSE: ${msg}`),
    error: (msg) => printMessage(colors.red, `ERROR: ${msg}`),
    success: (msg) => printMessage(colors.green, `SUCCESS: ${msg}`),
    warning: (msg) => printMessage(colors.yellow, `WARNING: ${msg}`),
    info: (msg) => printMessage(colors.blue, `INFO: ${msg}`)
};

/**
 * Record test result
 */
function recordTestResult(testName, status, duration, details, errorMessage = '') {
    testResults.details.push({
        testName,
        status,
        duration,
        details,
        errorMessage,
        timestamp: new Date().toISOString()
    });
    
    testResults.total++;
    switch (status) {
        case 'PASS': testResults.passed++; break;
        case 'FAIL': testResults.failed++; break;
        case 'SKIP': testResults.skipped++; break;
    }
}

/**
 * Sleep function for delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse URL for HTTP/HTTPS request
 */
function parseUrl(url) {
    const urlObj = new URL(url);
    return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        isHttps: urlObj.protocol === 'https:'
    };
}

// =============================================================================
// CORE TESTING FUNCTIONS
// =============================================================================

/**
 * Make HTTP/HTTPS request with timeout and retry logic
 */
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlInfo = parseUrl(url);
        const requestModule = urlInfo.isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlInfo.hostname,
            port: urlInfo.port,
            path: urlInfo.path,
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: config.timeout
        };
        
        const req = requestModule.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    responseTime: performance.now() - startTime
                });
            });
        });
        
        const startTime = performance.now();
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

/**
 * Test HTTP connectivity with retry logic
 */
async function testHttpConnectivity(serviceName, serviceUrl, expectedStatus = 200) {
    logger.verbose(`Testing HTTP connectivity for ${serviceName} at ${serviceUrl}`);
    
    const startTime = performance.now();
    let lastError = null;
    
    for (let attempt = 1; attempt <= config.retries; attempt++) {
        logger.verbose(`Attempt ${attempt}/${config.retries} for ${serviceName}`);
        
        try {
            const response = await makeRequest(serviceUrl);
            
            if (response.statusCode === expectedStatus) {
                const duration = (performance.now() - startTime) / 1000;
                logger.success(`${serviceName} HTTP connectivity: PASSED (HTTP ${response.statusCode})`);
                recordTestResult(`HTTP_${serviceName}`, 'PASS', duration, 'HTTP connectivity test');
                return true;
            } else {
                lastError = `Unexpected HTTP status: ${response.statusCode} (expected ${expectedStatus})`;
                logger.warning(`${serviceName} returned HTTP ${response.statusCode} (expected ${expectedStatus})`);
            }
        } catch (error) {
            lastError = `Connection failed: ${error.message}`;
            logger.warning(`${serviceName} connection attempt ${attempt} failed: ${error.message}`);
        }
        
        if (attempt < config.retries) {
            logger.verbose('Waiting 2 seconds before retry...');
            await sleep(2000);
        }
    }
    
    const duration = (performance.now() - startTime) / 1000;
    logger.error(`${serviceName} HTTP connectivity: FAILED after ${config.retries} attempts`);
    recordTestResult(`HTTP_${serviceName}`, 'FAIL', duration, 'HTTP connectivity test', lastError);
    return false;
}

/**
 * Test health endpoint with JSON validation
 */
async function testHealthEndpoint(serviceName, serviceUrl, healthEndpoint = '/health') {
    logger.verbose(`Testing health endpoint for ${serviceName} at ${serviceUrl}${healthEndpoint}`);
    
    const startTime = performance.now();
    let lastError = null;
    
    for (let attempt = 1; attempt <= config.retries; attempt++) {
        logger.verbose(`Health check attempt ${attempt}/${config.retries} for ${serviceName}`);
        
        try {
            const response = await makeRequest(serviceUrl + healthEndpoint);
            
            if (response.statusCode === 200) {
                // Validate JSON response
                try {
                    const jsonData = JSON.parse(response.body);
                    const duration = (performance.now() - startTime) / 1000;
                    logger.success(`${serviceName} health endpoint: PASSED (Valid JSON response)`);
                    logger.verbose(`Health response: ${response.body}`);
                    recordTestResult(`HEALTH_${serviceName}`, 'PASS', duration, 'Health endpoint test');
                    return true;
                } catch (jsonError) {
                    // If not valid JSON, check for non-empty response
                    if (response.body.trim()) {
                        const duration = (performance.now() - startTime) / 1000;
                        logger.success(`${serviceName} health endpoint: PASSED (Non-empty response)`);
                        recordTestResult(`HEALTH_${serviceName}`, 'PASS', duration, 'Health endpoint test');
                        return true;
                    } else {
                        lastError = 'Empty response body';
                        logger.warning(`${serviceName} returned empty response`);
                    }
                }
            } else {
                lastError = `HTTP ${response.statusCode}: ${response.body}`;
                logger.warning(`${serviceName} health check returned HTTP ${response.statusCode}`);
            }
        } catch (error) {
            lastError = `Connection failed to health endpoint: ${error.message}`;
            logger.warning(`${serviceName} health endpoint connection failed (attempt ${attempt})`);
        }
        
        if (attempt < config.retries) {
            logger.verbose('Waiting 2 seconds before retry...');
            await sleep(2000);
        }
    }
    
    const duration = (performance.now() - startTime) / 1000;
    logger.error(`${serviceName} health endpoint: FAILED after ${config.retries} attempts`);
    recordTestResult(`HEALTH_${serviceName}`, 'FAIL', duration, 'Health endpoint test', lastError);
    return false;
}

/**
 * Test API endpoint with POST request
 */
async function testApiEndpoint(serviceName, serviceUrl, endpoint, payload, expectedStatus = 200) {
    logger.verbose(`Testing API endpoint ${endpoint} for ${serviceName}`);
    
    const startTime = performance.now();
    
    try {
        const response = await makeRequest(serviceUrl + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            body: payload
        });
        
        const duration = (performance.now() - startTime) / 1000;
        
        if (response.statusCode === expectedStatus) {
            logger.success(`${serviceName} API endpoint ${endpoint}: PASSED (HTTP ${response.statusCode})`);
            logger.verbose(`API response: ${response.body}`);
            recordTestResult(`API_${serviceName}_${endpoint.replace(/\//g, '_')}`, 'PASS', duration, 'API endpoint test');
            return true;
        } else {
            const errorMessage = `HTTP ${response.statusCode}: ${response.body}`;
            logger.warning(`${serviceName} API endpoint returned HTTP ${response.statusCode} (expected ${expectedStatus})`);
            recordTestResult(`API_${serviceName}_${endpoint.replace(/\//g, '_')}`, 'FAIL', duration, 'API endpoint test', errorMessage);
            return false;
        }
    } catch (error) {
        const duration = (performance.now() - startTime) / 1000;
        const errorMessage = `Connection failed to API endpoint: ${error.message}`;
        logger.error(`${serviceName} API endpoint connection failed`);
        recordTestResult(`API_${serviceName}_${endpoint.replace(/\//g, '_')}`, 'FAIL', duration, 'API endpoint test', errorMessage);
        return false;
    }
}

/**
 * Test performance with response time measurement
 */
async function testPerformance(serviceName, serviceUrl, thresholdMs = config.performanceThreshold) {
    logger.verbose(`Testing performance for ${serviceName} (threshold: ${thresholdMs}ms)`);
    
    const startTime = performance.now();
    
    try {
        const response = await makeRequest(serviceUrl);
        const responseTime = response.responseTime;
        const duration = (performance.now() - startTime) / 1000;
        
        if (responseTime <= thresholdMs) {
            logger.success(`${serviceName} performance: PASSED (${responseTime.toFixed(0)}ms <= ${thresholdMs}ms)`);
            recordTestResult(`PERF_${serviceName}`, 'PASS', duration, 'Performance test');
            return true;
        } else {
            const errorMessage = `Response time ${responseTime.toFixed(0)}ms exceeds threshold ${thresholdMs}ms`;
            logger.warning(`${serviceName} performance: Response time ${responseTime.toFixed(0)}ms exceeds threshold`);
            recordTestResult(`PERF_${serviceName}`, 'FAIL', duration, 'Performance test', errorMessage);
            return false;
        }
    } catch (error) {
        const duration = (performance.now() - startTime) / 1000;
        const errorMessage = `Performance test connection failed: ${error.message}`;
        logger.error(`${serviceName} performance test failed`);
        recordTestResult(`PERF_${serviceName}`, 'FAIL', duration, 'Performance test', errorMessage);
        return false;
    }
}

/**
 * Concurrent testing with controlled concurrency
 */
async function runConcurrentTests(testFunctions) {
    const results = [];
    const executing = [];
    
    for (const testFunc of testFunctions) {
        const promise = testFunc().then(result => {
            executing.splice(executing.indexOf(promise), 1);
            return result;
        });
        
        results.push(promise);
        executing.push(promise);
        
        if (executing.length >= config.concurrency) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}

// =============================================================================
// TEST EXECUTION PHASES
// =============================================================================

/**
 * Phase 1: Infrastructure Health Checks
 */
async function runInfrastructureTests() {
    logger.info('Starting Phase 1: Infrastructure Health Checks');
    
    const testFunctions = [];
    
    // Create test functions for HTTP connectivity
    for (const [serviceName, serviceUrl] of Object.entries(SERVICE_URLS)) {
        testFunctions.push(() => testHttpConnectivity(serviceName, serviceUrl));
    }
    
    // Add health endpoint tests
    const healthEndpoints = [
        ['agent', SERVICE_URLS.agent],
        ['assistant', SERVICE_URLS.assistant],
        ['gameMaker', SERVICE_URLS.gameMaker],
        ['mediaCreator', SERVICE_URLS.mediaCreator],
        ['audioCreator', SERVICE_URLS.audioCreator],
        ['videoCreator', SERVICE_URLS.videoCreator]
    ];
    
    for (const [serviceName, serviceUrl] of healthEndpoints) {
        testFunctions.push(() => testHealthEndpoint(serviceName, serviceUrl));
    }
    
    // Run tests concurrently
    await runConcurrentTests(testFunctions);
    
    logger.info('Phase 1: Infrastructure Health Checks completed');
}

/**
 * Phase 2: AI Functionality Tests
 */
async function runAiFunctionalityTests() {
    logger.info('Starting Phase 2: AI Functionality Tests');
    
    const testFunctions = [
        // Test Agent chat endpoint
        () => testApiEndpoint('Agent', SERVICE_URLS.agent, '/chat', 
            JSON.stringify({ message: 'Hello, this is a health check test' })),
        
        // Test Agent process endpoint
        () => testApiEndpoint('Agent', SERVICE_URLS.agent, '/process', 
            JSON.stringify({ message: 'Generate a simple test', type: 'test' }))
    ];
    
    await runConcurrentTests(testFunctions);
    
    logger.info('Phase 2: AI Functionality Tests completed');
}

/**
 * Phase 3: Performance Tests
 */
async function runPerformanceTests() {
    logger.info('Starting Phase 3: Performance Tests');
    
    const testFunctions = [
        // Frontend performance (3 second threshold)
        () => testPerformance('frontend', SERVICE_URLS.frontend, 3000),
        
        // Backend services performance (5 second threshold)
        () => testPerformance('agent', SERVICE_URLS.agent, 5000),
        () => testPerformance('assistant', SERVICE_URLS.assistant, 5000)
    ];
    
    await runConcurrentTests(testFunctions);
    
    logger.info('Phase 3: Performance Tests completed');
}

// =============================================================================
// REPORTING FUNCTIONS
// =============================================================================

/**
 * Generate console report
 */
function generateConsoleReport() {
    console.log();
    printMessage(colors.bold + colors.white, '==========================================');
    printMessage(colors.bold + colors.white, '  MYTHIQ PLATFORM HEALTH TEST RESULTS');
    printMessage(colors.bold + colors.white, '==========================================');
    console.log();
    
    // Test summary
    printMessage(colors.bold + colors.blue, 'Test Summary:');
    console.log(`  Total Tests: ${testResults.total}`);
    console.log(`  Passed: ${testResults.passed}`);
    console.log(`  Failed: ${testResults.failed}`);
    console.log(`  Skipped: ${testResults.skipped}`);
    console.log();
    
    // Calculate success rate
    const successRate = testResults.total > 0 ? 
        ((testResults.passed / testResults.total) * 100).toFixed(1) : 0;
    
    printMessage(colors.bold + colors.blue, `Success Rate: ${successRate}%`);
    console.log();
    
    // Execution time
    const totalDuration = ((testResults.endTime - testResults.startTime) / 1000).toFixed(3);
    printMessage(colors.bold + colors.blue, `Total Execution Time: ${totalDuration}s`);
    console.log();
    
    // Detailed results
    if (config.verbose || testResults.failed > 0) {
        printMessage(colors.bold + colors.blue, 'Detailed Results:');
        
        for (const result of testResults.details) {
            let statusColor = colors.green;
            let statusSymbol = '✅';
            
            switch (result.status) {
                case 'FAIL':
                    statusColor = colors.red;
                    statusSymbol = '❌';
                    break;
                case 'SKIP':
                    statusColor = colors.yellow;
                    statusSymbol = '⏭️';
                    break;
            }
            
            console.log(`  ${statusSymbol} ${statusColor}${result.testName}${colors.reset}: ${result.status} (${result.duration.toFixed(3)}s)`);
            
            if (result.errorMessage && result.status === 'FAIL') {
                console.log(`    ${colors.red}Error: ${result.errorMessage}${colors.reset}`);
            }
        }
        console.log();
    }
    
    // Overall status
    if (testResults.failed === 0) {
        printMessage(colors.bold + colors.green, '🎉 ALL TESTS PASSED! Platform is healthy.');
    } else {
        printMessage(colors.bold + colors.red, `🚨 ${testResults.failed} TESTS FAILED! Platform requires attention.`);
    }
    
    console.log();
    printMessage(colors.bold + colors.white, '==========================================');
}

/**
 * Generate JSON report
 */
async function generateJsonReport() {
    const jsonOutput = path.join('test-results', `health-check-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    
    const report = {
        timestamp: new Date().toISOString(),
        scriptVersion: SCRIPT_VERSION,
        configuration: config,
        summary: {
            totalTests: testResults.total,
            passedTests: testResults.passed,
            failedTests: testResults.failed,
            skippedTests: testResults.skipped,
            successRate: testResults.total > 0 ? 
                parseFloat(((testResults.passed / testResults.total) * 100).toFixed(2)) : 0,
            executionTime: parseFloat(((testResults.endTime - testResults.startTime) / 1000).toFixed(3))
        },
        results: testResults.details
    };
    
    try {
        await fs.writeFile(jsonOutput, JSON.stringify(report, null, 2));
        logger.info(`JSON report saved to: ${jsonOutput}`);
    } catch (error) {
        logger.error(`Failed to save JSON report: ${error.message}`);
    }
}

/**
 * Generate JUnit XML report
 */
async function generateJunitReport() {
    const xmlOutput = path.join('test-results', `health-check-${new Date().toISOString().replace(/[:.]/g, '-')}.xml`);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<testsuite name="Mythiq Health Tests" tests="${testResults.total}" failures="${testResults.failed}" skipped="${testResults.skipped}" time="${((testResults.endTime - testResults.startTime) / 1000).toFixed(3)}">\n`;
    
    for (const result of testResults.details) {
        xml += `  <testcase name="${result.testName}" classname="HealthTest" time="${result.duration.toFixed(3)}">\n`;
        
        if (result.status === 'FAIL') {
            xml += `    <failure message="${result.errorMessage}">${result.errorMessage}</failure>\n`;
        } else if (result.status === 'SKIP') {
            xml += `    <skipped/>\n`;
        }
        
        xml += `  </testcase>\n`;
    }
    
    xml += '</testsuite>\n';
    
    try {
        await fs.writeFile(xmlOutput, xml);
        logger.info(`JUnit XML report saved to: ${xmlOutput}`);
    } catch (error) {
        logger.error(`Failed to save JUnit XML report: ${error.message}`);
    }
}

// =============================================================================
// MAIN EXECUTION FUNCTIONS
// =============================================================================

/**
 * Display usage information
 */
function showUsage() {
    console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION}

USAGE:
    node ${path.basename(__filename)} [OPTIONS]

OPTIONS:
    --timeout MILLISECONDS  Set timeout for HTTP requests (default: ${DEFAULT_CONFIG.timeout})
    --retries COUNT         Set number of retry attempts (default: ${DEFAULT_CONFIG.retries})
    --verbose              Enable verbose output
    --ci                   Enable CI mode (no colors, structured output)
    --format FORMAT        Output format: console, json, junit (default: ${DEFAULT_CONFIG.outputFormat})
    --concurrency COUNT    Number of concurrent tests (default: ${DEFAULT_CONFIG.concurrency})
    --performance-threshold MS  Performance threshold in milliseconds (default: ${DEFAULT_CONFIG.performanceThreshold})
    --phases PHASES        Run specific test phases: infrastructure, ai, performance, all (default: all)
    --help                 Show this help message

EXAMPLES:
    node ${path.basename(__filename)}                                    # Run all tests with default settings
    node ${path.basename(__filename)} --verbose --timeout 60000         # Run with verbose output and 60s timeout
    node ${path.basename(__filename)} --ci --format json                # Run in CI mode with JSON output
    node ${path.basename(__filename)} --phases infrastructure           # Run only infrastructure tests

ENVIRONMENT VARIABLES:
    TEST_TIMEOUT           Override default timeout (milliseconds)
    TEST_RETRIES           Override default retry count
    TEST_VERBOSE           Enable verbose mode (true/false)
    TEST_OUTPUT_FORMAT     Set output format (console/json/junit)
    TEST_CONCURRENCY       Set concurrency level
    TEST_PERFORMANCE_THRESHOLD  Set performance threshold (milliseconds)
    CI                     Enable CI mode when set to 'true'
`);
}

/**
 * Parse command line arguments
 */
function parseArguments() {
    const args = process.argv.slice(2);
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--timeout':
                config.timeout = parseInt(args[++i]);
                break;
            case '--retries':
                config.retries = parseInt(args[++i]);
                break;
            case '--verbose':
                config.verbose = true;
                break;
            case '--ci':
                config.ciMode = true;
                break;
            case '--format':
                config.outputFormat = args[++i];
                break;
            case '--concurrency':
                config.concurrency = parseInt(args[++i]);
                break;
            case '--performance-threshold':
                config.performanceThreshold = parseInt(args[++i]);
                break;
            case '--phases':
                config.phases = args[++i];
                break;
            case '--help':
                showUsage();
                process.exit(0);
                break;
            default:
                logger.error(`Unknown option: ${args[i]}`);
                showUsage();
                process.exit(1);
        }
    }
}

/**
 * Validate configuration
 */
async function validateConfiguration() {
    // Validate timeout
    if (isNaN(config.timeout) || config.timeout < 1000) {
        logger.error(`Invalid timeout value: ${config.timeout} (must be >= 1000ms)`);
        process.exit(1);
    }
    
    // Validate retries
    if (isNaN(config.retries) || config.retries < 1) {
        logger.error(`Invalid retries value: ${config.retries} (must be >= 1)`);
        process.exit(1);
    }
    
    // Validate output format
    const validFormats = ['console', 'json', 'junit'];
    if (!validFormats.includes(config.outputFormat)) {
        logger.error(`Invalid output format: ${config.outputFormat} (must be one of: ${validFormats.join(', ')})`);
        process.exit(1);
    }
    
    // Validate concurrency
    if (isNaN(config.concurrency) || config.concurrency < 1) {
        logger.error(`Invalid concurrency value: ${config.concurrency} (must be >= 1)`);
        process.exit(1);
    }
    
    // Create test-results directory if it doesn't exist
    try {
        await fs.mkdir('test-results', { recursive: true });
    } catch (error) {
        logger.error(`Failed to create test-results directory: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Main execution function
 */
async function main() {
    try {
        // Initialize
        testResults.startTime = performance.now();
        
        // Parse arguments
        parseArguments();
        
        // Validate configuration
        await validateConfiguration();
        
        // Display header
        if (config.outputFormat === 'console') {
            console.log();
            printMessage(colors.bold + colors.purple, `🚀 ${SCRIPT_NAME} v${SCRIPT_VERSION}`);
            printMessage(colors.blue, `Author: ${SCRIPT_AUTHOR}`);
            printMessage(colors.blue, `Timeout: ${config.timeout}ms | Retries: ${config.retries} | Verbose: ${config.verbose} | CI Mode: ${config.ciMode}`);
            console.log();
        }
        
        // Run test phases
        const phases = config.phases || 'all';
        
        switch (phases) {
            case 'infrastructure':
                await runInfrastructureTests();
                break;
            case 'ai':
            case 'ai_functionality':
                await runAiFunctionalityTests();
                break;
            case 'performance':
                await runPerformanceTests();
                break;
            case 'all':
            default:
                await runInfrastructureTests();
                await runAiFunctionalityTests();
                await runPerformanceTests();
                break;
        }
        
        // Record end time
        testResults.endTime = performance.now();
        
        // Generate reports
        switch (config.outputFormat) {
            case 'json':
                await generateJsonReport();
                break;
            case 'junit':
                await generateJunitReport();
                break;
            case 'console':
            default:
                generateConsoleReport();
                break;
        }
        
        // Exit with appropriate code
        process.exit(testResults.failed === 0 ? 0 : 1);
        
    } catch (error) {
        logger.error(`Unexpected error: ${error.message}`);
        if (config.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// =============================================================================
// SCRIPT EXECUTION
// =============================================================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    if (config.verbose) {
        console.error(error.stack);
    }
    process.exit(1);
});

// Execute main function
if (require.main === module) {
    main();
}

module.exports = {
    main,
    testHttpConnectivity,
    testHealthEndpoint,
    testApiEndpoint,
    testPerformance,
    SERVICE_URLS,
    config
};
