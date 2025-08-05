/**
 * 🧪 Mythiq A/B Testing & Gradual Rollout System
 * 
 * Advanced system for gradually rolling out AI improvements to users
 * with A/B testing, performance comparison, and automatic optimization.
 * 
 * Features:
 * - Gradual rollout with percentage control
 * - A/B testing between original and enhanced AI
 * - Performance comparison and metrics
 * - Automatic rollout adjustment based on results
 * - User segmentation and targeting
 * - Rollback capabilities
 */

class MythiqABTesting {
    constructor() {
        this.learningSystemUrl = 'https://mythiq-self-learning-ai-production.up.railway.app';
        this.userId = this.getAnonymousUserId();
        this.sessionId = this.generateSessionId();
        
        // A/B Testing Configuration
        this.config = {
            enabled: true,
            rolloutPercentage: 25, // Start with 25% of users
            testDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            minSampleSize: 100, // Minimum users per group
            significanceLevel: 0.05, // 95% confidence
            autoAdjust: true, // Automatically adjust rollout based on performance
            maxRollout: 100, // Maximum rollout percentage
            rollbackThreshold: -0.1 // Rollback if performance drops by 10%
        };
        
        // Test Groups
        this.testGroups = {
            CONTROL: 'control', // Original AI services
            ENHANCED: 'enhanced' // Self-learning AI system
        };
        
        // User assignment
        this.userGroup = this.assignUserGroup();
        
        // Performance tracking
        this.performance = {
            responseTime: [],
            qualityScore: [],
            userSatisfaction: [],
            errorRate: [],
            engagementScore: []
        };
        
        // Test state
        this.testState = {
            startTime: Date.now(),
            isActive: true,
            currentPhase: 'initial',
            metrics: {}
        };
        
        this.init();
    }
    
    /**
     * Initialize A/B testing system
     */
    init() {
        console.log(`🧪 A/B Testing: User assigned to ${this.userGroup} group`);
        
        // Load test configuration from server
        this.loadTestConfiguration();
        
        // Start performance monitoring
        this.startPerformanceMonitoring();
        
        // Initialize test tracking
        this.initTestTracking();
        
        // Check for automatic adjustments
        if (this.config.autoAdjust) {
            this.startAutoAdjustment();
        }
    }
    
    /**
     * Get or create anonymous user ID
     */
    getAnonymousUserId() {
        let userId = localStorage.getItem('mythiq_ab_user_id');
        if (!userId) {
            userId = 'ab_' + Math.random().toString(36).substr(2, 12);
            localStorage.setItem('mythiq_ab_user_id', userId);
        }
        return userId;
    }
    
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'ab_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }
    
    /**
     * Assign user to test group
     */
    assignUserGroup() {
        // Check if user already has a group assignment
        let assignedGroup = localStorage.getItem('mythiq_ab_group');
        
        if (!assignedGroup) {
            // Use consistent hashing based on user ID for stable assignment
            const hash = this.hashUserId(this.userId);
            const percentage = hash % 100;
            
            assignedGroup = percentage < this.config.rolloutPercentage 
                ? this.testGroups.ENHANCED 
                : this.testGroups.CONTROL;
            
            localStorage.setItem('mythiq_ab_group', assignedGroup);
            localStorage.setItem('mythiq_ab_assignment_time', Date.now().toString());
        }
        
        return assignedGroup;
    }
    
    /**
     * Hash user ID for consistent assignment
     */
    hashUserId(userId) {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    /**
     * Load test configuration from server
     */
    async loadTestConfiguration() {
        try {
            const response = await fetch(`${this.learningSystemUrl}/api/models/ab-config`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const serverConfig = await response.json();
                
                // Update configuration with server values
                this.config = { ...this.config, ...serverConfig };
                
                // Check if user needs to be reassigned
                this.checkReassignment();
            }
        } catch (error) {
            console.error('🧪 Failed to load A/B config:', error);
        }
    }
    
    /**
     * Check if user needs to be reassigned based on new configuration
     */
    checkReassignment() {
        const currentPercentage = this.config.rolloutPercentage;
        const hash = this.hashUserId(this.userId);
        const userPercentile = hash % 100;
        
        // Reassign if rollout percentage changed
        if (userPercentile < currentPercentage && this.userGroup === this.testGroups.CONTROL) {
            this.userGroup = this.testGroups.ENHANCED;
            localStorage.setItem('mythiq_ab_group', this.userGroup);
            console.log('🧪 User reassigned to enhanced group');
        } else if (userPercentile >= currentPercentage && this.userGroup === this.testGroups.ENHANCED) {
            this.userGroup = this.testGroups.CONTROL;
            localStorage.setItem('mythiq_ab_group', this.userGroup);
            console.log('🧪 User reassigned to control group');
        }
    }
    
    /**
     * Check if user should use enhanced system
     */
    shouldUseEnhancedSystem() {
        return this.config.enabled && this.userGroup === this.testGroups.ENHANCED;
    }
    
    /**
     * Start performance monitoring for A/B testing
     */
    startPerformanceMonitoring() {
        // Monitor API response times
        this.interceptFetchForTiming();
        
        // Monitor user interactions
        this.monitorUserInteractions();
        
        // Monitor error rates
        this.monitorErrors();
        
        // Send performance data periodically
        setInterval(() => {
            this.sendPerformanceData();
        }, 60000); // Every minute
    }
    
    /**
     * Intercept fetch calls to measure response times
     */
    interceptFetchForTiming() {
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            const startTime = performance.now();
            
            try {
                const response = await originalFetch(url, options);
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                
                // Track response time for AI services
                if (this.isAIServiceUrl(url)) {
                    this.recordPerformanceMetric('responseTime', responseTime);
                    
                    // Track success/error rate
                    this.recordPerformanceMetric('errorRate', response.ok ? 0 : 1);
                }
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                
                // Track failed requests
                if (this.isAIServiceUrl(url)) {
                    this.recordPerformanceMetric('responseTime', responseTime);
                    this.recordPerformanceMetric('errorRate', 1);
                }
                
                throw error;
            }
        };
    }
    
    /**
     * Check if URL is an AI service
     */
    isAIServiceUrl(url) {
        if (typeof url !== 'string') return false;
        
        const aiServices = [
            'mythiq-ai-chat',
            'mythiq-game-creator',
            'mythiq-image-generator',
            'mythiq-audio-creator',
            'mythiq-video-creator',
            'mythiq-self-learning-ai'
        ];
        
        return aiServices.some(service => url.includes(service));
    }
    
    /**
     * Monitor user interactions for quality assessment
     */
    monitorUserInteractions() {
        let interactionCount = 0;
        let positiveInteractions = 0;
        
        // Track clicks on AI results
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            if (this.isAIResultElement(target)) {
                interactionCount++;
                
                // Determine if interaction is positive
                if (this.isPositiveInteraction(target, event)) {
                    positiveInteractions++;
                }
                
                // Calculate quality score
                const qualityScore = positiveInteractions / Math.max(1, interactionCount);
                this.recordPerformanceMetric('qualityScore', qualityScore);
            }
        }, { passive: true });
        
        // Track time spent on results
        this.trackResultViewTime();
    }
    
    /**
     * Check if element is an AI result
     */
    isAIResultElement(element) {
        const resultKeywords = ['result', 'output', 'generated', 'response'];
        const elementText = (element.className + element.id + element.textContent).toLowerCase();
        
        return resultKeywords.some(keyword => elementText.includes(keyword));
    }
    
    /**
     * Determine if interaction is positive
     */
    isPositiveInteraction(element, event) {
        // Positive indicators:
        // - Clicking on copy buttons
        // - Clicking on download buttons
        // - Clicking on share buttons
        // - Long hover time
        // - Multiple clicks on same result
        
        const positiveKeywords = ['copy', 'download', 'share', 'save', 'like'];
        const elementText = (element.className + element.id + element.textContent).toLowerCase();
        
        return positiveKeywords.some(keyword => elementText.includes(keyword));
    }
    
    /**
     * Track time spent viewing results
     */
    trackResultViewTime() {
        const resultElements = document.querySelectorAll('[class*="result"], [class*="output"], [id*="result"]');
        
        resultElements.forEach(element => {
            let viewStartTime = null;
            
            // Start timing when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !viewStartTime) {
                        viewStartTime = Date.now();
                    } else if (!entry.isIntersecting && viewStartTime) {
                        const viewTime = Date.now() - viewStartTime;
                        
                        // Record engagement score based on view time
                        const engagementScore = Math.min(1, viewTime / 10000); // 10 seconds = max score
                        this.recordPerformanceMetric('engagementScore', engagementScore);
                        
                        viewStartTime = null;
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    /**
     * Monitor JavaScript errors
     */
    monitorErrors() {
        window.addEventListener('error', (event) => {
            this.recordPerformanceMetric('errorRate', 1);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.recordPerformanceMetric('errorRate', 1);
        });
    }
    
    /**
     * Record performance metric
     */
    recordPerformanceMetric(metric, value) {
        if (!this.performance[metric]) {
            this.performance[metric] = [];
        }
        
        this.performance[metric].push({
            value: value,
            timestamp: Date.now(),
            group: this.userGroup
        });
        
        // Keep only recent data (last 1000 points)
        if (this.performance[metric].length > 1000) {
            this.performance[metric] = this.performance[metric].slice(-1000);
        }
    }
    
    /**
     * Send performance data to server
     */
    async sendPerformanceData() {
        if (Object.keys(this.performance).length === 0) return;
        
        const performanceData = {
            userId: this.userId,
            sessionId: this.sessionId,
            group: this.userGroup,
            performance: this.performance,
            testState: this.testState,
            timestamp: new Date().toISOString()
        };
        
        try {
            await fetch(`${this.learningSystemUrl}/api/models/ab-performance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(performanceData)
            });
            
            // Clear sent data
            this.performance = {
                responseTime: [],
                qualityScore: [],
                userSatisfaction: [],
                errorRate: [],
                engagementScore: []
            };
            
        } catch (error) {
            console.error('🧪 Failed to send performance data:', error);
        }
    }
    
    /**
     * Initialize test tracking
     */
    initTestTracking() {
        // Track test participation
        this.trackTestEvent('test_start', {
            group: this.userGroup,
            rolloutPercentage: this.config.rolloutPercentage,
            testDuration: this.config.testDuration
        });
        
        // Track session end
        window.addEventListener('beforeunload', () => {
            this.trackTestEvent('session_end', {
                sessionDuration: Date.now() - this.testState.startTime,
                performance: this.calculateSessionPerformance()
            });
        });
    }
    
    /**
     * Track test event
     */
    trackTestEvent(eventType, data) {
        const eventData = {
            userId: this.userId,
            sessionId: this.sessionId,
            group: this.userGroup,
            eventType: eventType,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        fetch(`${this.learningSystemUrl}/api/models/ab-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(error => {
            console.error('🧪 Failed to track test event:', error);
        });
    }
    
    /**
     * Calculate session performance summary
     */
    calculateSessionPerformance() {
        const summary = {};
        
        Object.keys(this.performance).forEach(metric => {
            const values = this.performance[metric].map(item => item.value);
            
            if (values.length > 0) {
                summary[metric] = {
                    count: values.length,
                    average: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values)
                };
            }
        });
        
        return summary;
    }
    
    /**
     * Start automatic adjustment system
     */
    startAutoAdjustment() {
        // Check for adjustments every hour
        setInterval(() => {
            this.checkAutoAdjustment();
        }, 60 * 60 * 1000);
    }
    
    /**
     * Check if automatic adjustment is needed
     */
    async checkAutoAdjustment() {
        try {
            const response = await fetch(`${this.learningSystemUrl}/api/models/ab-analysis`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const analysis = await response.json();
                
                // Check if adjustment is recommended
                if (analysis.recommendation) {
                    this.applyRecommendation(analysis.recommendation);
                }
            }
        } catch (error) {
            console.error('🧪 Auto-adjustment check failed:', error);
        }
    }
    
    /**
     * Apply recommendation from analysis
     */
    applyRecommendation(recommendation) {
        switch (recommendation.action) {
            case 'increase_rollout':
                this.increaseRollout(recommendation.newPercentage);
                break;
                
            case 'decrease_rollout':
                this.decreaseRollout(recommendation.newPercentage);
                break;
                
            case 'rollback':
                this.rollback(recommendation.reason);
                break;
                
            case 'full_rollout':
                this.fullRollout();
                break;
                
            default:
                console.log('🧪 No action needed');
        }
    }
    
    /**
     * Increase rollout percentage
     */
    increaseRollout(newPercentage) {
        this.config.rolloutPercentage = Math.min(newPercentage, this.config.maxRollout);
        this.checkReassignment();
        
        console.log(`🧪 Rollout increased to ${this.config.rolloutPercentage}%`);
        
        this.trackTestEvent('rollout_increase', {
            oldPercentage: this.config.rolloutPercentage,
            newPercentage: newPercentage
        });
    }
    
    /**
     * Decrease rollout percentage
     */
    decreaseRollout(newPercentage) {
        this.config.rolloutPercentage = Math.max(newPercentage, 0);
        this.checkReassignment();
        
        console.log(`🧪 Rollout decreased to ${this.config.rolloutPercentage}%`);
        
        this.trackTestEvent('rollout_decrease', {
            oldPercentage: this.config.rolloutPercentage,
            newPercentage: newPercentage
        });
    }
    
    /**
     * Rollback to control group
     */
    rollback(reason) {
        this.config.rolloutPercentage = 0;
        this.userGroup = this.testGroups.CONTROL;
        localStorage.setItem('mythiq_ab_group', this.userGroup);
        
        console.log(`🧪 Rollback initiated: ${reason}`);
        
        this.trackTestEvent('rollback', {
            reason: reason,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Full rollout to all users
     */
    fullRollout() {
        this.config.rolloutPercentage = 100;
        this.userGroup = this.testGroups.ENHANCED;
        localStorage.setItem('mythiq_ab_group', this.userGroup);
        
        console.log('🧪 Full rollout activated');
        
        this.trackTestEvent('full_rollout', {
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Get A/B testing status
     */
    getStatus() {
        return {
            userId: this.userId,
            sessionId: this.sessionId,
            userGroup: this.userGroup,
            config: this.config,
            testState: this.testState,
            performance: this.calculateSessionPerformance(),
            isEnhanced: this.shouldUseEnhancedSystem()
        };
    }
    
    /**
     * Force user into specific group (for testing)
     */
    forceGroup(group) {
        if (Object.values(this.testGroups).includes(group)) {
            this.userGroup = group;
            localStorage.setItem('mythiq_ab_group', group);
            console.log(`🧪 User forced into ${group} group`);
        }
    }
    
    /**
     * Reset user assignment
     */
    resetAssignment() {
        localStorage.removeItem('mythiq_ab_group');
        localStorage.removeItem('mythiq_ab_assignment_time');
        this.userGroup = this.assignUserGroup();
        console.log(`🧪 User reassigned to ${this.userGroup} group`);
    }
}

// Initialize A/B testing system
const mythiqABTesting = new MythiqABTesting();

// Export for integration and debugging
window.mythiqABTesting = mythiqABTesting;

// Expose debug functions in development
if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
    window.mythiqABDebug = {
        status: () => mythiqABTesting.getStatus(),
        forceControl: () => mythiqABTesting.forceGroup('control'),
        forceEnhanced: () => mythiqABTesting.forceGroup('enhanced'),
        reset: () => mythiqABTesting.resetAssignment(),
        performance: () => mythiqABTesting.calculateSessionPerformance()
    };
    console.log('🧪 A/B Testing Debug: Access via window.mythiqABDebug');
}

console.log('🧪 A/B Testing System: Ready');

