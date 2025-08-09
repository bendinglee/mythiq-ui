// Mythiq Frontend Integration - Updated for API Gateway
// Replace the existing API calls in mythiq-ui with these implementations

class MythiqAPI {
    constructor() {
        // Use environment variable or fallback to production gateway
        this.baseURL = import.meta.env.VITE_GATEWAY_API || 'https://mythiq-gateway-production.up.railway.app/api/v1';
        this.timeout = 30000; // 30 seconds for AI operations
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(this.timeout)
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new Error('Request timed out. Please try again.');
            }
            throw error;
        }
    }

    // AI Assistant Integration
    async sendChatMessage(message) {
        return await this.makeRequest('/chat', 'POST', { message });
    }

    // Game Generation Integration
    async generateGame(gameData) {
        return await this.makeRequest('/generate-game', 'POST', gameData);
    }

    // Media Generation Integration
    async generateImage(imageData) {
        return await this.makeRequest('/generate-image', 'POST', imageData);
    }

    // Audio Generation Integration
    async generateAudio(audioData) {
        return await this.makeRequest('/generate-audio', 'POST', audioData);
    }

    // Video Generation Integration
    async generateVideo(videoData) {
        return await this.makeRequest('/generate-video', 'POST', videoData);
    }

    // Self-Learning AI Integration
    async optimizeContent(optimizationData) {
        return await this.makeRequest('/optimize', 'POST', optimizationData);
    }

    // Service Health Check
    async checkHealth() {
        return await this.makeRequest('/health');
    }

    // Service Status Check
    async getServiceStatus() {
        return await this.makeRequest('/services/status');
    }
}

// Initialize API client
const mythiqAPI = new MythiqAPI();

// Updated AI Assistant Implementation
class AIAssistant {
    constructor() {
        this.chatContainer = document.getElementById('ai-chat-container');
        this.messageInput = document.getElementById('ai-message-input');
        this.sendButton = document.getElementById('ai-send-button');
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    async sendMessage() {
        const message = this.messageInput?.value?.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessageToChat('user', message);
        this.messageInput.value = '';

        // Show loading state
        this.showLoadingState();

        try {
            const response = await mythiqAPI.sendChatMessage(message);
            this.hideLoadingState();
            
            if (response.reply) {
                this.addMessageToChat('assistant', response.reply);
            } else {
                this.addMessageToChat('assistant', 'I received your message but couldn\'t generate a response. Please try again.');
            }
        } catch (error) {
            this.hideLoadingState();
            this.addMessageToChat('assistant', `Error: ${error.message}`);
        }
    }

    addMessageToChat(sender, message) {
        if (!this.chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>${sender === 'user' ? 'You' : 'AI Assistant'}:</strong>
                <p>${message}</p>
            </div>
        `;
        
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    showLoadingState() {
        if (this.sendButton) {
            this.sendButton.disabled = true;
            this.sendButton.textContent = 'Sending...';
        }
    }

    hideLoadingState() {
        if (this.sendButton) {
            this.sendButton.disabled = false;
            this.sendButton.textContent = 'Send';
        }
    }
}

// Updated Media Studio Implementation
class MediaStudio {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Image Generation
        const imageButton = document.getElementById('generate-image-button');
        if (imageButton) {
            imageButton.addEventListener('click', () => this.generateImage());
        }

        // Audio Generation
        const audioButton = document.getElementById('generate-audio-button');
        if (audioButton) {
            audioButton.addEventListener('click', () => this.generateAudio());
        }

        // Video Generation
        const videoButton = document.getElementById('generate-video-button');
        if (videoButton) {
            videoButton.addEventListener('click', () => this.generateVideo());
        }
    }

    async generateImage() {
        const prompt = document.getElementById('image-prompt')?.value;
        if (!prompt) {
            this.showError('Please enter an image description');
            return;
        }

        this.showLoadingState('image');

        try {
            const response = await mythiqAPI.generateImage({ prompt });
            this.hideLoadingState('image');
            
            if (response.image_url || response.image_data) {
                this.displayImage(response.image_url || response.image_data);
                this.showSuccess('Image generated successfully!');
            } else {
                this.showError('Image generation failed. Please try again.');
            }
        } catch (error) {
            this.hideLoadingState('image');
            this.showError(`Image generation error: ${error.message}`);
        }
    }

    async generateAudio() {
        const prompt = document.getElementById('audio-prompt')?.value;
        const voiceType = document.getElementById('voice-select')?.value || 'female';
        
        if (!prompt) {
            this.showError('Please enter audio description');
            return;
        }

        this.showLoadingState('audio');

        try {
            const response = await mythiqAPI.generateAudio({ prompt, voice: voiceType });
            this.hideLoadingState('audio');
            
            if (response.audio_url || response.audio_data) {
                this.displayAudio(response.audio_url || response.audio_data);
                this.showSuccess('Audio generated successfully!');
            } else {
                this.showError('Audio generation failed. Please try again.');
            }
        } catch (error) {
            this.hideLoadingState('audio');
            this.showError(`Audio generation error: ${error.message}`);
        }
    }

    async generateVideo() {
        const prompt = document.getElementById('video-prompt')?.value;
        if (!prompt) {
            this.showError('Please enter video description');
            return;
        }

        this.showLoadingState('video');

        try {
            const response = await mythiqAPI.generateVideo({ prompt });
            this.hideLoadingState('video');
            
            if (response.video_url || response.video_data) {
                this.displayVideo(response.video_url || response.video_data);
                this.showSuccess('Video generated successfully!');
            } else {
                this.showError('Video generation failed. Please try again.');
            }
        } catch (error) {
            this.hideLoadingState('video');
            this.showError(`Video generation error: ${error.message}`);
        }
    }

    displayImage(imageData) {
        const container = document.getElementById('image-result-container');
        if (container) {
            container.innerHTML = `<img src="${imageData}" alt="Generated Image" style="max-width: 100%; height: auto;">`;
        }
    }

    displayAudio(audioData) {
        const container = document.getElementById('audio-result-container');
        if (container) {
            container.innerHTML = `<audio controls><source src="${audioData}" type="audio/wav">Your browser does not support audio.</audio>`;
        }
    }

    displayVideo(videoData) {
        const container = document.getElementById('video-result-container');
        if (container) {
            container.innerHTML = `<video controls style="max-width: 100%; height: auto;"><source src="${videoData}" type="video/mp4">Your browser does not support video.</video>`;
        }
    }

    showLoadingState(type) {
        const button = document.getElementById(`generate-${type}-button`);
        if (button) {
            button.disabled = true;
            button.textContent = `Generating ${type}...`;
        }
    }

    hideLoadingState(type) {
        const button = document.getElementById(`generate-${type}-button`);
        if (button) {
            button.disabled = false;
            button.textContent = `Generate ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.mythiq-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `mythiq-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AI Assistant
    new AIAssistant();
    
    // Initialize Media Studio
    new MediaStudio();
    
    // Check service health on load
    mythiqAPI.checkHealth().then(health => {
        console.log('Mythiq services health:', health);
    }).catch(error => {
        console.error('Health check failed:', error);
    });
});

// Export for use in other modules
window.MythiqAPI = mythiqAPI;
