// Background script for Image to WebP Converter extension

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Create context menu for images
    chrome.contextMenus.create({
        id: 'convertImageToWebP',
        title: 'Convert to WebP',
        contexts: ['image'],
        documentUrlPatterns: ['<all_urls>']
    });

    // Create context menu for page (to convert all images on page)
    chrome.contextMenus.create({
        id: 'convertAllImagesToWebP',
        title: 'Convert all images on page to WebP',
        contexts: ['page'],
        documentUrlPatterns: ['<all_urls>']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'convertImageToWebP') {
        // Convert single image
        convertSingleImage(info.srcUrl, tab.id);
    } else if (info.menuItemId === 'convertAllImagesToWebP') {
        // Convert all images on page
        convertAllImagesOnPage(tab.id);
    }
});

// Function to convert a single image
async function convertSingleImage(imageUrl, tabId) {
    try {
        // Send message to content script to handle the conversion
        chrome.tabs.sendMessage(tabId, {
            action: 'convertSingleImage',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error converting single image:', error);
    }
}

// Function to convert all images on a page
async function convertAllImagesOnPage(tabId) {
    try {
        // Send message to content script to handle the conversion
        chrome.tabs.sendMessage(tabId, {
            action: 'convertAllImages'
        });
    } catch (error) {
        console.error('Error converting all images:', error);
    }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadConvertedImage') {
        // Download the converted image
        chrome.downloads.download({
            url: request.dataUrl,
            filename: request.filename,
            saveAs: true
        });
    } else if (request.action === 'showNotification') {
        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Image Converter',
            message: request.message
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Open the popup (this is handled automatically by the manifest)
    // But we can also inject content script if needed
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});
