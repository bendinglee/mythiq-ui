#!/bin/bash

# Mythiq Platform Comprehensive Health Testing Script
# Enterprise-grade health monitoring with advanced features
# Version: 2.0
# Description: Comprehensive health checking for all Mythiq platform services

set -euo pipefail

# =============================================================================
# CONFIGURATION AND GLOBAL VARIABLES
# =============================================================================

# Script metadata
readonly SCRIPT_NAME="Mythiq Health Checker"
readonly SCRIPT_VERSION="2.0"
readonly SCRIPT_AUTHOR="Manus AI"

# Default configuration values
readonly DEFAULT_TIMEOUT=30
readonly DEFAULT_RETRIES=3
readonly DEFAULT_VERBOSE=false
readonly DEFAULT_CI_MODE=false
readonly DEFAULT_OUTPUT_FORMAT="console"

# Configuration from environment variables or defaults
TIMEOUT=${TEST_TIMEOUT:-$DEFAULT_TIMEOUT}
RETRIES=${TEST_RETRIES:-$DEFAULT_RETRIES}
VERBOSE=${TEST_VERBOSE:-$DEFAULT_VERBOSE}
CI_MODE=${CI:-$DEFAULT_CI_MODE}
OUTPUT_FORMAT=${TEST_OUTPUT_FORMAT:-$DEFAULT_OUTPUT_FORMAT}

# Service URLs configuration
MYTHIQ_UI_URL="https://mythiq-ui-production.up.railway.app"
MYTHIQ_AGENT_URL="https://mythiq-agent-production.up.railway.app"
MYTHIQ_ASSISTANT_URL="https://mythiq-assistant-production.up.railway.app"
MYTHIQ_GAME_URL="https://mythiq-game-maker-production.up.railway.app"
MYTHIQ_MEDIA_URL="https://mythiq-media-creator-production.up.railway.app"
MYTHIQ_AUDIO_URL="https://mythiq-audio-creator-production.up.railway.app"
MYTHIQ_VIDEO_URL="https://mythiq-video-creator-production.up.railway.app"
MYTHIQ_GATEWAY_URL="https://mythiq-gateway-production.up.railway.app"
MYTHIQ_SELF_LEARNING_URL="https://mythiq-self-learning-ai-production.up.railway.app"

# Test results tracking
declare -g TOTAL_TESTS=0
declare -g PASSED_TESTS=0
declare -g FAILED_TESTS=0
declare -g SKIPPED_TESTS=0
declare -g START_TIME
declare -g END_TIME

# Test results array for detailed reporting
declare -a TEST_RESULTS=()

# Colors for output (disabled in CI mode)
if [[ "$CI_MODE" == "true" ]]; then
    readonly RED=""
    readonly GREEN=""
    readonly YELLOW=""
    readonly BLUE=""
    readonly PURPLE=""
    readonly CYAN=""
    readonly WHITE=""
    readonly BOLD=""
    readonly RESET=""
else
    readonly RED='\033[0;31m'
    readonly GREEN='\033[0;32m'
    readonly YELLOW='\033[1;33m'
    readonly BLUE='\033[0;34m'
    readonly PURPLE='\033[0;35m'
    readonly CYAN='\033[0;36m'
    readonly WHITE='\033[1;37m'
    readonly BOLD='\033[1m'
    readonly RESET='\033[0m'
fi

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Print colored output with timestamp
print_message() {
    local color="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [[ "$OUTPUT_FORMAT" == "json" ]]; then
        return 0  # Skip console output in JSON mode
    fi
    
    echo -e "${color}[${timestamp}] ${message}${RESET}"
}

# Verbose logging function
log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        print_message "$CYAN" "VERBOSE: $1"
    fi
}

# Error logging function
log_error() {
    print_message "$RED" "ERROR: $1" >&2
}

# Success logging function
log_success() {
    print_message "$GREEN" "SUCCESS: $1"
}

# Warning logging function
log_warning() {
    print_message "$YELLOW" "WARNING: $1"
}

# Info logging function
log_info() {
    print_message "$BLUE" "INFO: $1"
}

# Record test result
record_test_result() {
    local test_name="$1"
    local status="$2"
    local duration="$3"
    local details="$4"
    local error_message="${5:-}"
    
    TEST_RESULTS+=("$test_name|$status|$duration|$details|$error_message")
    
    case "$status" in
        "PASS")
            ((PASSED_TESTS++))
            ;;
        "FAIL")
            ((FAILED_TESTS++))
            ;;
        "SKIP")
            ((SKIPPED_TESTS++))
            ;;
    esac
    
    ((TOTAL_TESTS++))
}

# Calculate duration in seconds
calculate_duration() {
    local start_time="$1"
    local end_time="$2"
    echo "scale=3; ($end_time - $start_time)" | bc -l 2>/dev/null || echo "0.000"
}

# =============================================================================
# CORE TESTING FUNCTIONS
# =============================================================================

# Test basic HTTP connectivity to a service
test_http_connectivity() {
    local service_name="$1"
    local service_url="$2"
    local expected_status="${3:-200}"
    
    log_verbose "Testing HTTP connectivity for $service_name at $service_url"
    
    local start_time=$(date +%s.%N)
    local response_code
    local curl_output
    local test_status="FAIL"
    local error_message=""
    
    for attempt in $(seq 1 "$RETRIES"); do
        log_verbose "Attempt $attempt/$RETRIES for $service_name"
        
        if curl_output=$(curl --silent --show-error --fail --max-time "$TIMEOUT" \
                              --write-out "%{http_code}" --output /dev/null "$service_url" 2>&1); then
            response_code="$curl_output"
            
            if [[ "$response_code" == "$expected_status" ]]; then
                test_status="PASS"
                log_success "$service_name HTTP connectivity: PASSED (HTTP $response_code)"
                break
            else
                error_message="Unexpected HTTP status: $response_code (expected $expected_status)"
                log_warning "$service_name returned HTTP $response_code (expected $expected_status)"
            fi
        else
            error_message="Connection failed: $curl_output"
            log_warning "$service_name connection attempt $attempt failed: $curl_output"
        fi
        
        if [[ $attempt -lt $RETRIES ]]; then
            log_verbose "Waiting 2 seconds before retry..."
            sleep 2
        fi
    done
    
    local end_time=$(date +%s.%N)
    local duration=$(calculate_duration "$start_time" "$end_time")
    
    if [[ "$test_status" == "FAIL" ]]; then
        log_error "$service_name HTTP connectivity: FAILED after $RETRIES attempts"
    fi
    
    record_test_result "HTTP_$service_name" "$test_status" "$duration" "HTTP connectivity test" "$error_message"
    
    return $([ "$test_status" == "PASS" ] && echo 0 || echo 1)
}

# Test health endpoint with JSON response validation
test_health_endpoint() {
    local service_name="$1"
    local service_url="$2"
    local health_endpoint="${3:-/health}"
    
    log_verbose "Testing health endpoint for $service_name at $service_url$health_endpoint"
    
    local start_time=$(date +%s.%N)
    local response_body
    local response_code
    local test_status="FAIL"
    local error_message=""
    
    for attempt in $(seq 1 "$RETRIES"); do
        log_verbose "Health check attempt $attempt/$RETRIES for $service_name"
        
        # Capture both response body and HTTP code
        local temp_file=$(mktemp)
        if response_code=$(curl --silent --show-error --max-time "$TIMEOUT" \
                               --write-out "%{http_code}" --output "$temp_file" \
                               "$service_url$health_endpoint" 2>/dev/null); then
            
            response_body=$(cat "$temp_file")
            rm -f "$temp_file"
            
            if [[ "$response_code" == "200" ]]; then
                # Validate JSON response if possible
                if command -v jq >/dev/null 2>&1; then
                    if echo "$response_body" | jq . >/dev/null 2>&1; then
                        test_status="PASS"
                        log_success "$service_name health endpoint: PASSED (Valid JSON response)"
                        log_verbose "Health response: $response_body"
                        break
                    else
                        error_message="Invalid JSON response: $response_body"
                        log_warning "$service_name returned invalid JSON"
                    fi
                else
                    # If jq is not available, just check for non-empty response
                    if [[ -n "$response_body" ]]; then
                        test_status="PASS"
                        log_success "$service_name health endpoint: PASSED (Non-empty response)"
                        break
                    else
                        error_message="Empty response body"
                        log_warning "$service_name returned empty response"
                    fi
                fi
            else
                error_message="HTTP $response_code: $response_body"
                log_warning "$service_name health check returned HTTP $response_code"
            fi
        else
            error_message="Connection failed to health endpoint"
            log_warning "$service_name health endpoint connection failed (attempt $attempt)"
        fi
        
        if [[ $attempt -lt $RETRIES ]]; then
            log_verbose "Waiting 2 seconds before retry..."
            sleep 2
        fi
    done
    
    local end_time=$(date +%s.%N)
    local duration=$(calculate_duration "$start_time" "$end_time")
    
    if [[ "$test_status" == "FAIL" ]]; then
        log_error "$service_name health endpoint: FAILED after $RETRIES attempts"
    fi
    
    record_test_result "HEALTH_$service_name" "$test_status" "$duration" "Health endpoint test" "$error_message"
    
    return $([ "$test_status" == "PASS" ] && echo 0 || echo 1)
}

# Test API endpoint with POST request
test_api_endpoint() {
    local service_name="$1"
    local service_url="$2"
    local endpoint="$3"
    local payload="$4"
    local expected_status="${5:-200}"
    
    log_verbose "Testing API endpoint $endpoint for $service_name"
    
    local start_time=$(date +%s.%N)
    local response_code
    local response_body
    local test_status="FAIL"
    local error_message=""
    
    local temp_file=$(mktemp)
    
    if response_code=$(curl --silent --show-error --max-time "$TIMEOUT" \
                           --header "Content-Type: application/json" \
                           --data "$payload" \
                           --write-out "%{http_code}" --output "$temp_file" \
                           "$service_url$endpoint" 2>/dev/null); then
        
        response_body=$(cat "$temp_file")
        rm -f "$temp_file"
        
        if [[ "$response_code" == "$expected_status" ]]; then
            test_status="PASS"
            log_success "$service_name API endpoint $endpoint: PASSED (HTTP $response_code)"
            log_verbose "API response: $response_body"
        else
            error_message="HTTP $response_code: $response_body"
            log_warning "$service_name API endpoint returned HTTP $response_code (expected $expected_status)"
        fi
    else
        error_message="Connection failed to API endpoint"
        log_error "$service_name API endpoint connection failed"
        rm -f "$temp_file"
    fi
    
    local end_time=$(date +%s.%N)
    local duration=$(calculate_duration "$start_time" "$end_time")
    
    record_test_result "API_${service_name}_${endpoint//\//_}" "$test_status" "$duration" "API endpoint test" "$error_message"
    
    return $([ "$test_status" == "PASS" ] && echo 0 || echo 1)
}

# Performance test with response time measurement
test_performance() {
    local service_name="$1"
    local service_url="$2"
    local threshold_ms="${3:-5000}"
    
    log_verbose "Testing performance for $service_name (threshold: ${threshold_ms}ms)"
    
    local start_time=$(date +%s.%N)
    local response_time
    local test_status="FAIL"
    local error_message=""
    
    if response_time=$(curl --silent --show-error --max-time "$TIMEOUT" \
                           --write-out "%{time_total}" --output /dev/null \
                           "$service_url" 2>/dev/null); then
        
        # Convert to milliseconds
        local response_time_ms=$(echo "scale=0; $response_time * 1000" | bc -l 2>/dev/null || echo "0")
        
        if (( $(echo "$response_time_ms <= $threshold_ms" | bc -l 2>/dev/null || echo "0") )); then
            test_status="PASS"
            log_success "$service_name performance: PASSED (${response_time_ms}ms <= ${threshold_ms}ms)"
        else
            error_message="Response time ${response_time_ms}ms exceeds threshold ${threshold_ms}ms"
            log_warning "$service_name performance: Response time ${response_time_ms}ms exceeds threshold"
        fi
    else
        error_message="Performance test connection failed"
        log_error "$service_name performance test failed"
    fi
    
    local end_time=$(date +%s.%N)
    local duration=$(calculate_duration "$start_time" "$end_time")
    
    record_test_result "PERF_$service_name" "$test_status" "$duration" "Performance test" "$error_message"
    
    return $([ "$test_status" == "PASS" ] && echo 0 || echo 1)
}

# =============================================================================
# TEST EXECUTION PHASES
# =============================================================================

# Phase 1: Infrastructure Health Checks
run_infrastructure_tests() {
    log_info "Starting Phase 1: Infrastructure Health Checks"
    
    # Define services for testing
    local -A services=(
        ["Frontend"]="$MYTHIQ_UI_URL"
        ["Agent"]="$MYTHIQ_AGENT_URL"
        ["Assistant"]="$MYTHIQ_ASSISTANT_URL"
        ["GameMaker"]="$MYTHIQ_GAME_URL"
        ["MediaCreator"]="$MYTHIQ_MEDIA_URL"
        ["AudioCreator"]="$MYTHIQ_AUDIO_URL"
        ["VideoCreator"]="$MYTHIQ_VIDEO_URL"
        ["Gateway"]="$MYTHIQ_GATEWAY_URL"
        ["SelfLearningAI"]="$MYTHIQ_SELF_LEARNING_URL"
    )
    
    # Test basic HTTP connectivity
    for service_name in "${!services[@]}"; do
        local service_url="${services[$service_name]}"
        test_http_connectivity "$service_name" "$service_url"
    done
    
    # Test health endpoints where available
    test_health_endpoint "Agent" "$MYTHIQ_AGENT_URL" "/health"
    test_health_endpoint "Assistant" "$MYTHIQ_ASSISTANT_URL" "/health"
    test_health_endpoint "GameMaker" "$MYTHIQ_GAME_URL" "/health"
    test_health_endpoint "MediaCreator" "$MYTHIQ_MEDIA_URL" "/health"
    test_health_endpoint "AudioCreator" "$MYTHIQ_AUDIO_URL" "/health"
    test_health_endpoint "VideoCreator" "$MYTHIQ_VIDEO_URL" "/health"
    
    log_info "Phase 1: Infrastructure Health Checks completed"
}

# Phase 2: AI Functionality Tests
run_ai_functionality_tests() {
    log_info "Starting Phase 2: AI Functionality Tests"
    
    # Test Agent chat endpoint
    local chat_payload='{"message": "Hello, this is a health check test"}'
    test_api_endpoint "Agent" "$MYTHIQ_AGENT_URL" "/chat" "$chat_payload" "200"
    
    # Test Agent process endpoint
    local process_payload='{"message": "Generate a simple test", "type": "test"}'
    test_api_endpoint "Agent" "$MYTHIQ_AGENT_URL" "/process" "$process_payload" "200"
    
    log_info "Phase 2: AI Functionality Tests completed"
}

# Phase 3: Performance Tests
run_performance_tests() {
    log_info "Starting Phase 3: Performance Tests"
    
    # Performance thresholds (in milliseconds)
    local frontend_threshold=3000
    local backend_threshold=5000
    
    # Test frontend performance
    test_performance "Frontend" "$MYTHIQ_UI_URL" "$frontend_threshold"
    
    # Test backend services performance
    test_performance "Agent" "$MYTHIQ_AGENT_URL" "$backend_threshold"
    test_performance "Assistant" "$MYTHIQ_ASSISTANT_URL" "$backend_threshold"
    
    log_info "Phase 3: Performance Tests completed"
}

# =============================================================================
# REPORTING FUNCTIONS
# =============================================================================

# Generate console report
generate_console_report() {
    echo
    print_message "$BOLD$WHITE" "=========================================="
    print_message "$BOLD$WHITE" "  MYTHIQ PLATFORM HEALTH TEST RESULTS"
    print_message "$BOLD$WHITE" "=========================================="
    echo
    
    # Test summary
    print_message "$BOLD$BLUE" "Test Summary:"
    echo "  Total Tests: $TOTAL_TESTS"
    echo "  Passed: $PASSED_TESTS"
    echo "  Failed: $FAILED_TESTS"
    echo "  Skipped: $SKIPPED_TESTS"
    echo
    
    # Calculate success rate
    local success_rate=0
    if [[ $TOTAL_TESTS -gt 0 ]]; then
        success_rate=$(echo "scale=1; ($PASSED_TESTS * 100) / $TOTAL_TESTS" | bc -l 2>/dev/null || echo "0")
    fi
    
    print_message "$BOLD$BLUE" "Success Rate: ${success_rate}%"
    echo
    
    # Execution time
    local total_duration=$(calculate_duration "$START_TIME" "$END_TIME")
    print_message "$BOLD$BLUE" "Total Execution Time: ${total_duration}s"
    echo
    
    # Detailed results
    if [[ "$VERBOSE" == "true" ]] || [[ $FAILED_TESTS -gt 0 ]]; then
        print_message "$BOLD$BLUE" "Detailed Results:"
        
        for result in "${TEST_RESULTS[@]}"; do
            IFS='|' read -r test_name status duration details error_message <<< "$result"
            
            local status_color="$GREEN"
            local status_symbol="✅"
            
            case "$status" in
                "FAIL")
                    status_color="$RED"
                    status_symbol="❌"
                    ;;
                "SKIP")
                    status_color="$YELLOW"
                    status_symbol="⏭️"
                    ;;
            esac
            
            echo -e "  ${status_symbol} ${status_color}${test_name}${RESET}: ${status} (${duration}s)"
            
            if [[ -n "$error_message" && "$status" == "FAIL" ]]; then
                echo -e "    ${RED}Error: ${error_message}${RESET}"
            fi
        done
        echo
    fi
    
    # Overall status
    if [[ $FAILED_TESTS -eq 0 ]]; then
        print_message "$BOLD$GREEN" "🎉 ALL TESTS PASSED! Platform is healthy."
    else
        print_message "$BOLD$RED" "🚨 $FAILED_TESTS TESTS FAILED! Platform requires attention."
    fi
    
    echo
    print_message "$BOLD$WHITE" "=========================================="
}

# Generate JSON report
generate_json_report() {
    local json_output="test-results/health-check-$(date +%Y%m%d-%H%M%S).json"
    
    # Create JSON structure
    cat > "$json_output" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "script_version": "$SCRIPT_VERSION",
  "configuration": {
    "timeout": $TIMEOUT,
    "retries": $RETRIES,
    "verbose": $VERBOSE,
    "ci_mode": $CI_MODE
  },
  "summary": {
    "total_tests": $TOTAL_TESTS,
    "passed_tests": $PASSED_TESTS,
    "failed_tests": $FAILED_TESTS,
    "skipped_tests": $SKIPPED_TESTS,
    "success_rate": $(echo "scale=2; ($PASSED_TESTS * 100) / $TOTAL_TESTS" | bc -l 2>/dev/null || echo "0"),
    "execution_time": $(calculate_duration "$START_TIME" "$END_TIME")
  },
  "results": [
EOF

    # Add test results
    local first_result=true
    for result in "${TEST_RESULTS[@]}"; do
        IFS='|' read -r test_name status duration details error_message <<< "$result"
        
        if [[ "$first_result" == "true" ]]; then
            first_result=false
        else
            echo "," >> "$json_output"
        fi
        
        cat >> "$json_output" << EOF
    {
      "test_name": "$test_name",
      "status": "$status",
      "duration": $duration,
      "details": "$details",
      "error_message": "$error_message"
    }EOF
    done
    
    cat >> "$json_output" << EOF

  ]
}
EOF

    log_info "JSON report saved to: $json_output"
}

# =============================================================================
# MAIN EXECUTION FUNCTIONS
# =============================================================================

# Display usage information
show_usage() {
    cat << EOF
$SCRIPT_NAME v$SCRIPT_VERSION

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --timeout SECONDS       Set timeout for HTTP requests (default: $DEFAULT_TIMEOUT)
    --retries COUNT         Set number of retry attempts (default: $DEFAULT_RETRIES)
    --verbose              Enable verbose output
    --ci                   Enable CI mode (no colors, structured output)
    --format FORMAT        Output format: console, json (default: $DEFAULT_OUTPUT_FORMAT)
    --phases PHASES        Run specific test phases: infrastructure, ai, performance, all (default: all)
    --help                 Show this help message

EXAMPLES:
    $0                                    # Run all tests with default settings
    $0 --verbose --timeout 60            # Run with verbose output and 60s timeout
    $0 --ci --format json                # Run in CI mode with JSON output
    $0 --phases infrastructure           # Run only infrastructure tests

ENVIRONMENT VARIABLES:
    TEST_TIMEOUT           Override default timeout
    TEST_RETRIES           Override default retry count
    TEST_VERBOSE           Enable verbose mode (true/false)
    TEST_OUTPUT_FORMAT     Set output format (console/json)
    CI                     Enable CI mode when set to 'true'

EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --timeout)
                TIMEOUT="$2"
                shift 2
                ;;
            --retries)
                RETRIES="$2"
                shift 2
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --ci)
                CI_MODE=true
                shift
                ;;
            --format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --phases)
                PHASES="$2"
                shift 2
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# Validate configuration
validate_configuration() {
    # Validate timeout
    if ! [[ "$TIMEOUT" =~ ^[0-9]+$ ]] || [[ $TIMEOUT -lt 1 ]]; then
        log_error "Invalid timeout value: $TIMEOUT (must be positive integer)"
        exit 1
    fi
    
    # Validate retries
    if ! [[ "$RETRIES" =~ ^[0-9]+$ ]] || [[ $RETRIES -lt 1 ]]; then
        log_error "Invalid retries value: $RETRIES (must be positive integer)"
        exit 1
    fi
    
    # Validate output format
    if [[ "$OUTPUT_FORMAT" != "console" && "$OUTPUT_FORMAT" != "json" ]]; then
        log_error "Invalid output format: $OUTPUT_FORMAT (must be 'console' or 'json')"
        exit 1
    fi
    
    # Check required commands
    local required_commands=("curl" "bc" "date")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log_error "Required command not found: $cmd"
            exit 1
        fi
    done
    
    # Create test-results directory if it doesn't exist
    mkdir -p test-results
}

# Main execution function
main() {
    # Initialize
    START_TIME=$(date +%s.%N)
    
    # Parse arguments
    parse_arguments "$@"
    
    # Validate configuration
    validate_configuration
    
    # Display header
    if [[ "$OUTPUT_FORMAT" == "console" ]]; then
        echo
        print_message "$BOLD$PURPLE" "🚀 $SCRIPT_NAME v$SCRIPT_VERSION"
        print_message "$BLUE" "Author: $SCRIPT_AUTHOR"
        print_message "$BLUE" "Timeout: ${TIMEOUT}s | Retries: $RETRIES | Verbose: $VERBOSE | CI Mode: $CI_MODE"
        echo
    fi
    
    # Run test phases
    local phases="${PHASES:-all}"
    
    case "$phases" in
        "infrastructure")
            run_infrastructure_tests
            ;;
        "ai"|"ai_functionality")
            run_ai_functionality_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "all"|*)
            run_infrastructure_tests
            run_ai_functionality_tests
            run_performance_tests
            ;;
    esac
    
    # Record end time
    END_TIME=$(date +%s.%N)
    
    # Generate reports
    case "$OUTPUT_FORMAT" in
        "json")
            generate_json_report
            ;;
        "console"|*)
            generate_console_report
            ;;
    esac
    
    # Exit with appropriate code
    if [[ $FAILED_TESTS -eq 0 ]]; then
        exit 0
    else
        exit 1
    fi
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

# Execute main function with all arguments
main "$@"
