// Content script for Image to WebP Converter extension

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'convertSingleImage') {
        convertSingleImage(request.imageUrl);
    } else if (request.action === 'convertAllImages') {
        convertAllImagesOnPage();
    }
});

// Function to convert a single image
async function convertSingleImage(imageUrl) {
    try {
        showNotification('Converting image to WebP...', 'info');
        
        const convertedDataUrl = await convertImageToWebP(imageUrl);
        const filename = getWebPFileName(imageUrl);
        
        // Send to background script for download
        chrome.runtime.sendMessage({
            action: 'downloadConvertedImage',
            dataUrl: convertedDataUrl,
            filename: filename
        });
        
        showNotification('Image converted and downloaded!', 'success');
    } catch (error) {
        console.error('Error converting image:', error);
        showNotification('Failed to convert image', 'error');
    }
}

// Function to convert all images on the page
async function convertAllImagesOnPage() {
    try {
        const images = document.querySelectorAll('img');
        const validImages = Array.from(images).filter(img => {
            const src = img.src || img.getAttribute('data-src');
            return src && (src.includes('.png') || src.includes('.jpg') || src.includes('.jpeg'));
        });
        
        if (validImages.length === 0) {
            showNotification('No convertible images found on this page', 'info');
            return;
        }
        
        showNotification(`Found ${validImages.length} images to convert...`, 'info');
        
        for (let i = 0; i < validImages.length; i++) {
            const img = validImages[i];
            const src = img.src || img.getAttribute('data-src');
            
            try {
                showNotification(`Converting image ${i + 1} of ${validImages.length}...`, 'info');
                const convertedDataUrl = await convertImageToWebP(src);
                const filename = getWebPFileName(src);
                
                // Download the converted image
                chrome.runtime.sendMessage({
                    action: 'downloadConvertedImage',
                    dataUrl: convertedDataUrl,
                    filename: filename
                });
                
                // Small delay to prevent overwhelming the browser
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error converting image ${src}:`, error);
            }
        }
        
        showNotification('All images converted and downloaded!', 'success');
    } catch (error) {
        console.error('Error converting all images:', error);
        showNotification('Failed to convert some images', 'error');
    }
}

// Function to convert an image URL to WebP format
function convertImageToWebP(imageUrl) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Set CORS to allow cross-origin images
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            try {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Convert to WebP with 80% quality
                const dataUrl = canvas.toDataURL('image/webp', 0.8);
                resolve(dataUrl);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
    });
}

// Function to generate WebP filename from original URL
function getWebPFileName(imageUrl) {
    try {
        const url = new URL(imageUrl);
        const pathname = url.pathname;
        const filename = pathname.split('/').pop();
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        return `${nameWithoutExt}.webp`;
    } catch (error) {
        // Fallback if URL parsing fails
        const timestamp = new Date().getTime();
        return `converted_image_${timestamp}.webp`;
    }
}

// Function to show notification to user
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.getElementById('image-converter-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'image-converter-notification';
    
    // Set styles individually to avoid CSP violations
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '6px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.zIndex = '10000';
    notification.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    notification.style.fontSize = '14px';
    notification.style.maxWidth = '300px';
    notification.style.wordWrap = 'break-word';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Add context menu integration for images
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') {
        // Mark the image for potential conversion
        event.target.setAttribute('data-convertible', 'true');
    }
});

// Initialize content script
console.log('Image to WebP Converter content script loaded');
