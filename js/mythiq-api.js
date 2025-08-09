/**
 * Mythiq API Client - Unified Frontend Integration
 * Replaces broken direct service calls with proper API gateway communication
 */

class MythiqAPI {
    constructor() {
        // Use the API gateway endpoint (will be updated for production)
        this.baseURL = 'http://localhost:5001/api/v1';
        this.requestId = 0;
    }

    /**
     * Generic API request method with proper error handling
     */
    async request(endpoint, data = {}, method = 'POST') {
        const requestId = ++this.requestId;
        
        try {
            const config = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (method === 'POST' && data) {
                config.body = JSON.stringify({
                    ...data,
                    requestId,
                    timestamp: new Date().toISOString()
                });
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    /**
     * Check API Gateway health
     */
    async checkHealth() {
        return this.request('/health', {}, 'GET');
    }

    /**
     * Check all backend services status
     */
    async checkServicesStatus() {
        return this.request('/services/status', {}, 'GET');
    }

    /**
     * Chat with AI Assistant - FIXED VERSION
     */
    async chatWithAgent(message) {
        if (!message || !message.trim()) {
            throw new Error('Message cannot be empty');
        }

        return this.request('/chat', { message: message.trim() });
    }

    /**
     * Generate Game - FIXED VERSION
     */
    async generateGame(gameData) {
        const requiredFields = ['description'];
        for (const field of requiredFields) {
            if (!gameData[field]) {
                throw new Error(`${field} is required for game generation`);
            }
        }

        return this.request('/generate/game', gameData);
    }

    /**
     * Generate Image - FIXED VERSION
     */
    async generateImage(prompt, style = 'realistic', quality = 'high') {
        if (!prompt || !prompt.trim()) {
            throw new Error('Image prompt cannot be empty');
        }

        return this.request('/generate/image', {
            prompt: prompt.trim(),
            style,
            quality
        });
    }

    /**
     * Generate Audio - FIXED VERSION
     */
    async generateAudio(prompt, voice = 'female', type = 'speech') {
        if (!prompt || !prompt.trim()) {
            throw new Error('Audio prompt cannot be empty');
        }

        return this.request('/generate/audio', {
            prompt: prompt.trim(),
            voice,
            type
        });
    }

    /**
     * Generate Video - FIXED VERSION
     */
    async generateVideo(prompt, style = 'cinematic', duration = 'short') {
        if (!prompt || !prompt.trim()) {
            throw new Error('Video prompt cannot be empty');
        }

        return this.request('/generate/video', {
            prompt: prompt.trim(),
            style,
            duration
        });
    }
}

/**
 * UI Helper Functions - Replace broken success messages
 */
class MythiqUI {
    constructor() {
        this.loadingElements = new Map();
    }

    /**
     * Show loading state - REPLACES false success messages
     */
    showLoading(elementId, message = 'Processing...') {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Store original content
        if (!this.loadingElements.has(elementId)) {
            this.loadingElements.set(elementId, element.innerHTML);
        }

        element.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <span class="loading-message">${message}</span>
            </div>
        `;
        element.classList.add('loading');
    }

    /**
     * Hide loading state
     */
    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const originalContent = this.loadingElements.get(elementId);
        if (originalContent) {
            element.innerHTML = originalContent;
            this.loadingElements.delete(elementId);
        }
        element.classList.remove('loading');
    }

    /**
     * Show real success message - ONLY after actual success
     */
    showSuccess(message, duration = 5000) {
        this.showNotification(message, 'success', duration);
    }

    /**
     * Show error message - REPLACES silent failures
     */
    showError(message, duration = 8000) {
        this.showNotification(message, 'error', duration);
    }

    /**
     * Show notification system
     */
    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications of the same type
        const existing = document.querySelectorAll(`.notification.${type}`);
        existing.forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Display generated image - REPLACES broken image display
     */
    displayImage(imageUrl, containerId, downloadUrl = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="generated-content">
                <img src="${imageUrl}" alt="Generated image" class="generated-image" 
                     onload="this.classList.add('loaded')" 
                     onerror="this.classList.add('error')">
                <div class="content-actions">
                    <button onclick="window.open('${imageUrl}', '_blank')" class="btn-secondary">
                        View Full Size
                    </button>
                    ${downloadUrl ? `<button onclick="MythiqUI.downloadFile('${downloadUrl}')" class="btn-primary">Download</button>` : ''}
                </div>
            </div>
        `;
        container.style.display = 'block';
    }

    /**
     * Display generated audio - REPLACES broken audio display
     */
    displayAudio(audioUrl, containerId, downloadUrl = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="generated-content">
                <audio controls class="generated-audio">
                    <source src="${audioUrl}" type="audio/mpeg">
                    <source src="${audioUrl}" type="audio/wav">
                    Your browser does not support the audio element.
                </audio>
                <div class="content-actions">
                    ${downloadUrl ? `<button onclick="MythiqUI.downloadFile('${downloadUrl}')" class="btn-primary">Download</button>` : ''}
                </div>
            </div>
        `;
        container.style.display = 'block';
    }

    /**
     * Display generated video - REPLACES broken video display
     */
    displayVideo(videoUrl, containerId, downloadUrl = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="generated-content">
                <video controls class="generated-video">
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video element.
                </video>
                <div class="content-actions">
                    ${downloadUrl ? `<button onclick="MythiqUI.downloadFile('${downloadUrl}')" class="btn-primary">Download</button>` : ''}
                </div>
            </div>
        `;
        container.style.display = 'block';
    }

    /**
     * Download file utility
     */
    static downloadFile(url, filename = null) {
        const a = document.createElement('a');
        a.href = url;
        if (filename) a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Global instances
window.mythiqAPI = new MythiqAPI();
window.mythiqUI = new MythiqUI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MythiqAPI, MythiqUI };
}

