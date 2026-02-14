import { KILL_PHRASES, SYSTEM_PROMPT } from './constants';

export class HumanizerEngine {
    constructor() {
        this.killList = KILL_PHRASES;
    }

    async process(text, mode = 'lite', apiKey = null, settings = {}) {
        if (!text || text.trim().length === 0) {
            return {
                text: '',
                changes: [],
                risk: 'Low',
                riskReason: 'No text provided.'
            };
        }

        if (mode === 'pro' && apiKey) {
            return await this._processPro(text, apiKey, settings);
        } else {
            return this._processLite(text);
        }
    }

    _processLite(text) {
        let processedText = text;
        const changes = [];

        // 1. Kill Phrases Replacement
        Object.entries(this.killList).forEach(([phrase, replacements]) => {
            const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
            if (regex.test(processedText)) {
                const replacement = replacements[Math.floor(Math.random() * replacements.length)];
                // Store change before replacing
                // Find line number or context? For now just simple list.
                changes.push(`Replaced "${phrase}" with "${replacement}"`);
                processedText = processedText.replace(regex, replacement);
            }
        });

        // 2. Add imperfections (simple rule: avoid perfect capitalization sometimes? No, maybe too much).
        // Let's just add a "Look," or "Honestly," at start if it's short?
        // Keep it simple for Lite mode.

        return {
            text: processedText,
            changes: changes.length > 0 ? changes : ['No major "AI keywords" found in Lite mode.'],
            risk: this._calculateRisk(text), // Calculate risk on ORIGINAL text
            riskReason: 'Lite mode cleans specific keywords but basic structure remains.'
        };
    }

    async _processPro(text, apiKey, settings) {
        try {
            const { vibe = 'casual', chaos = 30, dialect = 'us' } = settings;

            let styleInstructions = '';
            if (vibe === 'professional') styleInstructions += '- Tone: Professional but conversational (like a senior engineer or exec).\n';
            else if (vibe === 'academic') styleInstructions += '- Tone: Academic but readable. Avoid jargon overload.\n';
            else if (vibe === 'aggressive') styleInstructions += '- Tone: Direct, punchy, persuasive. Short sentences.\n';
            else styleInstructions += '- Tone: Casual, friendly, like a Reddit comment or Slack message.\n';

            if (dialect === 'uk') styleInstructions += '- Spelling: UK English (colour, analyse, behaviour).\n';

            const imperfectionLevel = chaos > 70 ? 'High (typos, slang, run-ons)' : chaos > 30 ? 'Medium (casual grammar, fragments)' : 'Low (clean but natural)';
            styleInstructions += `- Imperfection Level: ${imperfectionLevel}\n`;

            // Basic fetch to Gemini API (assuming user provides valid key)
            // This is a placeholder for the actual API call structure.
            // We'll use the Generative Language API endpoint.
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${SYSTEM_PROMPT}\n\nADDITIONAL INSTRUCTIONS:\n${styleInstructions}\n\nTEXT TO REWRITE:\n${text}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const rewritten = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

            return {
                text: rewritten,
                changes: [`Style: ${vibe}`, `Chaos: ${chaos}%`, `Dialect: ${dialect.toUpperCase()}`],
                risk: 'Low',
                riskReason: 'Full AI rewrite applied with humanization prompt.'
            };

        } catch (error) {
            console.error("API Error:", error);
            return {
                text: text,
                changes: ['Error calling API: ' + error.message],
                risk: 'Unknown',
                riskReason: 'API Call Failed'
            };
        }
    }

    _calculateRisk(text) {
        // Simple heuristic: count occurrences of kill phrases
        let score = 0;
        const lower = text.toLowerCase();
        Object.keys(this.killList).forEach(phrase => {
            const matches = (lower.match(new RegExp(`\\b${phrase}\\b`, 'g')) || []).length;
            score += matches * 2; // Weight per phrase
        });

        // Check for "However," "Moreover," start of sentences
        const transitionMatches = (lower.match(/\b(however|moreover|furthermore),/g) || []).length;
        score += transitionMatches * 3;

        if (score > 10) return 'High';
        if (score > 4) return 'Medium';
        return 'Low';
    }
}
