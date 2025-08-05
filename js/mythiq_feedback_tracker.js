/**
 * MYTHIQ FEEDBACK TRACKER
 * 
 * Advanced feedback collection system that silently gathers
 * user interaction data to improve AI performance over time.
 * 
 * Features:
 * - Silent user behavior tracking
 * - Quality assessment from interactions
 * - Performance metrics collection
 * - Preference learning
 * - Error pattern detection
 */

class MythiqFeedbackTracker {
    constructor(selfLearningURL, sessionId) {
        this.selfLearningURL = selfLearningURL;
        this.sessionId = sessionId;
        this.feedbackQueue = [];
        this.isOnline = navigator.onLine;
        this.batchSize = 10;
        this.flushInterval = 30000; // 30 seconds
        
        this.initializeTracking();
        this.startBatchProcessing();
        this.setupOfflineHandling();
    }

    initializeTracking() {
        // Track all user interactions with AI-generated content
        this.trackContentInteractions();
        this.trackUserSatisfactionSignals();
        this.trackPerformanceMetrics();
        this.trackErrorPatterns();
        this.trackUsagePatterns();
    }

    /**
     * CONTENT INTERACTION TRACKING
     * Monitors how users interact with AI-generated content
     */
    trackContentInteractions() {
        // Track scroll behavior on results
        this.trackScrollBehavior();
        
        // Track click patterns
        this.trackClickPatterns();
        
        // Track copy/paste actions
        this.trackCopyPasteActions();
        
        // Track time spent reading/viewing
        this.trackEngagementTime();
    }

    trackScrollBehavior() {
        let scrollData = {};
        
        document.addEventListener('scroll', this.throttle(() => {
            const aiResults = document.querySelectorAll('.ai-result, .generated-content, .output-container');
            
            aiResults.forEach((result, index) => {
                const rect = result.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const resultId = result.id || `result-${index}`;
                    
                    if (!scrollData[resultId]) {
                        scrollData[resultId] = {
                            first_view: Date.now(),
                            total_view_time: 0,
                            scroll_depth: 0,
                            content_type: this.getContentType(result)
                        };
                    }
                    
                    // Calculate scroll depth within the result
                    const scrollDepth = Math.min(100, Math.max(0, 
                        ((window.innerHeight - rect.top) / rect.height) * 100
                    ));
                    
                    scrollData[resultId].scroll_depth = Math.max(
                        scrollData[resultId].scroll_depth, 
                        scrollDepth
                    );
                }
            });
            
            // Send scroll data periodically
            this.queueFeedback('scroll_behavior', scrollData);
        }, 1000));
    }

    trackClickPatterns() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const aiResult = target.closest('.ai-result, .generated-content, .output-container');
            
            if (aiResult) {
                const clickData = {
                    element_type: target.tagName.toLowerCase(),
                    element_class: target.className,
                    element_id: target.id,
                    content_type: this.getContentType(aiResult),
                    click_position: {
                        x: event.clientX,
                        y: event.clientY
                    },
                    timestamp: Date.now()
                };
                
                this.queueFeedback('click_pattern', clickData);
            }
        });
    }

    trackCopyPasteActions() {
        document.addEventListener('copy', (event) => {
            const selection = window.getSelection().toString();
            const aiResult = event.target.closest('.ai-result, .generated-content, .output-container');
            
            if (aiResult && selection.length > 10) {
                const copyData = {
                    content_length: selection.length,
                    content_type: this.getContentType(aiResult),
                    partial_content: selection.substring(0, 100), // First 100 chars for analysis
                    timestamp: Date.now()
                };
                
                this.queueFeedback('content_copied', copyData);
            }
        });
    }

    trackEngagementTime() {
        const engagementData = new Map();
        
        // Use Intersection Observer for accurate visibility tracking
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const resultId = entry.target.id || entry.target.dataset.resultId;
                
                if (entry.isIntersecting) {
                    // Start tracking engagement
                    engagementData.set(resultId, {
                        start_time: Date.now(),
                        content_type: this.getContentType(entry.target),
                        visibility_ratio: entry.intersectionRatio
                    });
                } else {
                    // End tracking engagement
                    const data = engagementData.get(resultId);
                    if (data) {
                        const engagementTime = Date.now() - data.start_time;
                        
                        this.queueFeedback('engagement_time', {
                            result_id: resultId,
                            engagement_time: engagementTime,
                            content_type: data.content_type,
                            avg_visibility: data.visibility_ratio
                        });
                        
                        engagementData.delete(resultId);
                    }
                }
            });
        }, { threshold: [0.1, 0.5, 0.9] });
        
        // Observe all AI result containers
        document.addEventListener('DOMContentLoaded', () => {
            const aiResults = document.querySelectorAll('.ai-result, .generated-content, .output-container');
            aiResults.forEach(result => observer.observe(result));
        });
    }

    /**
     * USER SATISFACTION SIGNALS
     * Detects implicit satisfaction/dissatisfaction signals
     */
    trackUserSatisfactionSignals() {
        // Track regeneration requests (dissatisfaction signal)
        this.trackRegenerationRequests();
        
        // Track sharing/saving (satisfaction signal)
        this.trackSharingBehavior();
        
        // Track rating interactions
        this.trackRatingInteractions();
        
        // Track quick exits (potential dissatisfaction)
        this.trackQuickExits();
    }

    trackRegenerationRequests() {
        const regenerateSelectors = [
            '[class*="regenerate"]', '[class*="retry"]', '[class*="try-again"]',
            '[id*="regenerate"]', '[id*="retry"]', '[id*="try-again"]',
            'button:contains("Regenerate")', 'button:contains("Try Again")',
            'button:contains("Retry")', 'button:contains("Generate Again")'
        ];
        
        document.addEventListener('click', (event) => {
            const isRegenerateButton = regenerateSelectors.some(selector => {
                try {
                    return event.target.matches(selector) || 
                           event.target.closest(selector);
                } catch (e) {
                    return false;
                }
            });
            
            if (isRegenerateButton) {
                const aiResult = event.target.closest('.ai-result, .generated-content, .output-container');
                
                this.queueFeedback('regeneration_request', {
                    content_type: this.getContentType(aiResult),
                    time_before_regeneration: this.getTimeOnPage(),
                    button_text: event.target.textContent.trim(),
                    timestamp: Date.now()
                });
            }
        });
    }

    trackSharingBehavior() {
        const shareSelectors = [
            '[class*="share"]', '[class*="download"]', '[class*="save"]',
            '[class*="export"]', '[class*="copy"]', '[id*="share"]',
            '[id*="download"]', '[id*="save"]', '[id*="export"]'
        ];
        
        document.addEventListener('click', (event) => {
            const isShareButton = shareSelectors.some(selector => {
                try {
                    return event.target.matches(selector) || 
                           event.target.closest(selector);
                } catch (e) {
                    return false;
                }
            });
            
            if (isShareButton) {
                const aiResult = event.target.closest('.ai-result, .generated-content, .output-container');
                
                this.queueFeedback('content_shared', {
                    content_type: this.getContentType(aiResult),
                    share_type: this.getShareType(event.target),
                    time_before_sharing: this.getTimeOnPage(),
                    timestamp: Date.now()
                });
            }
        });
    }

    trackRatingInteractions() {
        // Track star ratings
        document.addEventListener('click', (event) => {
            if (event.target.matches('.star, .rating-star') || 
                event.target.closest('.rating, .star-rating')) {
                
                const rating = this.extractRatingValue(event.target);
                const aiResult = event.target.closest('.ai-result, .generated-content, .output-container');
                
                this.queueFeedback('user_rating', {
                    rating: rating,
                    max_rating: 5,
                    content_type: this.getContentType(aiResult),
                    timestamp: Date.now()
                });
            }
        });
        
        // Track thumbs up/down
        document.addEventListener('click', (event) => {
            if (event.target.matches('.thumbs-up, .like-button, .upvote')) {
                this.queueFeedback('user_rating', { rating: 5, max_rating: 5 });
            }
            
            if (event.target.matches('.thumbs-down, .dislike-button, .downvote')) {
                this.queueFeedback('user_rating', { rating: 1, max_rating: 5 });
            }
        });
    }

    trackQuickExits() {
        let pageLoadTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - pageLoadTime;
            
            // If user leaves quickly after AI generation, it might indicate dissatisfaction
            if (timeOnPage < 10000) { // Less than 10 seconds
                this.queueFeedback('quick_exit', {
                    time_on_page: timeOnPage,
                    had_ai_results: document.querySelectorAll('.ai-result, .generated-content').length > 0,
                    timestamp: Date.now()
                });
            }
        });
    }

    /**
     * PERFORMANCE METRICS TRACKING
     * Monitors system performance and user experience
     */
    trackPerformanceMetrics() {
        // Track generation times
        this.trackGenerationTimes();
        
        // Track error rates
        this.trackErrorRates();
        
        // Track loading states
        this.trackLoadingStates();
    }

    trackGenerationTimes() {
        // Monitor AJAX requests to AI services
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = Date.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = Date.now();
                
                // Check if this is an AI service request
                if (this.isAIServiceRequest(url)) {
                    this.queueFeedback('generation_performance', {
                        service: this.getServiceFromURL(url),
                        response_time: endTime - startTime,
                        success: response.ok,
                        status_code: response.status,
                        timestamp: startTime
                    });
                }
                
                return response;
            } catch (error) {
                const endTime = Date.now();
                
                if (this.isAIServiceRequest(url)) {
                    this.queueFeedback('generation_error', {
                        service: this.getServiceFromURL(url),
                        response_time: endTime - startTime,
                        error_type: error.name,
                        error_message: error.message,
                        timestamp: startTime
                    });
                }
                
                throw error;
            }
        };
    }

    /**
     * UTILITY FUNCTIONS
     */
    queueFeedback(type, data) {
        this.feedbackQueue.push({
            type: type,
            data: data,
            session_id: this.sessionId,
            timestamp: Date.now(),
            user_agent: navigator.userAgent,
            page_url: window.location.href
        });
        
        // Flush if queue is full
        if (this.feedbackQueue.length >= this.batchSize) {
            this.flushFeedbackQueue();
        }
    }

    async flushFeedbackQueue() {
        if (this.feedbackQueue.length === 0 || !this.isOnline) {
            return;
        }
        
        const batch = this.feedbackQueue.splice(0, this.batchSize);
        
        try {
            await fetch(`${this.selfLearningURL}/api/feedback/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify({
                    feedback_batch: batch,
                    batch_size: batch.length,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            // Re-queue failed items
            this.feedbackQueue.unshift(...batch);
            console.log('🔇 Mythiq Feedback: Batch send failed, re-queued');
        }
    }

    startBatchProcessing() {
        setInterval(() => {
            this.flushFeedbackQueue();
        }, this.flushInterval);
    }

    setupOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.flushFeedbackQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    getContentType(element) {
        if (!element) return 'unknown';
        
        const classList = element.className.toLowerCase();
        const parentClasses = element.closest('[class*="studio"], [class*="creator"], [class*="generator"]');
        
        if (classList.includes('chat') || (parentClasses && parentClasses.className.includes('chat'))) return 'chat';
        if (classList.includes('game') || (parentClasses && parentClasses.className.includes('game'))) return 'game';
        if (classList.includes('image') || classList.includes('media') || (parentClasses && parentClasses.className.includes('image'))) return 'image';
        if (classList.includes('audio') || (parentClasses && parentClasses.className.includes('audio'))) return 'audio';
        if (classList.includes('video') || (parentClasses && parentClasses.className.includes('video'))) return 'video';
        
        return 'unknown';
    }

    getShareType(element) {
        const text = element.textContent.toLowerCase();
        const className = element.className.toLowerCase();
        
        if (text.includes('download') || className.includes('download')) return 'download';
        if (text.includes('share') || className.includes('share')) return 'share';
        if (text.includes('copy') || className.includes('copy')) return 'copy';
        if (text.includes('save') || className.includes('save')) return 'save';
        if (text.includes('export') || className.includes('export')) return 'export';
        
        return 'unknown';
    }

    extractRatingValue(element) {
        // Try to extract rating from various rating systems
        const ratingContainer = element.closest('.rating, .star-rating');
        if (ratingContainer) {
            const activeStars = ratingContainer.querySelectorAll('.star.active, .star.filled, .star.selected');
            if (activeStars.length > 0) return activeStars.length;
            
            // Try data attributes
            const rating = element.dataset.rating || ratingContainer.dataset.rating;
            if (rating) return parseInt(rating);
        }
        
        return 3; // Default neutral rating
    }

    isAIServiceRequest(url) {
        const aiServiceDomains = [
            'mythiq-ai-chat-production.up.railway.app',
            'mythiq-game-creator-production.up.railway.app',
            'mythiq-image-generator-production.up.railway.app',
            'mythiq-audio-creator-production.up.railway.app',
            'mythiq-video-creator-production.up.railway.app',
            'mythiq-self-learning-ai-production.up.railway.app'
        ];
        
        return aiServiceDomains.some(domain => url.includes(domain));
    }

    getServiceFromURL(url) {
        if (url.includes('chat')) return 'chat';
        if (url.includes('game')) return 'game';
        if (url.includes('image')) return 'image';
        if (url.includes('audio')) return 'audio';
        if (url.includes('video')) return 'video';
        if (url.includes('self-learning')) return 'self-learning';
        return 'unknown';
    }

    getTimeOnPage() {
        return Date.now() - (window.pageLoadTime || Date.now());
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize page load time tracking
window.pageLoadTime = Date.now();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MythiqFeedbackTracker;
}

console.log('📊 Mythiq Feedback Tracker: Advanced tracking system loaded');

