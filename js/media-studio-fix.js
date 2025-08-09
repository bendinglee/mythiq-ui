/**
 * Media Studio Fix - Replaces broken media generation functionality
 * This script fixes all media studios (Image, Audio, Video) to actually generate and display content
 */

class MediaStudioFix {
    constructor() {
        this.generationHistory = [];
        this.isInitialized = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.setupImageStudio();
        this.setupAudioStudio();
        this.setupVideoStudio();
        this.isInitialized = true;
        console.log('Media Studio Fix: Initialized successfully');
    }

    setupImageStudio() {
        // Find image generation elements
        const imageBtn = document.getElementById('generate-image-btn') ||
                        document.querySelector('button[onclick*="image"]') ||
                        document.querySelector('.generate-image');

        if (imageBtn) {
            // Remove old handlers and add new one
            imageBtn.onclick = null;
            imageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateImage();
            });
            console.log('Image Studio: Fixed generation button');
        }
    }

    setupAudioStudio() {
        // Find audio generation elements
        const audioBtn = document.getElementById('generate-audio-btn') ||
                        document.querySelector('button[onclick*="audio"]') ||
                        document.querySelector('.generate-audio');

        if (audioBtn) {
            // Remove old handlers and add new one
            audioBtn.onclick = null;
            audioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateAudio();
            });
            console.log('Audio Studio: Fixed generation button');
        }
    }

    setupVideoStudio() {
        // Find video generation elements
        const videoBtn = document.getElementById('generate-video-btn') ||
                        document.querySelector('button[onclick*="video"]') ||
                        document.querySelector('.generate-video');

        if (videoBtn) {
            // Remove old handlers and add new one
            videoBtn.onclick = null;
            videoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateVideo();
            });
            console.log('Video Studio: Fixed generation button');
        }
    }

    async generateImage() {
        const prompt = this.getInputValue('image-prompt', 'image') || 
                      this.getInputValue('prompt', 'image');
        const style = this.getSelectValue('image-style') || 'realistic';
        const quality = this.getSelectValue('image-quality') || 'high';

        if (!prompt) {
            window.mythiqUI.showError('Please enter an image description');
            return;
        }

        // Remove any existing false success messages
        this.removeFalseSuccessMessages();

        // Show proper loading state
        window.mythiqUI.showLoading('image-result', 'Generating image...');

        try {
            const response = await window.mythiqAPI.generateImage(prompt, style, quality);
            
            // Hide loading
            window.mythiqUI.hideLoading('image-result');
            
            if (response && response.imageUrl) {
                // Display the actual image
                window.mythiqUI.displayImage(
                    response.imageUrl, 
                    'image-result', 
                    response.downloadUrl
                );
                
                // Show REAL success message
                window.mythiqUI.showSuccess('Image generated successfully!');
                
                // Record for history
                this.recordGeneration('image', prompt, response);
            } else {
                throw new Error('No image URL received from service');
            }

        } catch (error) {
            window.mythiqUI.hideLoading('image-result');
            window.mythiqUI.showError(`Failed to generate image: ${error.message}`);
            console.error('Image generation error:', error);
        }
    }

    async generateAudio() {
        const prompt = this.getInputValue('audio-prompt', 'audio') || 
                      this.getInputValue('prompt', 'audio');
        const voice = this.getSelectValue('voice-select') || 'female';
        const type = this.getSelectValue('audio-type') || 'speech';

        if (!prompt) {
            window.mythiqUI.showError('Please enter audio description');
            return;
        }

        // Remove any existing false success messages
        this.removeFalseSuccessMessages();

        // Show proper loading state
        window.mythiqUI.showLoading('audio-result', 'Generating audio...');

        try {
            const response = await window.mythiqAPI.generateAudio(prompt, voice, type);
            
            // Hide loading
            window.mythiqUI.hideLoading('audio-result');
            
            if (response && response.audioUrl) {
                // Display the actual audio
                window.mythiqUI.displayAudio(
                    response.audioUrl, 
                    'audio-result', 
                    response.downloadUrl
                );
                
                // Show REAL success message
                window.mythiqUI.showSuccess('Audio generated successfully!');
                
                // Record for history
                this.recordGeneration('audio', prompt, response);
            } else {
                throw new Error('No audio URL received from service');
            }

        } catch (error) {
            window.mythiqUI.hideLoading('audio-result');
            window.mythiqUI.showError(`Failed to generate audio: ${error.message}`);
            console.error('Audio generation error:', error);
        }
    }

    async generateVideo() {
        const prompt = this.getInputValue('video-prompt', 'video') || 
                      this.getInputValue('prompt', 'video');
        const style = this.getSelectValue('video-style') || 'cinematic';
        const duration = this.getSelectValue('video-duration') || 'short';

        if (!prompt) {
            window.mythiqUI.showError('Please enter video description');
            return;
        }

        // Remove any existing false success messages
        this.removeFalseSuccessMessages();

        // Show proper loading state
        window.mythiqUI.showLoading('video-result', 'Generating video...');

        try {
            const response = await window.mythiqAPI.generateVideo(prompt, style, duration);
            
            // Hide loading
            window.mythiqUI.hideLoading('video-result');
            
            if (response && response.videoUrl) {
                // Display the actual video
                window.mythiqUI.displayVideo(
                    response.videoUrl, 
                    'video-result', 
                    response.downloadUrl
                );
                
                // Show REAL success message
                window.mythiqUI.showSuccess('Video generated successfully!');
                
                // Record for history
                this.recordGeneration('video', prompt, response);
            } else {
                throw new Error('No video URL received from service');
            }

        } catch (error) {
            window.mythiqUI.hideLoading('video-result');
            window.mythiqUI.showError(`Failed to generate video: ${error.message}`);
            console.error('Video generation error:', error);
        }
    }

    // Utility methods
    getInputValue(id, fallbackClass = null) {
        let element = document.getElementById(id);
        if (!element && fallbackClass) {
            element = document.querySelector(`input[class*="${fallbackClass}"]`) ||
                     document.querySelector(`textarea[class*="${fallbackClass}"]`);
        }
        return element ? element.value.trim() : '';
    }

    getSelectValue(id, fallbackClass = null) {
        let element = document.getElementById(id);
        if (!element && fallbackClass) {
            element = document.querySelector(`select[class*="${fallbackClass}"]`);
        }
        return element ? element.value : '';
    }

    removeFalseSuccessMessages() {
        // Remove any existing false success banners
        const successBanners = document.querySelectorAll('.success-banner, .alert-success, [class*="success"]');
        successBanners.forEach(banner => {
            if (banner.textContent.includes('generated successfully') || 
                banner.textContent.includes('success')) {
                banner.remove();
            }
        });
    }

    recordGeneration(type, prompt, response) {
        const record = {
            type,
            prompt,
            response,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        this.generationHistory.push(record);
        
        // Keep only last 50 generations
        if (this.generationHistory.length > 50) {
            this.generationHistory = this.generationHistory.slice(-50);
        }
        
        console.log(`${type} generation recorded:`, record);
    }

    getGenerationHistory() {
        return this.generationHistory;
    }
}

// Initialize the fix
window.mediaStudioFix = new MediaStudioFix();

// Also provide a manual initialization function
window.initMediaStudioFix = () => {
    if (!window.mediaStudioFix.isInitialized) {
        window.mediaStudioFix.init();
    }
};

