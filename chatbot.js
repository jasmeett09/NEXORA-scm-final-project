// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotBox = document.getElementById('chatbotBox');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendMessage = document.getElementById('sendMessage');
    const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotBox.classList.toggle('active');
        if (chatbotBox.classList.contains('active')) {
            chatbotInput.focus();
        }
    });
    
    // Close chatbot
    closeChatbot.addEventListener('click', function() {
        chatbotBox.classList.remove('active');
    });
    
    // Send message function
    function sendUserMessage(message) {
        if (!message.trim()) return;
        
        // Add user message to chat
        const userMessageHTML = `
            <div class="message user-message">
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <span class="message-time">Just now</span>
            </div>
        `;
        
        chatbotMessages.insertAdjacentHTML('beforeend', userMessageHTML);
        
        // Clear input
        chatbotInput.value = '';
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Simulate bot thinking
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            
            // Add bot response to chat
            const botMessageHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <p>${botResponse}</p>
                    </div>
                    <span class="message-time">Just now</span>
                </div>
            `;
            
            chatbotMessages.insertAdjacentHTML('beforeend', botMessageHTML);
            
            // Scroll to bottom again
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);
    }
    
    // Send message on button click
    sendMessage.addEventListener('click', function() {
        sendUserMessage(chatbotInput.value);
    });
    
    // Send message on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage(chatbotInput.value);
        }
    });
    
    // Quick reply buttons
    quickReplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            sendUserMessage(message);
        });
    });
    
    // Simple bot response logic
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Product related queries
        if (lowerMessage.includes('product') || lowerMessage.includes('gadget') || lowerMessage.includes('device')) {
            return 'We offer a wide range of tech products including smartphones, laptops, smartwatches, and headphones. You can browse our categories to find what you\'re looking for. Would you like me to help you find something specific?';
        }
        
        // Order tracking
        else if (lowerMessage.includes('track') || lowerMessage.includes('order') || lowerMessage.includes('shipping')) {
            return 'You can track your order by logging into your account and visiting the "My Orders" section. Alternatively, you can use the tracking number provided in your order confirmation email. Do you need help finding your tracking number?';
        }
        
        // Return policy
        else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
            return 'We offer a 30-day return policy on all our products. Items must be in their original condition with all packaging and accessories. Would you like me to guide you through the return process?';
        }
        
        // Pricing
        else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('discount')) {
            return 'Our prices are competitive and we regularly offer discounts and promotions. You can find the current price of any product on its product page. We also have a sale section where you can find discounted items. Can I help you find a specific product?';
        }
        
        // Contact
        else if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('human') || lowerMessage.includes('support')) {
            return 'You can contact our customer support team at support@nexora.com or call us at +91 7025700968. Our support hours are Monday to Friday, 9 AM to 6 PM. Would you like me to connect you with a support agent?';
        }
        
        // Greetings
        else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
            return 'Hello there! How can I assist you with NEXORA\'s products or services today?';
        }
        
        // Thank you
        else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return 'You\'re welcome! Is there anything else I can help you with?';
        }
        
        // Default response
        else {
            return 'I\'m not sure I understand. Could you please rephrase your question? You can ask me about our products, order tracking, return policy, or contact information.';
        }
    }
});
