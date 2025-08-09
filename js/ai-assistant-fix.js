/**
 * AI Assistant Fix - Replaces broken chat functionality
 * This script fixes the AI Assistant tab to actually communicate with the backend
 */

class AIAssistantFix {
    constructor() {
        this.chatContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.isInitialized = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Find AI Assistant elements (adapt selectors as needed)
        this.chatContainer = document.getElementById('chat-container') || 
                           document.querySelector('.chat-container') ||
                           document.querySelector('[class*="chat"]');
        
        this.messageInput = document.getElementById('message-input') ||
                          document.querySelector('input[placeholder*="message"]') ||
                          document.querySelector('textarea[placeholder*="message"]');
        
        this.sendButton = document.getElementById('send-button') ||
                        document.querySelector('button[onclick*="send"]') ||
                        document.querySelector('.send-btn');

        if (this.messageInput && this.sendButton) {
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('AI Assistant Fix: Initialized successfully');
        } else {
            console.warn('AI Assistant Fix: Could not find required elements');
            // Try again in 1 second
            setTimeout(() => this.init(), 1000);
        }
    }

    setupEventListeners() {
        // Replace existing send button functionality
        this.sendButton.onclick = null; // Remove old handler
        this.sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Add Enter key support
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        console.log('AI Assistant Fix: Event listeners attached');
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Show user message immediately
        this.addMessage('user', message);
        this.messageInput.value = '';

        // Show loading state
        const loadingId = this.addMessage('assistant', 'Thinking...', true);

        try {
            // Use the fixed API
            const response = await window.mythiqAPI.chatWithAgent(message);
            
            // Remove loading message
            this.removeMessage(loadingId);
            
            // Show AI response
            if (response && response.message) {
                this.addMessage('assistant', response.message);
                window.mythiqUI.showSuccess('AI Assistant responded successfully!');
            } else {
                this.addMessage('assistant', 'I received your message but had trouble generating a response. Please try again.');
                window.mythiqUI.showError('AI Assistant response was incomplete');
            }

        } catch (error) {
            // Remove loading message
            this.removeMessage(loadingId);
            
            // Show error message
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again in a moment.');
            window.mythiqUI.showError(`AI Assistant error: ${error.message}`);
            
            console.error('AI Assistant error:', error);
        }
    }

    addMessage(sender, content, isLoading = false) {
        if (!this.chatContainer) {
            // Create chat container if it doesn't exist
            this.createChatContainer();
        }

        const messageId = Date.now() + Math.random();
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message ${isLoading ? 'loading' : ''}`;
        messageDiv.id = `message-${messageId}`;
        
        const senderName = sender === 'user' ? 'You' : 'AI Assistant';
        messageDiv.innerHTML = `
            <div class="message-header">
                <strong class="message-sender">${senderName}:</strong>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${content}</div>
        `;

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();

        return messageId;
    }

    removeMessage(messageId) {
        const element = document.getElementById(`message-${messageId}`);
        if (element) {
            element.remove();
        }
    }

    scrollToBottom() {
        if (this.chatContainer) {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    createChatContainer() {
        // Create a basic chat container if none exists
        const aiAssistantTab = document.querySelector('[data-tab="ai-assistant"]') ||
                              document.querySelector('.ai-assistant') ||
                              document.getElementById('ai-assistant');

        if (aiAssistantTab) {
            this.chatContainer = document.createElement('div');
            this.chatContainer.id = 'chat-container';
            this.chatContainer.className = 'chat-container';
            this.chatContainer.style.cssText = `
                height: 400px;
                overflow-y: auto;
                border: 1px solid #ddd;
                padding: 10px;
                margin-bottom: 10px;
                background: #f9f9f9;
            `;
            
            // Insert before the input area
            if (this.messageInput && this.messageInput.parentElement) {
                this.messageInput.parentElement.insertBefore(this.chatContainer, this.messageInput.parentElement.firstChild);
            } else {
                aiAssistantTab.appendChild(this.chatContainer);
            }
        }
    }
}

// Initialize the fix
window.aiAssistantFix = new AIAssistantFix();

// Also provide a manual initialization function
window.initAIAssistantFix = () => {
    if (!window.aiAssistantFix.isInitialized) {
        window.aiAssistantFix.init();
    }
};

