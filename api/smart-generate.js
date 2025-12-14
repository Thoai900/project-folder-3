// Vercel Serverless Function for Smart Prompt Generation
// Generates prompt templates from user ideas using Gemini AI

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // Extract idea from request body
        const { idea } = req.body;

        // Validate input
        if (!idea || typeof idea !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid "idea" in request body.' });
        }

        // Get API key from environment variables (prefer Gemini, fallback OpenAI)
        const geminiKey = process.env.GEMINI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;

        if (!geminiKey && !openaiKey) {
            console.error('No AI API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY in Vercel env.');
            return res.status(500).json({ error: 'Server configuration error: missing AI API key.' });
        }

        // System instruction for prompt generation
        const systemInstruction = `
            Bạn là chuyên gia Prompt Engineering. Tạo Prompt Template JSON từ ý tưởng của user.
            
            **YÊU CẦU CHẶT:**
            - Trả về JSON hợp lệ, KHÔNG bao quanh bởi markdown code blocks (\`\`\`).
            - Không thêm bất kỳ text, lời dẫn, mô tả hay giải thích nào ngoài JSON.
            - JSON phải chứa chính xác 4 trường: title, description, content, category
            - Không có dòng mới hay ký tự thêm ngoài JSON object
            
            Format JSON chỉ (KHÔNG thêm gì khác):
            {"title": "...", "description": "...", "content": "...", "category": "..."}
        `;

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
                                    text: `Ý tưởng: ${idea}`
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
                        responseMimeType: "application/json"
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error('Gemini API Error:', data.error);
                return res.status(response.status).json({ 
                    error: data.error.message || 'Error from Gemini API'
                });
            }

            return res.status(200).json({ ...data, provider: 'gemini' });
        }

        // Fallback: OpenAI (chat.completions) with JSON output
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
                    { role: 'user', content: `Ý tưởng: ${idea}` }
                ],
                response_format: { type: 'json_object' }
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

        // Wrap OpenAI response into Gemini-like shape for frontend compatibility
        return res.status(200).json({
            provider: 'openai',
            model: oaData.model || openaiModel,
            candidates: [
                {
                    content: {
                        parts: [
                            { text }
                        ]
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
