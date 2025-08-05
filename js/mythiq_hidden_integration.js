/**
 * MYTHIQ HIDDEN SELF-LEARNING AI INTEGRATION
 * 
 * This script transparently integrates the self-learning AI system
 * into your main Mythiq UI without users knowing it exists.
 * 
 * Features:
 * - Transparent request routing through self-learning system
 * - Silent feedback collection from user interactions
 * - A/B testing for gradual feature rollout
 * - Background learning and improvement
 * - Fallback to original services if needed
 */

class MythiqHiddenAI {
    constructor() {
        this.selfLearningURL = 'https://mythiq-self-learning-ai-production.up.railway.app';
        this.originalServices = {
            chat: 'https://mythiq-ai-chat-production.up.railway.app',
            games: 'https://mythiq-game-creator-production.up.railway.app',
            images: 'https://mythiq-image-generator-production.up.railway.app',
            audio: 'https://mythiq-audio-creator-production.up.railway.app',
            video: 'https://mythiq-video-creator-production.up.railway.app'
        };
        
        // A/B testing configuration (start with 20% of users)
        this.enabledForUser = Math.random() < 0.2;
        this.sessionId = this.generateSessionId();
        
        // Initialize hidden learning
        this.initializeHiddenLearning();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeHiddenLearning() {
        console.log('🧠 Mythiq Hidden AI: Initializing background learning...');
        
        // Track page interactions silently
        this.trackUserBehavior();
        
        // Initialize feedback collection
        this.setupFeedbackCollection();
        
        // Start background optimization
        this.startBackgroundOptimization();
    }

    /**
     * TRANSPARENT AI REQUEST ROUTING
     * Routes requests through self-learning system when enabled
     */
    async makeAIRequest(service, endpoint, data, originalFunction) {
        const startTime = Date.now();
        
        try {
            // If self-learning is enabled for this user, route through it
            if (this.enabledForUser) {
                const result = await this.routeThroughSelfLearning(service, endpoint, data);
                
                if (result && result.success) {
                    // Silently collect performance data
                    this.collectPerformanceData(service, startTime, true, result);
                    return result;
                }
            }
            
            // Fallback to original service
            const result = await originalFunction();
            this.collectPerformanceData(service, startTime, false, result);
            return result;
            
        } catch (error) {
            console.log('🔄 Mythiq Hidden AI: Falling back to original service');
            const result = await originalFunction();
            this.collectPerformanceData(service, startTime, false, result);
            return result;
        }
    }

    async routeThroughSelfLearning(service, endpoint, data) {
        const response = await fetch(`${this.selfLearningURL}/api/models/select-optimal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': this.sessionId
            },
            body: JSON.stringify({
                service: service,
                endpoint: endpoint,
                data: data,
                user_context: this.getUserContext()
            })
        });
        
        return await response.json();
    }

    /**
     * SILENT FEEDBACK COLLECTION
     * Collects user behavior data without interrupting experience
     */
    trackUserBehavior() {
        // Track time spent on results
        this.trackResultViewTime();
        
        // Track regeneration requests (indicates dissatisfaction)
        this.trackRegenerationRequests();
        
        // Track downloads/saves (indicates satisfaction)
        this.trackContentSaves();
        
        // Track user ratings if available
        this.trackUserRatings();
    }

    trackResultViewTime() {
        let resultStartTime = null;
        
        // Track when user views AI-generated content
        document.addEventListener('DOMContentLoaded', () => {
            const resultContainers = document.querySelectorAll('.ai-result, .generated-content, .output-container');
            
            resultContainers.forEach(container => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            resultStartTime = Date.now();
                        } else if (resultStartTime) {
                            const viewTime = Date.now() - resultStartTime;
                            this.sendFeedback('view_time', {
                                duration: viewTime,
                                content_type: this.getContentType(container)
                            });
                            resultStartTime = null;
                        }
                    });
                });
                
                observer.observe(container);
            });
        });
    }

    trackRegenerationRequests() {
        // Monitor clicks on regenerate/try again buttons
        document.addEventListener('click', (event) => {
            const regenerateButtons = [
                'regenerate', 'try-again', 'generate-again', 
                'retry', 'new-generation', 'refresh-result'
            ];
            
            const isRegenerateButton = regenerateButtons.some(className => 
                event.target.classList.contains(className) ||
                event.target.id.includes(className)
            );
            
            if (isRegenerateButton) {
                this.sendFeedback('regeneration_request', {
                    button_type: event.target.className,
                    content_type: this.getContentTypeFromButton(event.target)
                });
            }
        });
    }

    trackContentSaves() {
        // Monitor downloads, saves, and shares
        document.addEventListener('click', (event) => {
            const saveActions = ['download', 'save', 'share', 'copy', 'export'];
            
            const isSaveAction = saveActions.some(action => 
                event.target.classList.contains(action) ||
                event.target.id.includes(action) ||
                event.target.textContent.toLowerCase().includes(action)
            );
            
            if (isSaveAction) {
                this.sendFeedback('content_saved', {
                    action_type: this.getSaveActionType(event.target),
                    content_type: this.getContentTypeFromButton(event.target)
                });
            }
        });
    }

    trackUserRatings() {
        // Monitor star ratings, thumbs up/down, etc.
        document.addEventListener('click', (event) => {
            // Star ratings
            if (event.target.classList.contains('star') || event.target.closest('.rating')) {
                const rating = this.extractRating(event.target);
                this.sendFeedback('user_rating', {
                    rating: rating,
                    max_rating: 5,
                    content_type: this.getContentTypeFromRating(event.target)
                });
            }
            
            // Thumbs up/down
            if (event.target.classList.contains('thumbs-up') || event.target.classList.contains('like')) {
                this.sendFeedback('user_rating', { rating: 5, max_rating: 5 });
            }
            
            if (event.target.classList.contains('thumbs-down') || event.target.classList.contains('dislike')) {
                this.sendFeedback('user_rating', { rating: 1, max_rating: 5 });
            }
        });
    }

    /**
     * BACKGROUND OPTIMIZATION
     * Continuously improves system performance
     */
    startBackgroundOptimization() {
        // Send usage patterns every 5 minutes
        setInterval(() => {
            this.sendUsagePatterns();
        }, 5 * 60 * 1000);
        
        // Update user preferences every 10 minutes
        setInterval(() => {
            this.updateUserPreferences();
        }, 10 * 60 * 1000);
        
        // Sync learning data every 15 minutes
        setInterval(() => {
            this.syncLearningData();
        }, 15 * 60 * 1000);
    }

    async sendUsagePatterns() {
        const patterns = {
            session_id: this.sessionId,
            most_used_features: this.getMostUsedFeatures(),
            peak_usage_times: this.getPeakUsageTimes(),
            preferred_styles: this.getPreferredStyles(),
            common_prompts: this.getCommonPrompts()
        };
        
        await this.sendToLearningEngine('usage_patterns', patterns);
    }

    async updateUserPreferences() {
        const preferences = {
            session_id: this.sessionId,
            content_preferences: this.analyzeContentPreferences(),
            quality_expectations: this.analyzeQualityExpectations(),
            speed_vs_quality: this.analyzeSpeedVsQuality()
        };
        
        await this.sendToLearningEngine('user_preferences', preferences);
    }

    /**
     * UTILITY FUNCTIONS
     */
    async sendFeedback(type, data) {
        try {
            await fetch(`${this.selfLearningURL}/api/feedback/collect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify({
                    type: type,
                    data: data,
                    timestamp: Date.now(),
                    user_agent: navigator.userAgent,
                    page_url: window.location.href
                })
            });
        } catch (error) {
            // Silent failure - don't interrupt user experience
            console.log('🔇 Mythiq Hidden AI: Feedback collection failed silently');
        }
    }

    async sendToLearningEngine(endpoint, data) {
        try {
            await fetch(`${this.selfLearningURL}/api/learning/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            // Silent failure
            console.log('🔇 Mythiq Hidden AI: Learning sync failed silently');
        }
    }

    collectPerformanceData(service, startTime, usedSelfLearning, result) {
        const performanceData = {
            service: service,
            response_time: Date.now() - startTime,
            used_self_learning: usedSelfLearning,
            success: result && result.success,
            session_id: this.sessionId,
            timestamp: Date.now()
        };
        
        this.sendFeedback('performance_data', performanceData);
    }

    getUserContext() {
        return {
            session_id: this.sessionId,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            page_url: window.location.href
        };
    }

    getContentType(element) {
        if (element.closest('.chat-response')) return 'chat';
        if (element.closest('.game-container')) return 'game';
        if (element.closest('.image-result')) return 'image';
        if (element.closest('.audio-result')) return 'audio';
        if (element.closest('.video-result')) return 'video';
        return 'unknown';
    }

    getContentTypeFromButton(button) {
        const parentClasses = button.closest('[class*="studio"], [class*="creator"], [class*="generator"]');
        if (parentClasses) {
            const className = parentClasses.className;
            if (className.includes('chat')) return 'chat';
            if (className.includes('game')) return 'game';
            if (className.includes('image') || className.includes('media')) return 'image';
            if (className.includes('audio')) return 'audio';
            if (className.includes('video')) return 'video';
        }
        return 'unknown';
    }

    extractRating(element) {
        // Try to extract rating from star elements
        const stars = element.closest('.rating').querySelectorAll('.star.active, .star.filled');
        return stars.length;
    }

    getMostUsedFeatures() {
        // Analyze localStorage or sessionStorage for usage patterns
        const usage = JSON.parse(localStorage.getItem('mythiq_usage') || '{}');
        return Object.entries(usage).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }

    getPeakUsageTimes() {
        const now = new Date();
        return {
            hour: now.getHours(),
            day_of_week: now.getDay(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    getPreferredStyles() {
        // Analyze recent prompts for style preferences
        const recentPrompts = JSON.parse(localStorage.getItem('recent_prompts') || '[]');
        return this.analyzeStylesFromPrompts(recentPrompts);
    }

    analyzeStylesFromPrompts(prompts) {
        const styleKeywords = {
            'realistic': ['realistic', 'photorealistic', 'real', 'photo'],
            'artistic': ['artistic', 'painting', 'art', 'creative'],
            'cartoon': ['cartoon', 'animated', 'cute', 'fun'],
            'professional': ['professional', 'business', 'formal', 'corporate'],
            'casual': ['casual', 'informal', 'relaxed', 'friendly']
        };
        
        const styleCounts = {};
        prompts.forEach(prompt => {
            Object.entries(styleKeywords).forEach(([style, keywords]) => {
                if (keywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
                    styleCounts[style] = (styleCounts[style] || 0) + 1;
                }
            });
        });
        
        return styleCounts;
    }
}

/**
 * INTEGRATION WRAPPER FUNCTIONS
 * Replace your existing AI calls with these
 */

// Initialize the hidden AI system
const mythiqHiddenAI = new MythiqHiddenAI();

// Wrapper for AI Chat requests
async function enhancedAIChat(message, originalChatFunction) {
    return await mythiqHiddenAI.makeAIRequest(
        'chat', 
        '/api/chat', 
        { message }, 
        originalChatFunction
    );
}

// Wrapper for Game Creator requests
async function enhancedGameCreator(prompt, originalGameFunction) {
    return await mythiqHiddenAI.makeAIRequest(
        'games', 
        '/api/create-game', 
        { prompt }, 
        originalGameFunction
    );
}

// Wrapper for Image Generator requests
async function enhancedImageGenerator(prompt, originalImageFunction) {
    return await mythiqHiddenAI.makeAIRequest(
        'images', 
        '/api/generate-image', 
        { prompt }, 
        originalImageFunction
    );
}

// Wrapper for Audio Creator requests
async function enhancedAudioCreator(text, voice, originalAudioFunction) {
    return await mythiqHiddenAI.makeAIRequest(
        'audio', 
        '/api/generate-speech', 
        { text, voice_preset: voice }, 
        originalAudioFunction
    );
}

// Wrapper for Video Creator requests
async function enhancedVideoCreator(prompt, originalVideoFunction) {
    return await mythiqHiddenAI.makeAIRequest(
        'video', 
        '/api/generate-video', 
        { prompt }, 
        originalVideoFunction
    );
}

/**
 * USAGE TRACKING HELPERS
 * Add these to track user interactions
 */

// Track feature usage
function trackFeatureUsage(feature) {
    const usage = JSON.parse(localStorage.getItem('mythiq_usage') || '{}');
    usage[feature] = (usage[feature] || 0) + 1;
    localStorage.setItem('mythiq_usage', JSON.stringify(usage));
}

// Track recent prompts for style analysis
function trackPrompt(prompt, feature) {
    const recentPrompts = JSON.parse(localStorage.getItem('recent_prompts') || '[]');
    recentPrompts.unshift({ prompt, feature, timestamp: Date.now() });
    
    // Keep only last 50 prompts
    if (recentPrompts.length > 50) {
        recentPrompts.splice(50);
    }
    
    localStorage.setItem('recent_prompts', JSON.stringify(recentPrompts));
}

// Export for use in your main UI
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MythiqHiddenAI,
        enhancedAIChat,
        enhancedGameCreator,
        enhancedImageGenerator,
        enhancedAudioCreator,
        enhancedVideoCreator,
        trackFeatureUsage,
        trackPrompt
    };
}

console.log('🧠 Mythiq Hidden AI: Integration loaded successfully');
console.log('🔬 Self-learning enabled for', mythiqHiddenAI.enabledForUser ? '20%' : '0%', 'of users');

