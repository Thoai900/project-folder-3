// Vercel Serverless Function for Prompt Refinement
// Refines user prompts to be more clear and effective using Gemini AI

// Helper to strip code fences and trim
function sanitizeText(text = '') {
    return text
        .replace(/```[a-zA-Z]*\s*/g, '')
        .replace(/```/g, '')
        .trim();
}

module.exports = async function handler(req, res) {
    // Set UTF-8 charset for all responses
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // Extract raw prompt from request body
        const { prompt, userApiKey } = req.body;

        // Validate input
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid "prompt" in request body.' });
        }

        if (prompt.trim().length < 5) {
            return res.status(400).json({ error: 'Prompt is too short. Please provide more context.' });
        }

        // Get API key from user-provided key OR environment variables (prefer Gemini, fallback OpenAI)
        let geminiKey = userApiKey || process.env.GEMINI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        if (!geminiKey && !openaiKey) {
            console.error('No AI API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY.');
            return res.status(500).json({ error: 'Server configuration error: missing AI API key.' });
        }

        // System instruction for prompt refinement
        const systemInstruction = `Bạn là chuyên gia Prompt Engineering. Hãy viết lại prompt của người dùng để nó rõ ràng, chuyên nghiệp và tối ưu hơn cho AI model. 

Quy tắc:
- Giữ nguyên ý định gốc của người dùng
- Thêm bối cảnh và cấu trúc nếu cần
- Làm cho prompt cụ thể, dễ hiểu hơn
- Chỉ trả về DUY NHẤT nội dung prompt mới
- KHÔNG thêm lời giải thích, mô tả hay markdown formatting
- KHÔNG nói "Đây là prompt đã được cải thiện" hay tương tự
- Trả về ngay prompt hoàn chỉnh, sẵn sàng để copy-paste`;

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
                                    text: `Prompt gốc: ${prompt}`
                                }
                            ]
                        }
                    ],
                    systemInstruction: {
                        parts: [
                            {
                                text: systemInstruction
                            }
                        ]
                    },
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 1000
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error('Gemini API Error:', data.error);
                // Fallback to OpenAI
                if (openaiKey) {
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
                                { role: 'system', content: systemInstruction },
                                { role: 'user', content: `Prompt gốc: ${prompt}` }
                            ],
                            temperature: 0.3,
                            max_tokens: 1000
                        })
                    });
                    const oaData = await oaResponse.json();
                    if (oaData.error) {
                        return res.status(oaResponse.status).json({ error: oaData.error.message || 'Error from OpenAI API' });
                    }
                    const refinedText = sanitizeText(oaData.choices?.[0]?.message?.content || prompt);
                    return res.status(200).json({ original: prompt, refined: refinedText.trim(), provider: 'openai', model: oaData.model || openaiModel });
                }
                return res.status(response.status).json({ error: data.error.message || 'Error from Gemini API' });
            }

            const refinedPrompt = sanitizeText(data.candidates?.[0]?.content?.parts?.[0]?.text || prompt);

            return res.status(200).json({ 
                original: prompt,
                refined: refinedPrompt.trim(),
                provider: 'gemini'
            });
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
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: `Prompt gốc: ${prompt}` }
                ],
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        const oaData = await oaResponse.json();

        if (oaData.error) {
            console.error('OpenAI API Error:', oaData.error);
            return res.status(oaResponse.status).json({ 
                error: oaData.error.message || 'Error from OpenAI API'
            });
        }

        const refinedText = sanitizeText(oaData.choices?.[0]?.message?.content || prompt);

        return res.status(200).json({
            original: prompt,
            refined: refinedText.trim(),
            provider: 'openai',
            model: oaData.model || openaiModel
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
