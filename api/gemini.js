// Vercel Serverless Function for Google Gemini API
// This function acts as a proxy to securely call Google Gemini API without exposing the API key

const admin = require('firebase-admin');

// Initialize Firebase Admin (Vercel provides env vars)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    });
}

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // Extract and verify Firebase ID Token (optional - allow anonymous access)
        const authHeader = req.headers.authorization;
        let decodedToken = null;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const idToken = authHeader.substring(7);
            try {
                decodedToken = await admin.auth().verifyIdToken(idToken);
            } catch (error) {
                console.warn('Token verification failed (continuing anyway):', error.message);
                // Continue without authentication
            }
        }

        // Extract prompt and temperature from request body
        const { prompt, temperature = 0.7 } = req.body;

        // Validate input
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid "prompt" in request body.' });
        }

        // Get API key from environment variables (prefer Gemini, fallback OpenAI)
        const geminiKey = process.env.GEMINI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!geminiKey && !openaiKey) {
            console.error('No AI API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY.');
            return res.status(500).json({ error: 'Server configuration error: missing AI API key.' });
        }

        if (geminiKey) {
            // Construct Google Gemini API URL
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiKey}`;

            // Call Google Gemini API
            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: temperature
                    }
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                console.error('Gemini API Error:', data.error || response.statusText);
                // Fallback to OpenAI if available
                if (openaiKey) {
                    try {
                        const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
                        const oaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${openaiKey}`
                            },
                            body: JSON.stringify({
                                model: openaiModel,
                                messages: [ { role: 'user', content: prompt } ],
                                temperature
                            })
                        });
                        const oaData = await oaResponse.json();
                        if (oaData.error) {
                            return res.status(oaResponse.status).json({ error: oaData.error.message || 'Error from OpenAI API' });
                        }
                        const text = oaData.choices?.[0]?.message?.content || '';
                        return res.status(200).json({
                            provider: 'openai',
                            model: oaData.model || openaiModel,
                            candidates: [ { content: { parts: [ { text } ] } } ]
                        });
                    } catch (e) {
                        return res.status(502).json({ error: 'Gemini failed and OpenAI fallback also failed.' });
                    }
                }
                return res.status(response.status).json({ error: data.error?.message || 'Error from Gemini API' });
            }

            return res.status(200).json({ ...data, provider: 'gemini' });
        }

        // Fallback: OpenAI
        const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const oaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: openaiModel,
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature
            })
        });

        const oaData = await oaResponse.json();

        if (oaData.error) {
            console.error('OpenAI API Error:', oaData.error);
            return res.status(oaResponse.status).json({ 
                error: oaData.error.message || 'Error from OpenAI API'
            });
        }

        const text = oaData.choices?.[0]?.message?.content || '';

        // Wrap to Gemini-like response
        return res.status(200).json({
            provider: 'openai',
            model: oaData.model || openaiModel,
            candidates: [
                {
                    content: {
                        parts: [ { text } ]
                    }
                }
            ]
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
