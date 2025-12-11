// Background Service Worker for Chrome Extension
// Handles messages between popup and content scripts

chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Prompt Refiner Extension installed successfully!');
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'refinePrompt') {
        // Forward refine request to API
        fetch('https://project-folder-1.vercel.app/api/refine-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: request.prompt
            })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ success: true, data });
        })
        .catch(error => {
            sendResponse({ success: false, error: error.message });
        });

        return true; // Keep message channel open for async response
    }
});
